use tauri::Manager;
use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;
use std::sync::{Arc, Mutex};
use tauri::Emitter;

#[derive(Clone, serde::Serialize)]
struct BackendReadyPayload {
    port: u16,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(target_os = "linux")]
    {
        std::env::set_var("WEBKIT_DISABLE_COMPOSITING_MODE", "1");
        std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
        std::env::set_var("GDK_BACKEND", "x11");
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            let sidecar_command = app.shell().sidecar("main")?;
            
            let backend_port = Arc::new(Mutex::new(None::<u16>));
            let backend_port_clone = backend_port.clone();
            
            tauri::async_runtime::spawn(async move {
                let (mut rx, _child) = sidecar_command
                    .spawn()
                    .expect("Failed to spawn backend");
                
                println!("Backend process started, waiting for port...");
                
                while let Some(event) = rx.recv().await {
                    match event {
                        CommandEvent::Stdout(line_bytes) => {
                            let line = String::from_utf8_lossy(&line_bytes);
                            let line_str = line.trim();
                            
                            if line_str.starts_with("SERVER_PORT:") {
                                if let Some(port_str) = line_str.strip_prefix("SERVER_PORT:") {
                                    if let Ok(port) = port_str.parse::<u16>() {
                                        *backend_port_clone.lock().unwrap() = Some(port);
                                        
                                        window
                                            .emit("backend-ready", BackendReadyPayload { port })
                                            .expect("Failed to emit backend-ready event");
                                        
                                        println!("✓ Backend ready on port: {}", port);
                                    }
                                }
                            } else {
                                println!("Backend: {}", line_str);
                            }
                        },
                        CommandEvent::Stderr(line_bytes) => {
                            let line = String::from_utf8_lossy(&line_bytes);
                            eprintln!("Backend error: {}", line.trim());
                        },
                        CommandEvent::Error(error) => {
                            eprintln!("Backend process error: {}", error);
                        },
                        CommandEvent::Terminated(payload) => {
                            println!("Backend terminated with code: {:?}", payload.code);
                            break;
                        },
                        _ => {}
                    }
                }
            });
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
