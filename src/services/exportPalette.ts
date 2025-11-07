import { getState } from "@/store/appStore";
import { setToastDone } from "@/utils/setDone";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";

export async function exportPalette(
  templateType: string,
  customTemplate?: string
) {
  try {
    const state = getState();

    const response = await fetch(`${state.backendURL}/export-template`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        colors: state.colors,
        special: state.specialColors,
        template_type: templateType,
        custom_template: customTemplate || null,
      }),
    });

    if (!response.ok)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    const { content } = await response.json();

    if (!content) throw new Error("No content received");

    const extension = customTemplate
      ? state.customTemplate.extension
      : templateType;

    const name = customTemplate ? state.customTemplate.name : "colors";

    const filePath = await save({
      defaultPath: `${name}.${extension}`,
      filters: [
        {
          name: "Color Scheme",
          extensions: [extension],
        },
      ],
    });

    if (filePath) {
      await writeTextFile(filePath, content);
    }

    setToastDone("Exported palette");
  } catch (error) {
    console.error("Export failed:", error);
  }
}
