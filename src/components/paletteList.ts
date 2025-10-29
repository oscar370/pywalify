type Palette = {
  name: string;
  mode: "dark" | "light";
  colors: string[];
};

type PaletteListProps = {
  palettes: Palette[];
  onClick: (palette: Palette) => void;
};

export class PaletteList {
  readonly root: HTMLDivElement;
  private shadow!: ShadowRoot;
  private container!: HTMLDivElement;
  private palettes: Palette[];
  private onClick: (palette: Palette) => void;

  constructor({ palettes, onClick }: PaletteListProps) {
    this.palettes = palettes;
    this.onClick = onClick;

    this.root = document.createElement("div");

    this.setupStyles();
    this.setupElements();
  }

  private setupStyles() {
    this.shadow = this.root.attachShadow({ mode: "open" });

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
      .container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.2rem;
      }
      .palette-container {
        box-shadow: var(--shadow-sm);
        border: none;
        border-radius: 1.2rem;
        background: var(--bg-secondary);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer;
      }
      .palette-container:hover {
        background: var(--surface-hover);
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.4rem 1.4rem;
        gap: 0.4rem;
      }
      .mode {
        background-color: var(--accent-blue);
        padding: 0rem 0.8rem;
        border-radius: 1.2rem;
        height: fit-content;
        line-height: 0;
      }
      .colors-container {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
      }
      .color-preview {
        width: 100%;
        aspect-ratio: 1/1;
      }
      .color-preview:nth-child(9) {
        border-bottom-left-radius: 1.2rem;
      }
      .color-preview:nth-child(16) {
        border-bottom-right-radius: 1.2rem;
      }
    `;

    this.shadow.append(styles);
  }

  private setupElements() {
    this.container = document.createElement("div");
    this.container.classList.add("container");

    this.palettes.forEach((palette) => {
      const container = document.createElement("div");
      container.classList.add("palette-container");

      const header = document.createElement("div");
      header.classList.add("header");

      const title = document.createElement("p");
      title.textContent = palette.name;

      const modeContainer = document.createElement("div");
      modeContainer.classList.add("mode");

      const mode = document.createElement("p");
      mode.textContent = palette.mode;

      const colorsContainer = document.createElement("div");
      colorsContainer.classList.add("colors-container");

      palette.colors.forEach((color) => {
        const colorPreview = document.createElement("div");
        colorPreview.classList.add("color-preview");
        colorPreview.style.backgroundColor = color;

        colorsContainer.append(colorPreview);
      });

      container.addEventListener("click", () => this.onClick(palette));

      modeContainer.append(mode);

      header.append(title, modeContainer);

      container.append(header, colorsContainer);

      this.container.append(container);
    });

    this.shadow.append(this.container);
  }
}
