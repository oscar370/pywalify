type SelectConfig = {
  type: "select";
  title: string;
  activeOption: string;
  options: string[];
  onClick: (e: Event) => void;
};

type SwitchConfig = {
  type: "switch";
  title: string;
  checked: boolean;
  onChecked: () => void;
  onDisabled: () => void;
};

type RangeConfig = {
  type: "range";
  title: string;
  initialValue: string;
  steps: string;
  min: string;
  max: string;
  onChange: (value: string) => void;
};

type NavigationConfig = {
  type: "navigation";
  title: string;
  onClick: () => void;
};

export type ConfigElements =
  | SelectConfig
  | SwitchConfig
  | RangeConfig
  | NavigationConfig;

type ConfigProps = {
  configElements: ConfigElements[];
};

export class Config {
  readonly root: HTMLDivElement;
  private shadow!: ShadowRoot;
  private container!: HTMLDivElement;
  private configElements: ConfigElements[];

  constructor({ configElements }: ConfigProps) {
    this.configElements = configElements;

    this.root = document.createElement("div");

    this.setupStyles();
    this.setupElements();
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
      .list {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        margin: 0;
        padding: 0;
        width: 100%;
        list-style: none;
      }
      .list > :first-child {
        border-top-right-radius: 1.2rem;
        border-top-left-radius: 1.2rem;
      }
      .list > :last-child {
        border-bottom-right-radius: 1.2rem;
        border-bottom-left-radius: 1.2rem;
      }
      .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color 150ms;
        cursor: pointer;
        box-shadow: var(--shadow-sm);
        border: none;
        background: var(--bg-secondary);
        padding: 1.4rem 1.6rem;
        color: var(--text-primary);
        position: relative;
        font-size: 1.5rem;
      }
      .list-item:hover {
        background-color: var(--surface-hover);
      }
      .select {
        appearance: none;
        border: none;
        background: transparent;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%231c1c1c' d='M4 6l4 4 4-4z'/%3E%3C/svg%3E");
        background-position: right 1rem center;
        background-repeat: no-repeat;
        padding: 1rem 1.4rem;
        padding-right: 3.6rem;
        color: var(--text-primary);
        font-size: 1.5rem;
      }
      .select:active {
        border: none;
      }
      .select:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        border-color: var(--border-subtle);
        background: var(--surface-overlay);
        color: var(--text-disabled);
      }
      .switch {
        display: inline-block;
        position: relative;
        width: 5.2rem;
        height: 3rem;
      }
      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      .slider {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transition: 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        cursor: pointer;
        border: none;
        border-radius: 1.5rem;
        background: var(--surface-active);
      }
      .slider:before {
        position: absolute;
        bottom: 0.4rem;
        left: 0.4rem;
        transition: 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        box-shadow: var(--shadow-md);
        border-radius: 50%;
        background: white;
        width: 2.2rem;
        height: 2.2rem;
        content: "";
      }
      input:checked + .slider {
        background: var(--accent-blue);
      }
      input:checked + .slider:before {
        transform: translateX(22px);
      }
      @media (prefers-color-scheme: dark) {
        .select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23ffffff' d='M4 6l4 4 4-4z'/%3E%3C/svg%3E");
        }
      }
      .options {
        display: flex;
        position: absolute;
        top: 60px;
        right: 8px;
        flex-direction: column;
        gap: 0.6rem;
        z-index: 99;
        box-shadow: var(--shadow-sm);
        border: none;
        border-radius: 1.2rem;
        background: var(--bg-secondary);
        padding: 1.2rem;
        max-height: 32rem;
        overflow-y: auto;
      }
      .option {
        appearance: none;
        transition: background-color 0.1s ease;
        cursor: pointer;
        border: none;
        border-radius: 0.8rem;
        background-color: transparent;
        padding: 0.6rem;
        color: var(--text-primary);
        text-align: left;
      }
      .option:hover {
        background-color: var(--surface-hover);
      }
      .range-wrapper {
        display: flex;
        align-items: center;
        gap: 0.8rem;
      }
      .range {
        -webkit-appearance: none;
        appearance: none;
        height: 0.8rem;
        border-radius: 0.4rem;
        background: var(--surface-overlay);
        outline: none;
        cursor: pointer;
        transition: background 150ms;
      }
      .range:hover {
        background: var(--surface-hover);
      }
      /* Thumb - WebKit (Chrome, Safari, Edge) */
      .range::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background: var(--accent-blue);
        cursor: pointer;
        box-shadow: 0 0.1rem 0.3rem rgba(0, 0, 0, 0.2);
        transition: all 150ms;
      }
      .range::-webkit-slider-thumb:hover {
        background: var(--accent-blue-hover);
        transform: scale(1.1);
      }
      .range::-webkit-slider-thumb:active {
        background: var(--accent-blue-active);
        transform: scale(1.05);
      }
      /* Thumb - Firefox */
      .range::-moz-range-thumb {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background: var(--accent-blue);
        cursor: pointer;
        border: none;
        box-shadow: 0 0.1rem 0.3rem rgba(0, 0, 0, 0.2);
        transition: all 150ms;
      }
      .range::-moz-range-thumb:hover {
        background: var(--accent-blue-hover);
        transform: scale(1.1);
      }
      .range::-moz-range-thumb:active {
        background: var(--accent-blue-active);
        transform: scale(1.05);
      }
      /* Track - Firefox */
      .range::-moz-range-track {
        height: 0.8rem;
        border-radius: 0.4rem;
        background: var(--surface-overlay);
      }
      /* Focus state */
      .range:focus::-webkit-slider-thumb {
        box-shadow: 0 0 0 0.3rem rgba(53, 132, 228, 0.3);
      }
      .range:focus::-moz-range-thumb {
        box-shadow: 0 0 0 0.3rem rgba(53, 132, 228, 0.3);
      }
      .navigation-icon {
        content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23000000' d='M6 4l4 4-4 4z'/%3E%3C/svg%3E");
      }
      @media (prefers-color-scheme: dark) {
        .navigation-icon {
          content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23ffffff' d='M6 4l4 4-4 4z'/%3E%3C/svg%3E");
        }
      }
      .none {
        display: none;
      }
    `;

    this.shadow.append(styles);
  }

  private setupElements() {
    this.container = document.createElement("div");
    this.container.classList.add("list");

    this.configElements.forEach((element) => {
      switch (element.type) {
        case "select":
          this.setupSelectElements(element);
          break;
        case "switch":
          this.setupSwitchElements(element);
          break;
        case "range":
          this.setupRangeElements(element);
          break;
        case "navigation":
          this.setupNavigationElements(element);
      }
    });

    this.shadow.append(this.container);
  }

  private setupSelectElements(element: SelectConfig) {
    const container = document.createElement("button");
    container.classList.add("list-item");

    const title = document.createElement("p");
    title.textContent = element.title;

    const select = document.createElement("div");
    select.classList.add("select");
    select.textContent = element.activeOption;

    const options = document.createElement("div");
    options.classList.add("options", "none");

    element.options.forEach((optionText) => {
      const option = document.createElement("button");
      option.classList.add("option");
      option.textContent = optionText;

      option.addEventListener("click", (e) => {
        element.onClick(e);
        this.hideOptions(options);
        select.textContent = optionText;
      });

      options.append(option);
    });

    this.setupSelectEvents(options, container);

    container.append(title, select, options);

    this.container.append(container);
  }

  private setupSwitchElements(element: SwitchConfig) {
    const container = document.createElement("button");
    container.classList.add("list-item");

    const title = document.createElement("p");
    title.textContent = element.title;

    const switchInput = document.createElement("input");
    switchInput.type = "checkbox";
    switchInput.checked = element.checked;

    const switchSpan = document.createElement("span");
    switchSpan.classList.add("slider");

    const switchWrapper = document.createElement("label");
    switchWrapper.classList.add("switch");
    switchWrapper.append(switchInput, switchSpan);

    this.setupSwitchEvents(switchInput, element, container);

    container.append(title, switchWrapper);

    this.container.append(container);
  }

  private setupRangeElements(element: RangeConfig) {
    const container = document.createElement("button");
    container.classList.add("list-item");

    const title = document.createElement("p");
    title.textContent = element.title;

    const rangeWrapper = document.createElement("div");
    rangeWrapper.classList.add("range-wrapper");

    const valueIndicator = document.createElement("p");
    valueIndicator.textContent = element.initialValue;

    const range = document.createElement("input");
    range.classList.add("range");
    range.type = "range";
    range.step = element.steps;
    range.min = element.min;
    range.max = element.max;
    range.value = element.initialValue;

    this.setupRangeEvents(range, valueIndicator, element);

    rangeWrapper.append(valueIndicator, range);
    container.append(title, rangeWrapper);

    this.container.append(container);
  }

  private setupNavigationElements(element: NavigationConfig) {
    const container = document.createElement("button");
    container.classList.add("list-item");

    const title = document.createElement("p");
    title.textContent = element.title;

    const icon = document.createElement("div");
    icon.classList.add("navigation-icon");

    this.setupNavigationEvents(container, element);

    container.append(title, icon);

    this.container.append(container);
  }

  private setupSelectEvents(
    options: HTMLDivElement,
    container: HTMLButtonElement
  ) {
    window.addEventListener("click", (e) => {
      const isNotNone = !options.classList.contains("none");
      const isNotSelect = !container.contains(e.target as HTMLElement);

      if (isNotNone && isNotSelect) {
        this.hideOptions(options);
      }
    });

    container.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!options.classList.contains("none")) return;
      options.classList.remove("none");
      options.animate(
        {
          opacity: [0, 1],
        },
        { duration: 100 }
      );
    });
  }

  private setupSwitchEvents(
    switchInput: HTMLInputElement,
    config: SwitchConfig,
    container: HTMLButtonElement
  ) {
    container.addEventListener("click", () => {
      if (switchInput.checked) {
        switchInput.checked = false;
        config.onDisabled();
      } else {
        switchInput.checked = true;
        config.onChecked();
      }
    });
  }

  private setupRangeEvents(
    range: HTMLInputElement,
    valueIndicator: HTMLParagraphElement,
    config: RangeConfig
  ) {
    range.addEventListener("change", (e) => {
      const value = (e.target as HTMLInputElement).value;

      valueIndicator.textContent = value;

      config.onChange(value);
    });
  }

  private setupNavigationEvents(
    container: HTMLButtonElement,
    config: NavigationConfig
  ) {
    container.addEventListener("click", () => config.onClick());
  }

  private hideOptions(options: HTMLDivElement) {
    const animate = options.animate(
      {
        opacity: [1, 0],
      },
      { duration: 100 }
    );

    animate.finished.then(() => {
      options.classList.add("none");
    });
  }
}
