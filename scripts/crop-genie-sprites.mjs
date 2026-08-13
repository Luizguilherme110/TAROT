// One-off asset prep: slices the genios.png sprite sheet (5 cols x 2 rows,
// transparent background) into individual, tightly-cropped mood PNGs under
// public/images/genie/. Requires `npm install --no-save sharp` first; sharp
// is intentionally not a project dependency (only needed to regenerate
// these assets, never at runtime).
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = path.resolve('genios.png');
const OUT_DIR = path.resolve('public/images/genie');

const GRID_COLS = 5;
const GRID_ROWS = 2;

// [col, row] of each mood within the 5x2 sprite grid, zero-indexed.
const MOOD_POSITIONS = {
  neutral: [0, 0], // arms crossed, calm confident smile
  thinking: [1, 0], // hand on chin, question mark
  pleased: [2, 0], // hands together, sparkles
  excited: [3, 0], // thumbs up, exclamation marks
  warm: [3, 1], // heart hands, floating hearts
};

const PAD = 24;

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const { width, height } = await sharp(SRC).metadata();
  if (!width || !height) throw new Error('Could not read genios.png dimensions');

  const cellWidth = Math.floor(width / GRID_COLS);
  const cellHeight = Math.floor(height / GRID_ROWS);

  // Poses aren't perfectly confined to their grid cells - some (arms,
  // sparkles, hearts) bleed a little into the neighboring column on the
  // right. Inset both edges before trimming so the neighbor's fragment
  // never enters the extracted region in the first place.
  const INSET_LEFT = 10;
  const INSET_RIGHT = 80;

  for (const [mood, [col, row]] of Object.entries(MOOD_POSITIONS)) {
    const outPath = path.join(OUT_DIR, `${mood}.png`);
    const cellBuffer = await sharp(SRC)
      .extract({
        left: col * cellWidth + INSET_LEFT,
        top: row * cellHeight,
        width: cellWidth - INSET_LEFT - INSET_RIGHT,
        height: cellHeight,
      })
      .png()
      .toBuffer();
    await sharp(cellBuffer)
      .trim({ threshold: 12 }) // trims on alpha transparency, source has no solid background
      .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(outPath);
    console.log(`wrote ${outPath}`);
  }
}

main();
