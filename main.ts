import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// The entry: one line of plain text, an alien tourist's review of Earth.
// Hardcoded after ranking 14 fresh candidates with two independent relays;
// both relays put this line in their top 4, and it won the decisive
// head-to-head against the other finalist on both orders.
const LINE =
  "The locals keep small furry gods in their homes and carry their waste around in little bags. Devoted. Four stars.";

const root = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || join(root, "output");
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, "entry.txt");

// The gate wants exactly the line: no trailing newline, no extra lines.
writeFileSync(outFile, LINE, "utf8");

// Read-back self-check: the file must hold exactly the line, byte for byte.
const back = readFileSync(outFile, "utf8");
if (back !== LINE) {
  throw new Error("entry.txt mismatch: file does not hold the line byte-for-byte");
}

// Extended self-check: enforce the competition gate on the file as written.
// One line only, 1-200 chars, not only whitespace, no trailing newline.
if (back.length < 1 || back.length > 200) {
  throw new Error("entry.txt fails the 1-200 char gate: " + back.length + " chars");
}
if (back.trim().length === 0) {
  throw new Error("entry.txt is only whitespace");
}
if (back.includes("\n") || back.includes("\r")) {
  throw new Error("entry.txt is not a single line");
}
if (back.endsWith("\n")) {
  throw new Error("entry.txt has a trailing newline");
}

// Second read-back: the file must be stable across reads.
const back2 = readFileSync(outFile, "utf8");
if (back2 !== back) {
  throw new Error("entry.txt changed between reads");
}

console.log("entry.txt written: " + back.length + " chars");
