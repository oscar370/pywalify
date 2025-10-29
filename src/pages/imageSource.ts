import { Button } from "@/components/button";
import { Config, ConfigElements } from "@/components/config";
import { PalettePreview } from "@/components/palettePreview";
import { UploadImage } from "@/components/uploadImage";
import generatePalette from "@/services/generatePalette";
import { getState, setState, subscribe } from "@/store/appStore";
import { addImage, getImage } from "@/store/imageStore";
import { Backend } from "@/types";
import { loadAndCleanSVG } from "@/utils/loadAndCleanSVG";

export class ImageSource {
  readonly root: HTMLElement;
  private uploadImage!: UploadImage;
  private paletteConfig!: Config;
  private generatePalette!: Button;
  private palettePreview!: PalettePreview;
  private paletteContainer!: HTMLDivElement;
  private specialColorsPreview!: PalettePreview;
  private specialColorsContainer!: HTMLDivElement;

  constructor() {
    this.root = document.createElement("main");
    this.root.classList.add("flex", "flex-col", "items-center", "w-full");

    this.setupElements();
    this.handleStateUpdates();
  }

  private async setupElements() {
    await this.setupImageUpload();
    this.setupPaletteConfig();
    this.setupGeneratePalette();
    this.setupPalettePreview();
    this.setupSpecialColorsPreview();

    this.root.append(
      this.uploadImage.root,
      this.paletteConfig.root,
      this.generatePalette.root,
      this.paletteContainer,
      this.specialColorsContainer
    );
  }

  private async setupImageUpload() {
    const svg = await loadAndCleanSVG("icons/insert-image-symbolic.svg");
    const img = await this.getImage();

    this.uploadImage = new UploadImage({
      onChange: this.handleImageChange,
      image: img,
      svg: svg,
    });

    this.uploadImage.root.classList.add("w-full");
  }

  private setupPaletteConfig() {
    const configElements: ConfigElements[] = [
      {
        type: "select",
        title: "Backend",
        activeOption: getState().backend,
        options: [
          "wal",
          "colorthief",
          "colorz",
          "fast_colorthief",
          "modern_colorthief",
          "haishoku",
          //"okthief", Having trouble generating the palette
          //"schemer2", Having trouble generating the palette
        ],
        onClick: (e: Event) => {
          const target = e.target as HTMLButtonElement;
          const value = target.textContent as Backend;

          setState({ backend: value });
        },
      },

      {
        type: "switch",
        title: "Light Mode",
        checked: getState().lightMode,
        onChecked: () => setState({ lightMode: true }),
        onDisabled: () => setState({ lightMode: false }),
      },
      {
        type: "switch",
        title: "Darken Palette",
        checked: getState().darkExtended,
        onChecked: () => setState({ darkExtended: true }),
        onDisabled: () => setState({ darkExtended: false }),
      },

      {
        type: "range",
        title: "Saturation",
        initialValue: getState().saturation,
        steps: "0.1",
        min: "-1.0",
        max: "1.0",
        onChange: (value: string) => setState({ saturation: value }),
      },
      {
        type: "range",
        title: "Contrast",
        initialValue: getState().contrast,
        steps: "0.5",
        min: "1.0",
        max: "21.0",
        onChange: (value: string) => setState({ contrast: value }),
      },
    ];

    this.paletteConfig = new Config({ configElements: configElements });

    this.paletteConfig.root.classList.add("mt-2");
  }

  private setupGeneratePalette() {
    this.generatePalette = new Button({
      type: "primary",
      onClick: this.handleGeneratePlatteClick,
      disabled: !getState().isImgInIDB,
      label: "Generate Palette",
    });

    this.generatePalette.root.classList.add("mt-2");
  }

  private setupPalettePreview() {
    this.paletteContainer = document.createElement("div");
    this.paletteContainer.classList.add("mt-4", "w-full");

    const title = document.createElement("p");
    title.textContent = "Colors";

    const colors = Object.values(getState().colors);

    this.palettePreview = new PalettePreview({
      colors: colors,
      onChange: this.handleColorChange,
    });

    this.paletteContainer.append(title, this.palettePreview.root);
  }

  private setupSpecialColorsPreview() {
    this.specialColorsContainer = document.createElement("div");
    this.specialColorsContainer.classList.add("mt-4", "w-full");

    const title = document.createElement("p");
    title.textContent = "Special Colors (Background, Foreground, Cursor)";

    const special = Object.values(getState().specialColors);

    this.specialColorsPreview = new PalettePreview({
      colors: special,
      onChange: this.handleSpecialColorsChange,
    });

    this.specialColorsContainer.append(title, this.specialColorsPreview.root);
  }

  private async getImage() {
    const image = await getImage();

    if (!image) {
      setState({ isImgInIDB: false });
      return null;
    }

    return image;
  }

  private async handleImageChange(image: File) {
    await addImage(image);
  }

  private handleGeneratePlatteClick() {
    generatePalette();
  }

  private handleColorChange(newColors: string[]) {
    const colors = Object.fromEntries(
      newColors.map((c, i) => [`color${i}`, c])
    );
    setState({ colors: colors });
  }

  private handleSpecialColorsChange(newColors: string[]) {
    const colors = Object.fromEntries(
      newColors.map((c, i) => {
        if (i === 0) return [`background`, c];
        if (i === 1) return [`foreground`, c];
        if (i === 2) return [`cursor`, c];

        return [`color${i}`, c];
      })
    );
    setState({ specialColors: colors });
  }

  private handleStateUpdates() {
    subscribe((newState) => {
      if (newState.isImgInIDB) {
        this.generatePalette.setDisabled(false);
      }

      if (newState.colors) {
        const colors = Object.values(newState.colors);
        this.palettePreview.updateColors(colors);
      }

      if (newState.specialColors) {
        const special = Object.values(newState.specialColors);
        this.specialColorsPreview.updateColors(special);
      }
    });
  }
}
