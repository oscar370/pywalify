import { getState } from "@/store/appStore";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";

export async function exportTemplate() {
  const customTemplate = getState().customTemplate;

  const filePath = await save({
    defaultPath: `${customTemplate.name}.${customTemplate.extension}`,
    filters: [
      {
        name: "Color Scheme",
        extensions: [customTemplate.extension],
      },
    ],
  });

  if (filePath) {
    await writeTextFile(filePath, customTemplate.content);
  }
}
