import { NavBar } from "@/components/navBar";
import { ImageSource } from "@/pages/imageSource";
import { ExportPalette } from "./pages/exportPalette";
import { PresetSource } from "./pages/presetSource";
import { setupBackend } from "./services/setupBackend";
import { getState, setState, subscribe } from "./store/appStore";
import { View } from "./types";
import { loadAndCleanSVG } from "./utils/loadAndCleanSVG";

type Icon = {
  name: string;
  svg: string;
};

class App {
  private app: HTMLBodyElement;
  private icons!: Icon[];
  private navBar!: NavBar;
  private imageSource!: ImageSource;
  private presetSource!: PresetSource;
  private exportPalette!: ExportPalette;

  constructor() {
    const app = document.querySelector<HTMLBodyElement>("#app");
    if (!app) throw new Error("The main node was not found");
    this.app = app;

    this.init();
  }

  private async init() {
    await setupBackend();
    await this.setupElements();

    subscribe((newState) => {
      if (newState.view) {
        this.navBar.updateUI(newState.view);
        this.updateMainContent(newState.view);
      }
    });
  }

  private async setupElements() {
    await this.setupIcons();

    const view = getState().view;

    this.navBar = new NavBar({
      icons: this.icons,
      active: view,
      onClick: this.handleClickNav,
    });
    this.navBar.root.classList.add("w-full");

    this.imageSource = new ImageSource();
    this.presetSource = new PresetSource();
    this.exportPalette = new ExportPalette();

    this.app.append(this.navBar.root);
    this.updateMainContent(view);
  }

  private async setupIcons() {
    this.icons = [];
    const iconImage = {
      name: "image",
      svg: await loadAndCleanSVG("icons/image-round-symbolic.svg"),
    };

    const iconPreset = {
      name: "preset",
      svg: await loadAndCleanSVG("icons/color-symbolic.svg"),
    };

    const iconExport = {
      name: "export",
      svg: await loadAndCleanSVG("icons/extract-symbolic.svg"),
    };

    this.icons.push(iconImage, iconPreset, iconExport);
  }

  private handleClickNav(value: string) {
    setState({ view: value as View });
  }

  private updateMainContent(view: View) {
    if (view === "image") {
      this.exportPalette.root.remove();
      this.presetSource.root.remove();
      this.app.append(this.imageSource.root);
    }
    if (view === "preset") {
      this.imageSource.root.remove();
      this.exportPalette.root.remove();
      this.app.append(this.presetSource.root);
    }
    if (view === "export") {
      this.imageSource.root.remove();
      this.presetSource.root.remove();
      this.app.append(this.exportPalette.root);
    }
  }
}

new App();
