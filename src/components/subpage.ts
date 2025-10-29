type SubpageProps = {
  title: string;
  children: HTMLElement;
  onBack: () => void;
};

export class Subpage {
  readonly root: HTMLElement;
  private container!: HTMLDivElement;
  private title: string;
  private children: HTMLElement;
  private onBack: () => void;

  constructor({ title, children, onBack }: SubpageProps) {
    this.title = title;
    this.children = children;
    this.onBack = onBack;

    this.root = document.createElement("div");

    this.setupStyles();
    this.setupElements();
  }

  private setupStyles() {
    const styles = document.createElement("style");
    const css = String.raw;
    styles.textContent = css`
      .container-subpage {
        margin-inline: auto;
      }
      .header-subpage {
        display: grid;
        align-items: center;
        grid-template-columns: repeat(3, 1fr);
      }
      .back-button-subpage {
        appearance: none;
        border: none;
        background-color: transparent;
        width: fit-content;
        border-radius: 1.2rem;
        transition: background-color 0.1s ease;
        cursor: pointer;
        text-align: center;
      }
      .back-icon-subpage {
        appearance: none;
        border: none;
        content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 16 16'%3E%3Cpath fill='%23000000' d='M10 4l-4 4 4 4z'/%3E%3C/svg%3E");
        transition: background-color 0.15s ease;
        width: fit-content;
      }
      .back-button-subpage:hover {
        background-color: var(--surface-hover);
      }
      @media (prefers-color-scheme: dark) {
        .back-icon-subpage {
          content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 16 16'%3E%3Cpath fill='%23ffffff' d='M10 4l-4 4 4 4z'/%3E%3C/svg%3E");
        }
      }
      .title-subpage {
        grid-column: 2/3;
        text-align: center;
      }
    `;

    this.root.append(styles);
  }

  private setupElements() {
    this.container = document.createElement("div");
    this.container.classList.add("container-subpage");

    const header = document.createElement("div");
    header.classList.add("header-subpage");

    const backBtn = document.createElement("button");
    backBtn.classList.add("back-button-subpage");

    const icon = document.createElement("div");
    icon.classList.add("back-icon-subpage");

    const title = document.createElement("p");
    title.classList.add("title-subpage");
    title.textContent = this.title;

    this.setupBackEvent(backBtn);

    backBtn.append(icon);

    header.append(backBtn, title);

    this.container.append(header, this.children);

    this.root.append(this.container);
  }

  private setupBackEvent(backBtn: HTMLButtonElement) {
    backBtn.addEventListener("click", () => this.onBack());
  }
}
