type ButtonType = "normal" | "primary" | "flat";

type ButtonProps = {
  type: ButtonType;
  onClick: () => void;
  disabled: boolean;
  label: string;
};

export class Button {
  readonly root: HTMLDivElement;
  private shadow!: ShadowRoot;
  private container!: HTMLDivElement;
  private button!: HTMLButtonElement;
  private type: ButtonType;
  private onClick: () => void;
  private disabled: boolean;

  constructor({ type, onClick, disabled, label }: ButtonProps) {
    this.type = type;
    this.onClick = onClick;
    this.disabled = disabled;

    this.root = document.createElement("div");

    this.setupStyles();
    this.setupElements(label);
    this.setupEvents();
  }

  private setupStyles() {
    this.root.style.width = "100%";
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
      .button {
        transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        cursor: pointer;
        box-shadow: none;
        border: none;
        border-radius: 0.6rem;
        background: var(--surface-overlay);
        padding: 0.8rem 1.8rem;
        color: var(--text-primary);
        font-weight: 600;
        font-size: 1.5rem;
        width: 100%;
      }
      .button-primary {
        background: var(--accent-blue);
        color: #ffffff;
      }
      .button-flat {
        background: transparent;
      }
      .button--active {
        background: var(--surface-active);
      }
      .button:hover {
        background: var(--surface-hover);
      }
      .button-primary:hover {
        background: var(--accent-blue-hover);
      }
      .button--active:hover {
        background: var(--surface-active);
      }
      .button:disabled {
        cursor: not-allowed;
        background-color: var(--surface-overlay);
        color: var(--text-disabled);
      }
    `;

    this.shadow.append(styles);
  }

  private setupElements(label: string) {
    this.container = document.createElement("div");
    this.container.classList.add("container");

    this.button = document.createElement("button");
    this.button.classList.add("button");
    this.button.innerText = label;
    this.button.disabled = this.disabled;

    if (this.type === "normal") this.button.classList.add("button");
    if (this.type === "primary") this.button.classList.add("button-primary");
    if (this.type === "flat") this.button.classList.add("button-flat");

    this.container.append(this.button);

    this.shadow.append(this.container);
  }

  private setupEvents() {
    this.button.addEventListener("click", () => this.onClick());
  }

  setDisabled(activate: boolean) {
    this.disabled = activate;
    this.button.disabled = this.disabled;
  }
}
