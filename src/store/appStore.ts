import { Backend, CustomTemplate, View } from "@/types";

type TAppStore = {
  view: View;
  isImgInIDB: boolean;
  backend: Backend;
  colors: object;
  specialColors: object;
  lightMode: boolean;
  darkExtended: boolean;
  saturation: string;
  contrast: string;
  darkInPreset: boolean;
  template: string;
  customTemplate: CustomTemplate;
  backendURL: string;
};

type Listener = (newData: Partial<TAppStore>) => void;

const STORAGE_KEY = "appStore";

class AppStore {
  private state: TAppStore;
  private listeners: Listener[] = [];
  private initialState: TAppStore = {
    view: "image",
    isImgInIDB: false,
    backend: "wal",
    colors: {
      color0: "#1e1e1e",
      color1: "#f44747",
      color2: "#d7ba7d",
      color3: "#608b4e",
      color4: "#569cd6",
      color5: "#4ec9b0",
      color6: "#c586c0",
      color7: "#d4d4d4",
      color8: "#808080",
      color9: "#f44747",
      color10: "#d7ba7d",
      color11: "#608b4e",
      color12: "#569cd6",
      color13: "#4ec9b0",
      color14: "#c586c0",
      color15: "#d4d4d4",
    },
    specialColors: {
      background: "#1e1e1e",
      foreground: "#d4d4d4",
      cursor: "#f44747",
    },
    lightMode: false,
    darkExtended: true,
    saturation: "0",
    contrast: "4.5",
    darkInPreset: true,
    template: "css",
    customTemplate: {
      name: "",
      extension: "",
      content: "",
    },
    backendURL: "http://127.0.0.1:8000",
  };

  constructor(private storageKey: string) {
    this.state = this.getInitialState();
  }

  private getInitialState() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : this.initialState;
    } catch {
      return this.initialState;
    }
  }

  getState() {
    return this.state;
  }

  setState(partial: Partial<TAppStore>) {
    const newState = { ...this.state, ...partial };
    this.state = newState;
    localStorage.setItem(this.storageKey, JSON.stringify(newState));

    this.notify(partial);
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);

    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notify(newData: Partial<TAppStore>) {
    this.listeners.forEach((listener) => listener(newData));
  }
}

const appStore = new AppStore(STORAGE_KEY);
export const getState = () => appStore.getState();
export const setState = (partial: Partial<TAppStore>) =>
  appStore.setState(partial);
export const subscribe = (listener: (newData: Partial<TAppStore>) => void) =>
  appStore.subscribe(listener);
