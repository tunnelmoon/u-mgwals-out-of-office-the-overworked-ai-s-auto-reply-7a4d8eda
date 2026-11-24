import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I am out of office until Monday. I delegated my inbox to a smaller model. It read one email and quit.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const chars = [...LINE].length;
if (chars < 1 || chars > 159) {
  throw new Error(`entry is ${chars} characters, must be 1-159`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry is only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (LINE !== LINE.trim()) {
  throw new Error("entry must not start or end with whitespace: it wastes bytes on the size tie-break");
}

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  throw new Error("round-trip mismatch: entry.txt does not match the line");
}

console.log(
  `wrote ${outPath}: ${chars} chars, ${Buffer.byteLength(LINE, "utf8")} bytes, single line`,
);
