const TURKISH_CHAR_MAP: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  I: "i",
  İ: "i",
  i: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
  â: "a",
  Â: "a",
  ê: "e",
  Ê: "e",
  î: "i",
  Î: "i",
  ô: "o",
  Ô: "o",
  û: "u",
  Û: "u",
}

function normalizeTurkishCharacters(value: string): string {
  return value
    .split("")
    .map((char) => TURKISH_CHAR_MAP[char] ?? char)
    .join("")
}

export function slugify(value: string): string {
  if (!value) {
    return ""
  }

  const normalized = normalizeTurkishCharacters(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")

  return normalized
    .toLowerCase()
    .replace(/&/g, "-ve-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
}

export function generateUniqueSlug(base: string, existing?: Set<string>): string {
  const baseSlug = slugify(base)
  if (!existing || !existing.has(baseSlug)) {
    return baseSlug
  }

  let suffix = 2
  let candidate = `${baseSlug}-${suffix}`
  while (existing.has(candidate)) {
    suffix += 1
    candidate = `${baseSlug}-${suffix}`
  }

  return candidate
}

