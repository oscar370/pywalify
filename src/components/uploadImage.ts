type UploadImageProps = {
  onChange: (image: File) => void;
  image: File | null;
  svg: string;
};

export class UploadImage {
  readonly root: HTMLDivElement;
  private shadow!: ShadowRoot;
  private container!: HTMLDivElement;
  private uploadInput!: HTMLInputElement;
  private uploadBtn!: HTMLButtonElement;
  private imgWrapper!: HTMLDivElement;
  private img!: HTMLImageElement;
  private changeImageBtn!: HTMLButtonElement;
  private onChange: (image: File) => void;

  constructor({ onChange, image, svg }: UploadImageProps) {
    this.onChange = onChange;

    this.root = document.createElement("div");

    this.setupStyles();
    this.setupElements();
    this.setupEvents();
    this.loadChangeIcon(svg);
    this.loadImage(image);
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
        width: 100%;
        height: fit-content;
      }
      .none {
        display: none;
      }
      .upload-image {
        transition: background-color 0.2s ease;
        cursor: pointer;
        box-shadow: none;
        border: 0.2rem dotted var(--border-secondary);
        border-radius: 1.2rem;
        background: var(--surface-overlay);
        width: 100%;
        height: 20rem;
        color: var(--text-primary);
        font-weight: 600;
      }
      .upload-image:hover {
        background-color: var(--surface-hover);
      }
      .img-wrapper {
        position: relative;
        height: fit-content;
      }
      .img {
        width: 100%;
        border-radius: 1.2rem;
      }
      .change-image-btn {
        display: flex;
        position: absolute;
        top: 0.4rem;
        left: 0.4rem;
        justify-content: center;
        align-items: center;
        appearance: none;
        z-index: 99;
        cursor: pointer;
        border: none;
        border-radius: 0.6rem;
        background: var(--bg-secondary);
        padding: 0.4rem;
        width: fit-content;
        color: var(--text-primary);
      }
      .change-image-logo {
        transition: background-color 0.2s ease;
        fill: var(--text-primary);
        border-radius: 0.4rem;
        padding: 0.4rem;
        width: 2rem;
        height: 2rem;
      }
      .change-image-logo:hover {
        background-color: color-mix(
          in srgb,
          var(--text-primary),
          transparent 80%
        );
      }
    `;

    this.shadow.append(styles);
  }

  private setupElements() {
    this.container = document.createElement("div");
    this.container.classList.add("container");

    this.uploadInput = document.createElement("input");
    this.uploadInput.type = "file";
    this.uploadInput.accept = "image/*";
    this.uploadInput.classList.add("none");

    this.uploadBtn = document.createElement("button");
    this.uploadBtn.classList.add("upload-image");
    this.uploadBtn.textContent = "Upload an Image";

    this.imgWrapper = document.createElement("div");
    this.imgWrapper.classList.add("img-wrapper", "none");

    this.img = document.createElement("img");
    this.img.alt = "Image Selected";
    this.img.classList.add("img");

    this.changeImageBtn = document.createElement("button");
    this.changeImageBtn.classList.add("change-image-btn");

    this.imgWrapper.append(this.changeImageBtn, this.img);

    this.container.append(this.uploadInput, this.uploadBtn, this.imgWrapper);
    this.shadow.append(this.container);
  }

  private setupEvents() {
    this.uploadInput.addEventListener("change", () => this.handleFileChange());

    this.uploadBtn.addEventListener("click", () => this.uploadInput.click());

    this.changeImageBtn.addEventListener("click", () =>
      this.uploadInput.click()
    );

    this.uploadBtn.addEventListener("dragover", (e) => e.preventDefault());

    this.uploadBtn.addEventListener("drop", (e) => {
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0];
      if (!file) return;

      this.handleDrop(file);
    });

    document.addEventListener("drop", (e) => e.preventDefault());
  }

  private handleFileChange() {
    const image = this.uploadInput.files?.[0];

    if (!image) throw new Error("Image not found");

    this.uploadBtn.classList.add("none");

    if (this.img.src.startsWith("blob:")) URL.revokeObjectURL(this.img.src);

    const imageURL = URL.createObjectURL(image);

    this.img.src = imageURL;

    this.imgWrapper.classList.remove("none");

    this.onChange(image);
  }

  private handleDrop(file: File) {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    this.uploadInput.files = dataTransfer.files;
    this.uploadInput.dispatchEvent(new Event("change", { bubbles: true }));
  }

  private loadChangeIcon(svg: string) {
    this.changeImageBtn.innerHTML = svg;
    const svgEl = this.changeImageBtn.querySelector("svg");
    if (svgEl) svgEl.classList.add("change-image-logo");
  }

  private async loadImage(image: File | null) {
    if (!image) return;

    this.uploadBtn.classList.add("none");
    const imageURL = URL.createObjectURL(image);
    this.img.src = imageURL;
    this.imgWrapper.classList.remove("none");
  }
}
