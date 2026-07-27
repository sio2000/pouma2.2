/**
 * Slug helpers for /workshop/{slug}.
 *
 * Greek input is transliterated to ASCII so URLs stay clean and shareable,
 * e.g. "AI Μάρκετινγκ Masterclass" → "ai-marketing-masterclass".
 */

const GREEK_MAP: Record<string, string> = {
  α: "a", ά: "a", β: "v", γ: "g", δ: "d", ε: "e", έ: "e", ζ: "z",
  η: "i", ή: "i", θ: "th", ι: "i", ί: "i", ϊ: "i", ΐ: "i", κ: "k",
  λ: "l", μ: "m", ν: "n", ξ: "x", ο: "o", ό: "o", π: "p", ρ: "r",
  σ: "s", ς: "s", τ: "t", υ: "y", ύ: "y", ϋ: "y", ΰ: "y", φ: "f",
  χ: "ch", ψ: "ps", ω: "o", ώ: "o",
};

function transliterate(input: string): string {
  return input
    .split("")
    .map((char) => GREEK_MAP[char.toLowerCase()] ?? char)
    .join("");
}

export function slugify(input: string): string {
  return transliterate(input.trim())
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip remaining diacritics
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumerics → hyphen
    .replace(/^-+|-+$/g, "") // trim hyphens
    .replace(/-{2,}/g, "-") // collapse repeats
    .slice(0, 80);
}

/** True when a string is already a clean slug. */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 80;
}

/**
 * Produce a slug that does not collide with `existing`. If the base slug is
 * taken, append -2, -3, … until free.
 */
export function ensureUniqueSlug(base: string, existing: Iterable<string>): string {
  const taken = new Set(existing);
  const root = slugify(base) || "workshop";
  if (!taken.has(root)) return root;

  let counter = 2;
  let candidate = `${root}-${counter}`;
  while (taken.has(candidate)) {
    counter += 1;
    candidate = `${root}-${counter}`;
  }
  return candidate;
}
