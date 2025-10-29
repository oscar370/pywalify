import { getState, setState } from "@/store/appStore";
import { getImage } from "@/store/imageStore";
import { setToastDone } from "@/utils/setDone";
import { setToastError } from "@/utils/setError";

export default async function generatePalette() {
  try {
    const image = await getImage();
    const state = getState();
    const formData = new FormData();

    if (!image)
      throw new Error(
        "The image could not be obtained when generating the palette."
      );

    formData.append("file", image);
    formData.append("backend", state.backend);
    formData.append("light", state.lightMode.toString());
    formData.append("c16", state.darkExtended ? "darken" : "lighten");
    formData.append("sat", state.saturation);
    formData.append("cst", state.contrast);

    const response = await fetch(`${state.backendURL}/generate-palette`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      const message = error.detail.replace(/^\d+:\s*/, "");
      setToastError(message);
      throw new Error(error.detail);
    }

    const data = await response.json();
    console.log(data);

    setState({ specialColors: data.special });
    setState({ colors: data.colors });
    setToastDone("Generated color palette");
  } catch (error) {
    console.error("Error generating the palette: ", error);
  }
}
