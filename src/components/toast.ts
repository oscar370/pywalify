export class Toast {
  private root: HTMLElement;
  private shadow!: ShadowRoot;

  constructor() {
    this.root = document.createElement("div");
    this.setupStyles();
  }

  private setupStyles() {
    this.root.style.position = "fixed";
    this.root.style.top = "0";
    this.root.style.left = "0";
    this.root.style.width = "0";
    this.root.style.height = "0";
    this.root.style.zIndex = "9999";
    this.shadow = this.root.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    const css = String.raw;
    style.innerText = css`
      html {
        font-size: 62.5%;
      }
      *,
      *:before,
      *:after {
        box-sizing: border-box;
      }
      .toast {
        display: flex;
        position: fixed;
        right: 1rem;
        bottom: 1rem;
        align-items: center;
        gap: 0.8rem;
        box-shadow: 0 0.4rem 0.8rem rgba(0, 0, 0, 0.2);
        border-radius: 0.4rem;
        background-color: var(--surface-overlay);
        padding: 1rem 1.6rem;
        min-width: 30rem;
        width: fit-content;
        color: var(--text-primary);
        font-size: 1.4rem;
      }
      .toast--success {
        background-color: var(--accent-green);
      }
      .toast--error {
        background-color: var(--accent-red);
      }
      .toast--info {
        background-color: var(--accent-blue);
      }
    `;

    this.shadow.append(style);
  }

  show(
    message: string,
    type: string,
    duration: number = 3000,
    animationDuration: number = 300
  ) {
    const toastContainer = document.createElement("div");
    toastContainer.classList.add("toast");

    switch (type) {
      case "error":
        toastContainer.classList.add("toast--error");
        break;
      case "success":
        toastContainer.classList.add("toast--success");
        break;
      case "info":
        toastContainer.classList.add("toast--info");
        break;
    }

    const messageTag = document.createElement("p");
    messageTag.innerText = message;

    toastContainer.append(messageTag);

    this.shadow.append(toastContainer);

    document.body.append(this.root);

    const animate = toastContainer.animate(
      {
        transform: ["translateX(1000px)", "translateX(0px)"],
        opacity: ["0", "1"],
      },
      { duration: animationDuration }
    );

    setTimeout(() => {
      animate.finished.then(() => {
        const animate = toastContainer.animate(
          {
            transform: ["translateX(0px)", "translateX(1000px)"],
            opacity: ["1", "0"],
          },
          { duration: animationDuration }
        );

        animate.finished.then(() => this.root.remove());
      });
    }, duration);
  }
}
