// Generate PNG icons from SVG for PWA / App Store / home screen
import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "../public");

const svgSource = readFileSync(resolve(publicDir, "forge-icon-512.svg"), "utf8");

const sizes = [192, 512, 180]; // 180 = apple-touch-icon

for (const size of sizes) {
  const name = size === 180 ? "apple-touch-icon.png" : `forge-icon-${size}.png`;
  await sharp(Buffer.from(svgSource))
    .resize(size, size)
    .png()
    .toFile(resolve(publicDir, name));
  console.log(`Created ${name}`);
}

console.log("All icons generated.");
