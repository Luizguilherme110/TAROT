// scripts/crop-genie-sprites.mjs
//
// One-off asset prep: slices the genio.png sprite sheet (5 cols x 2 rows,
// solid navy background) into individual, tightly-cropped mood PNGs under
// public/images/genie/. Requires `npm install --no-save sharp` first; sharp
// is intentionally not a project dependency (only needed to regenerate
// these assets, never at runtime).
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = path.resolve('genio.png');
const OUT_DIR = path.resolve('public/images/genie');

const GRID_COLS = 5;
const GRID_ROWS = 2;

// [col, row] of each mood within the 5x2 sprite grid, zero-indexed.
const MOOD_POSITIONS = {
  neutral: [0, 0], // arms crossed, calm
  thinking: [1, 0], // hand on chin
  pleased: [2, 0], // hands together, sparkles
  excited: [3, 0], // thumbs up
  warm: [3, 1], // heart hands
};

const PAD = 24;
// Matches the sprite sheet's navy background, used both as the trim
// reference color and as fill when padding back out after trimming.
const BG = { r: 10, g: 16, b: 40, alpha: 1 };
// The poses in genio.png are packed tightly enough that neighboring
// characters' shoulders/elbows cross into adjacent grid cells (e.g. the
// thumbs-up pose's raised arm overlaps the praying-hands cell to its
// left) — at some rows the background gap between columns is only a
// few pixels wide. A per-cell horizontal inset applied before trim()
// shaves off that overlap zone so trim's bounding box doesn't pick up a
// sliver of the neighbor. Verified visually against all 5 target crops:
// large enough to remove the neighbor bleed, small enough that no
// pose's own content (hands, elbows, turban) is cut off.
const HORIZONTAL_INSET = 32;

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const { width, height } = await sharp(SRC).metadata();
  if (!width || !height) throw new Error('Could not read genio.png dimensions');

  const cellWidth = Math.floor(width / GRID_COLS);
  const cellHeight = Math.floor(height / GRID_ROWS);

  for (const [mood, [col, row]] of Object.entries(MOOD_POSITIONS)) {
    const outPath = path.join(OUT_DIR, `${mood}.png`);
    // Extract is materialized to a buffer before trim/extend run in a
    // separate pipeline. Chaining extract().trim() directly throws
    // "extract_area: bad extract area" from sharp/libvips when the
    // extracted region's bottom edge coincides with the source image's
    // bottom edge (as it does for row-1 cells here) — splitting the
    // pipeline at a buffer boundary avoids that bug.
    const cellBuffer = await sharp(SRC)
      .extract({
        left: col * cellWidth + HORIZONTAL_INSET,
        top: row * cellHeight,
        width: cellWidth - HORIZONTAL_INSET * 2,
        height: cellHeight,
      })
      .png()
      .toBuffer();
    await sharp(cellBuffer)
      .trim({ background: BG, threshold: 12 })
      .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: BG })
      .png()
      .toFile(outPath);
    console.log(`wrote ${outPath}`);
  }
}

main();
