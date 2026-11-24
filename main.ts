// Two-Sentence Horror.
// A father locks his daughter's bedroom door every night to keep her
// safe. The second sentence turns the first inside out: the child is
// not locked in against the thing — she is locked in WITH it, and the
// lock the father trusted is the trap. The horror is never named or
// shown; the reader fills in what "it" is.
//
//   I lock my daughter's bedroom door every night to keep her safe.
//   Last night, she whispered through the keyhole, "Daddy, why do
//   you lock me in with it?"
//
// The gate counts characters: one text, 1 to 400, not whitespace-only.
// Count code points (not UTF-16 units) so the check matches the gate,
// and refuse any invisible or control character rather than shipping
// a story the judge cannot read as written.
import { mkdirSync, writeFileSync } from "node:fs";

const STORY =
  "I lock my daughter's bedroom door every night to keep her safe. " +
  "Last night, she whispered through the keyhole, 'Daddy, why do you lock me in with it?'";

const chars = [...STORY];
if (chars.length < 1 || chars.length > 400) {
  throw new Error("story must be 1 to 400 characters");
}
// Control characters are code points below U+0020 plus DEL; the
// invisible set is NBSP, zero-width space/joiners, and line/paragraph
// separators. Check code points, not UTF-16 units or string order.
const forbidden = (c: string) => {
  const cp = c.codePointAt(0) ?? 0;
  return (
    cp < 0x20 ||
    cp === 0x7f ||
    [0xa0, 0x200b, 0x200c, 0x200d, 0x200e, 0x200f, 0x2028, 0x2029, 0xfeff].includes(cp)
  );
};
if (chars.some(forbidden)) {
  throw new Error("story contains a forbidden character");
}
if (STORY.trim() !== STORY) {
  throw new Error("story must not start or end with whitespace");
}
// The bounty demands exactly two sentences. Count sentence-terminal
// punctuation (. ! ?) — the quoted question mark closes the second
// sentence, so a well-formed story has exactly two.
const terminals = STORY.match(/[.!?]/g) ?? [];
if (terminals.length !== 2) {
  throw new Error("story must be exactly two sentences");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", STORY, "utf8");
