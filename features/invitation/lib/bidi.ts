const ARABIC = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;
const LATIN = /[A-Za-z0-9]/;

/**
 * Reorder words into the visual order an RTL reader expects.
 *
 * This exists because Satori — which `next/og` renders the share card through —
 * has no bidi algorithm (vercel/satori#74). It *does* shape each word correctly,
 * cursive joining and all, but it lays the word boxes out left-to-right in
 * logical order. So "عمر و سارة" is drawn as "سارة و عمر": the groom and the
 * bride swapped on every share card, and it looks entirely correct while being
 * wrong, which is what makes it dangerous.
 *
 * Reversing the words is most of the fix but not all of it. A Latin run embedded
 * in Arabic still reads left-to-right *within itself* even though it sits
 * right-to-left in the flow, so a blanket reverse turns a venue called
 * "place test" into "test place". Hence the second pass, which flips each
 * maximal Latin run back — the standard reverse-the-reverse.
 *
 * Neutrals (the "·" separator, punctuation) take the base direction, which here
 * is always RTL: these are Arabic invitations.
 *
 * Arabic-Indic digits live in the Arabic block, so "٢٠٢٦" classifies as RTL and
 * is left alone. That is right: Satori already orders the digits correctly
 * inside the token, and only the token's position needed fixing.
 *
 * This is deliberately not a full Unicode bidi implementation. It handles the
 * shapes an invitation actually contains — Arabic, embedded Latin names and
 * venues, digits, and simple separators — and nothing else.
 */
export function toVisualOrder(text: string): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const isLatin = (w: string) => LATIN.test(w) && !ARABIC.test(w);

  const visual = [...words].reverse();

  for (let i = 0; i < visual.length; ) {
    if (!isLatin(visual[i])) {
      i++;
      continue;
    }

    let end = i;
    while (end + 1 < visual.length && isLatin(visual[end + 1])) end++;

    const run = visual.slice(i, end + 1).reverse();
    visual.splice(i, run.length, ...run);

    i = end + 1;
  }

  return visual;
}
