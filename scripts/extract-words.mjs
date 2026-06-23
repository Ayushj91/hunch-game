import fs from "fs";
import vm from "vm";

const html = fs.readFileSync(
  new URL("../hunch_6.html", import.meta.url),
  "utf8"
);

function extractObject(name) {
  const marker = `const ${name}=`;
  const start = html.indexOf(marker);
  if (start === -1) throw new Error(`Missing ${name}`);
  const braceStart = html.indexOf("{", start);
  let depth = 0;
  let end = braceStart;
  for (; end < html.length; end++) {
    const ch = html[end];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        end++;
        break;
      }
    }
  }
  const objSrc = html.slice(braceStart, end);
  const ctx = {};
  vm.runInNewContext(`result = ${objSrc};`, ctx);
  return ctx.result;
}

const ACCEPT = extractObject("ACCEPT");
const ANSWERS = extractObject("ANSWERS");

function toWordArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.trim().split(/\s+/);
  throw new Error("Unexpected word list format");
}

const out = `// Auto-generated from hunch_6.html — do not edit manually
export const WORDS_4 = new Set(${JSON.stringify(toWordArray(ACCEPT[4]))});
export const WORDS_5 = new Set(${JSON.stringify(toWordArray(ACCEPT[5]))});
export const WORDS_6 = new Set(${JSON.stringify(toWordArray(ACCEPT[6]))});
export const ANSWERS_4 = new Set(${JSON.stringify(toWordArray(ANSWERS[4]))});
export const ANSWERS_5 = new Set(${JSON.stringify(toWordArray(ANSWERS[5]))});
export const ANSWERS_6 = new Set(${JSON.stringify(toWordArray(ANSWERS[6]))});
export const ACCEPT: Record<number, Set<string>> = {
  4: WORDS_4,
  5: WORDS_5,
  6: WORDS_6,
};
export const ANSWERS: Record<number, Set<string>> = {
  4: ANSWERS_4,
  5: ANSWERS_5,
  6: ANSWERS_6,
};
`;

fs.mkdirSync(new URL("../src/lib", import.meta.url), { recursive: true });
fs.writeFileSync(new URL("../src/lib/words.ts", import.meta.url), out);
console.log("words.ts written");
