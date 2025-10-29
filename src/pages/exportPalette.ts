import { Button } from "@/components/button";
import { Config, ConfigElements } from "@/components/config";
import { Form, FormElement } from "@/components/form";
import { Subpage } from "@/components/subpage";
import { exportPalette } from "@/services/exportPalette";
import { exportTemplate } from "@/services/exportTemplate";
import { getState, setState } from "@/store/appStore";

export class ExportPalette {
  readonly root: HTMLElement;
  private templatesConfig!: Config;
  private exportPaletteBtn!: Button;
  private subpage!: Subpage;
  private buttons!: HTMLDivElement;
  private form!: Form;

  constructor() {
    this.root = document.createElement("main");

    this.setupElements();
  }

  private setupElements() {
    this.setupConfigElements();
    this.setupFormElements();
    this.setupTemplateButtons();
    this.setupSubpageElements();
    this.setupExportPaletteBtn();

    this.root.append(this.templatesConfig.root, this.exportPaletteBtn.root);
  }

  private setupConfigElements() {
    const configElements: ConfigElements[] = [
      {
        type: "select",
        title: "Templates",
        activeOption: getState().template,
        options: [
          "css",
          "dmenu",
          "dwm",
          "dwm_urg",
          "st",
          "tabbed",
          "gtk2",
          "json",
          "konsole",
          "kitty",
          "nqq",
          "plain",
          "putty",
          "rofi",
          "scss",
          "shell",
          "fishshell",
          "speedcrunch",
          "sway",
          "tty",
          "vscode",
          "waybar",
          "polybar",
          "xresources",
          "haskell",
          "xmonad",
          "yaml",
        ],
        onClick: (e: Event) => {
          const value = (e.target as HTMLButtonElement).textContent;
          if (!value) return;
          setState({ template: value });
        },
      },
      {
        type: "navigation",
        title: "Custom Templates",
        onClick: () => {
          this.templatesConfig.root.remove();
          this.exportPaletteBtn.root.remove();
          this.root.append(this.subpage.root);
        },
      },
    ];

    this.templatesConfig = new Config({ configElements: configElements });
  }

  private setupFormElements() {
    const elements: FormElement[] = [
      {
        type: "text",
        title: "Name",
        id: "name-template",
        placeholder: "",
        initialContent: getState().customTemplate.name,
        onChange: (e: Event) => {
          const value = (e.target as HTMLInputElement).value;
          const state = { ...getState().customTemplate };
          state.name = value;
          setState({ customTemplate: state });
        },
      },
      {
        type: "text",
        title: "Extension",
        id: "extension-template",
        placeholder: "",
        initialContent: getState().customTemplate.extension,
        onChange: (e: Event) => {
          const value = (e.target as HTMLInputElement).value;
          const state = { ...getState().customTemplate };
          state.extension = value;
          setState({ customTemplate: state });
        },
      },
      {
        type: "area",
        title: "Content",
        id: "content-template",
        placeholder: "",
        initialContent: getState().customTemplate.content,
        height: "40rem",
        onChange: (e: Event) => {
          const value = (e.target as HTMLTextAreaElement).value;
          const state = { ...getState().customTemplate };
          state.content = value;
          setState({ customTemplate: state });
        },
      },
      {
        type: "submit",
        title: "Export Palette",
        onClick: () => {
          const template = getState().customTemplate;
          exportPalette("css", template.content);
        },
      },
    ];

    this.form = new Form({ formElements: elements });
    this.form.root.classList.add("subpage-form");
  }

  private setupTemplateButtons() {
    const importTemplateInput = document.createElement("input");
    importTemplateInput.type = "file";
    importTemplateInput.accept = "text/*";

    importTemplateInput.addEventListener("change", (e) =>
      this.handleImportTemplateChange(e)
    );

    this.buttons = document.createElement("div");
    this.buttons.classList.add("template-buttons");

    const importTemplateBtn = new Button({
      type: "normal",
      onClick: () => importTemplateInput.click(),
      disabled: false,
      label: "Import Template",
    });
    const exportTemplateBtn = new Button({
      type: "normal",
      onClick: () => exportTemplate(),
      disabled: false,
      label: "Export Template",
    });

    this.buttons.append(importTemplateBtn.root, exportTemplateBtn.root);
  }

  private setupSubpageElements() {
    const subpageContainer = document.createElement("div");

    subpageContainer.append(this.buttons, this.form.root);

    this.subpage = new Subpage({
      title: "Custom Templates",
      children: subpageContainer,
      onBack: this.handleOnBackClick.bind(this),
    });
  }

  private setupExportPaletteBtn() {
    this.exportPaletteBtn = new Button({
      type: "primary",
      onClick: this.handleExportPaletteClick,
      disabled: false,
      label: "Export Palette",
    });

    this.exportPaletteBtn.root.classList.add("mt-2");
  }

  private handleExportPaletteClick() {
    exportPalette(getState().template);
  }

  private handleOnBackClick() {
    this.root.append(this.templatesConfig.root, this.exportPaletteBtn.root);
    this.subpage.root.remove();
  }

  private async handleImportTemplateChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];

    if (!file) throw new Error("Error importing the file");

    const filename = file.name;

    const name = filename.substring(0, filename.lastIndexOf("."));

    const extension = filename.split(".").pop() || "txt";
    const content = await file.text();

    const newCustomTemplate = {
      name,
      extension,
      content,
    };

    this.form.updateValueElement("name-template", name);
    this.form.updateValueElement("extension-template", extension);
    this.form.updateValueElement("content-template", content);

    setState({ customTemplate: newCustomTemplate });
  }
}
