import fs from "fs";
import path from "path";

const inputDir = "../.venv/lib/python3.13/site-packages/pywal/colorschemes";
const outputFile = "../src/data/palettes.json";

function collectSchemes(modeDir, mode) {
  const files = fs.readdirSync(modeDir).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const raw = JSON.parse(fs.readFileSync(path.join(modeDir, file), "utf8"));
    return {
      name: path.basename(file, ".json"),
      mode,
      colors: Object.values(raw.colors),
      special: Object.values(raw.special),
    };
  });
}

const darkDir = path.join(inputDir, "dark");
const lightDir = path.join(inputDir, "light");

let all = [];
if (fs.existsSync(darkDir)) all = all.concat(collectSchemes(darkDir, "dark"));
if (fs.existsSync(lightDir))
  all = all.concat(collectSchemes(lightDir, "light"));

fs.writeFileSync(outputFile, JSON.stringify(all, null, 2));
