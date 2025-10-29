import { PaletteList } from "@/components/paletteList";
import { palettes } from "@/data/palettes";
import { specialColors } from "@/data/specialColors";
import { setState } from "@/store/appStore";
import { Palette } from "@/types";
import { setToastDone } from "@/utils/setDone";

export class PresetSource {
  readonly root: HTMLElement;
  private paletteList!: PaletteList;

  constructor() {
    this.root = document.createElement("main");

    this.setupElements();
  }

  private setupElements() {
    this.paletteList = new PaletteList({
      palettes: palettes,
      onClick: this.handlePaletteClick,
    });

    this.root.append(this.paletteList.root);
  }

  private handlePaletteClick(palette: Palette) {
    const { name, colors } = palette;
    const special = specialColors.find((color) => name === color.name);
    const newColors = Object.fromEntries(
      colors.map((c, i) => [`color${i}`, c])
    );
    setState({ colors: newColors });
    if (special) setState({ specialColors: special.special });
    setToastDone("Pallet applied correctly");
  }
}
