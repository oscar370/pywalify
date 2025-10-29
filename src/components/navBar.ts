type Icon = {
  name: string;
  svg: string;
};

type NavBarProps = {
  icons: Icon[];
  active: string;
  onClick: (value: string) => void;
};

export class NavBar {
  readonly root!: HTMLDivElement;
  private shadow!: ShadowRoot;
  private container!: HTMLElement;
  private navElements!: HTMLButtonElement[];
  private icons!: Icon[];
  private onClick!: (value: string) => void;

  constructor({ icons, active, onClick }: NavBarProps) {
    this.icons = icons;
    this.onClick = onClick;

    this.root = document.createElement("div");

    this.setupStyles();
    this.setupElements();

    this.updateUI(active);
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
        display: flex;
        gap: 0.8rem;
        justify-content: center;
        align-items: center;
        width: 100%;
      }
      .button {
        transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        cursor: pointer;
        box-shadow: none;
        border: none;
        border-radius: 0.6rem;
        padding: 0.8rem 1.8rem;
        color: var(--text-primary);
        font-weight: 600;
        font-size: 1.5rem;
        background: transparent;
      }
      .logo {
        width: 2.5rem;
        height: 2.5rem;
      }
      .button--active {
        background: var(--surface-active);
      }
      .button:hover {
        background: var(--surface-hover);
      }
      .button--active:hover {
        background: var(--surface-active);
      }
    `;

    this.shadow.append(styles);
  }

  private setupElements() {
    this.container = document.createElement("nav");
    this.container.classList.add("container");

    this.navElements = [];

    this.icons.forEach((icon) => {
      const button = document.createElement("button");
      button.classList.add("button");
      button.innerHTML = icon.svg;
      button.value = icon.name;
      button.querySelector("svg")?.classList.add("logo");

      this.setupButtonEvent(button);

      this.navElements.push(button);
      this.container.append(button);
    });

    this.shadow.append(this.container);
  }

  private setupButtonEvent(button: HTMLButtonElement) {
    button.addEventListener("click", () => {
      const value = button.value;
      this.onClick(value);
    });
  }

  updateUI(active: string) {
    this.navElements.forEach((button) => {
      button.value === active
        ? button.classList.add("button--active")
        : button.classList.remove("button--active");
    });
  }
}
