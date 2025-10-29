import Coloris from "@melloware/coloris";
import "@melloware/coloris/dist/coloris.css";

type PalettePreviewProps = {
  colors: string[];
  onChange: (colors: string[]) => void;
};

export class PalettePreview {
  readonly root: HTMLDivElement;
  private container!: HTMLDivElement;
  private paletteContainer!: HTMLDivElement;
  private paletteElements!: HTMLButtonElement[];
  private colors!: string[];
  private onChange: (colors: string[]) => void;

  constructor({ colors, onChange }: PalettePreviewProps) {
    this.onChange = onChange;
    this.colors = colors;

    this.root = document.createElement("div");

    this.setupStyles();
    this.setupElements();
    this.setupColoris();
  }

  private setupStyles() {
    const styles = document.createElement("style");
    const css = String.raw;
    styles.textContent = css`
      html {
        font-size: 62.5%;
      }
      *,
      *:before,
      *:after {
        box-sizing: border-box;
      }
      .container-p {
        box-shadow: var(--shadow-sm);
        border: none;
        border-radius: 1.2rem;
        background: var(--bg-secondary);
        padding: 1.6rem;
        width: 100%;
      }
      .palette-container {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 1rem;
        width: 100%;
      }
      .color-preview {
        transition: transform 0.2s ease;
        cursor: pointer;
        border: none;
        border: 0.1rem solid var(--border-secondary);
        border-radius: 0.4rem;
        aspect-ratio: 1/1;
        width: 100%;
        overflow: hidden;
      }
      .color-preview:hover {
        transform: scale(1.1);
      }
    `;

    this.root.append(styles);
  }

  private setupElements() {
    this.container = document.createElement("div");
    this.container.classList.add("container-p");

    this.paletteContainer = document.createElement("div");
    this.paletteContainer.classList.add("palette-container");

    this.paletteElements = [];

    this.colors.forEach((color, i) => {
      const inputColor = document.createElement("button");
      inputColor.setAttribute("color", `${i}`);
      inputColor.setAttribute("data-coloris", "");
      inputColor.classList.add("color-preview");

      inputColor.style.backgroundColor = color;
      inputColor.value = color;

      this.paletteElements.push(inputColor);
      this.paletteContainer.append(inputColor);
    });

    this.root.append(this.container);
    this.container.append(this.paletteContainer);
  }

  private setupColoris() {
    Coloris.init();

    Coloris({
      el: "#coloris",
      themeMode: "dark",
      formatToggle: true,
      wrap: false,
      onChange: (color, el) => {
        if (!el) return;
        const element = el as HTMLInputElement;
        element.style.background = color;
        element.value = color;

        const attributeValue = element.getAttribute("color");
        if (!attributeValue) return;

        const i = parseInt(attributeValue);

        this.colors[i] = color;
        this.onChange(this.colors);
      },
    });
  }

  updateColors(colors: string[]) {
    this.colors = colors;

    this.paletteElements.forEach((element, i) => {
      element.style.background = colors[i];
      element.value = colors[i];
    });
  }
}
