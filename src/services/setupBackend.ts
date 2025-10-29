import { setState } from "@/store/appStore";
import { listen } from "@tauri-apps/api/event";

type BackendReadyPayload = {
  port: number;
};

export async function setupBackend() {
  new Promise<void>((resolve) => {
    listen<BackendReadyPayload>("backend-ready", (event) => {
      const { port } = event.payload;
      setState({ backendURL: `http://127.0.0.1:${port}` });
      resolve();
    });
  });
}
