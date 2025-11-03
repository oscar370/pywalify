use std::net::TcpListener;
use std::sync::Mutex;
use tauri::State;
use tauri::App;
use tauri::Manager;
use tauri_plugin_shell::ShellExt;
use tauri::async_runtime::spawn;

pub struct BackendState {
    pub port: Mutex<Option<u16>>,
}

fn find_free_port() -> u16 {
    let listener = TcpListener::bind("127.0.0.1:0").expect("No free port could be found");
    let port = listener.local_addr().unwrap().port();

    port
}

pub fn start_backend(app: &App) -> Result<(), tauri::Error> {
    let port = find_free_port();

    let (mut rx, _child) = app
        .shell()
        .sidecar("main")
        .unwrap()
        .args([port.to_string()])
        .spawn()
        .unwrap();

    spawn(async move {
        while let Some(event) = rx.recv().await {
            match event {
                tauri_plugin_shell::process::CommandEvent::Stdout(line) => {
                    print!("{}", String::from_utf8_lossy(&line));
                }
                tauri_plugin_shell::process::CommandEvent::Stderr(line) => {
                    print!("{}", String::from_utf8_lossy(&line));
                }
                tauri_plugin_shell::process::CommandEvent::Terminated(_) => {
                    break;
                }
                _ => {}
            }
        }
    });

    let state: State<BackendState> = app.state();
    *state.port.lock().unwrap() = Some(port);

    Ok(())
}

#[tauri::command]
pub fn get_backend_port(state: State<BackendState>) -> Result<u16, String> {
    state.port
        .lock()
        .unwrap()
        .ok_or_else(|| "Backend not ready".to_string())
}
