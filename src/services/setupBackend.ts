import { setState } from "@/store/appStore";
import { invoke } from "@tauri-apps/api/core";

export async function setupBackend() {
  new Promise<void>(async (resolve) => {
    const port = await invoke<number>("get_backend_port");
    setState({ backendURL: `http://127.0.0.1:${port}` });
    console.log(port);
    resolve();
  });
}
