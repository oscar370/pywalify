type TextField = {
  type: "text";
  title: string;
  id: string;
  placeholder: string;
  initialContent?: string;
  onChange: (e: Event) => void;
};

type TextAreaField = {
  type: "area";
  title: string;
  id: string;
  placeholder: string;
  initialContent?: string;
  height: string;
  onChange: (e: Event) => void;
};

type SubmitButton = {
  type: "submit";
  title: string;
  onClick: () => void;
};

export type FormElement = TextField | TextAreaField | SubmitButton;

type FormProps = {
  formElements: FormElement[];
};

export class Form {
  readonly root: HTMLDivElement;
  private shadow!: ShadowRoot;
  private container!: HTMLDivElement;
  private formElements: FormElement[];
  private inputElements!: Record<
    string,
    HTMLInputElement | HTMLTextAreaElement
  >;

  constructor({ formElements }: FormProps) {
    this.formElements = formElements;

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
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
      }
      .text-field-container {
        display: grid;
        width: 100%;
        align-items: center;
        gap: 0.8rem;
        grid-template-columns: repeat(4, 1fr);
      }
      .text-field {
        width: 100%;
        grid-column: 2/5;
        height: auto;
        max-height: 40rem;
      }
      .label {
        text-align: right;
      }
      .submit-button {
        transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        cursor: pointer;
        box-shadow: none;
        border: none;
        border-radius: 0.6rem;
        padding: 0.8rem 1.8rem;
        color: var(--text-primary);
        font-weight: 600;
        font-size: 1.5rem;
        width: 100%;
        background: var(--accent-blue);
        color: #ffffff;
      }
      .submit-button:hover {
        background: var(--accent-blue-hover);
      }
    `;

    this.shadow.append(styles);
  }

  private setupElements() {
    this.container = document.createElement("div");
    this.container.classList.add("container");

    this.formElements.forEach((element) => {
      switch (element.type) {
        case "text":
          this.setupTextField(element);
          break;
        case "area":
          this.setupAreaField(element);
          break;
        case "submit":
          this.setupSubmitButton(element);
      }
    });

    this.shadow.append(this.container);
  }

  private setupTextField(element: TextField) {
    const container = document.createElement("div");
    container.classList.add("text-field-container");

    const title = document.createElement("label");
    title.setAttribute("for", element.id);
    title.textContent = element.title;
    title.classList.add("label");

    const input = document.createElement("input");
    input.classList.add("text-field");
    input.type = element.type;
    input.id = element.id;
    input.placeholder = element.placeholder;

    element.initialContent ? (input.value = element.initialContent) : "";

    input.addEventListener("change", (e) => element.onChange(e));

    this.inputElements = { ...this.inputElements, [element.id]: input };

    container.append(title, input);

    this.container.append(container);
  }

  private setupAreaField(element: TextAreaField) {
    const container = document.createElement("div");
    container.classList.add("text-field-container");

    const title = document.createElement("label");
    title.setAttribute("for", element.id);
    title.textContent = element.title;
    title.classList.add("label");

    const input = document.createElement("textarea");
    input.style.height = element.height;
    input.classList.add("text-field");
    input.id = element.id;
    input.placeholder = element.placeholder;

    element.initialContent ? (input.value = element.initialContent) : "";

    input.addEventListener("input", () => this.updateHeight(input));
    input.addEventListener("change", (e) => element.onChange(e));

    this.inputElements = { ...this.inputElements, [element.id]: input };

    container.append(title, input);

    this.container.append(container);
  }

  private setupSubmitButton(element: SubmitButton) {
    const button = document.createElement("button");
    button.classList.add("submit-button");
    button.textContent = element.title;

    button.addEventListener("click", () => element.onClick());

    this.container.append(button);
  }

  private updateHeight(element: HTMLInputElement | HTMLTextAreaElement) {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
  }

  updateValueElement(id: string, newContent: string) {
    const element = this.inputElements[id];

    element.value = newContent;
  }
}
