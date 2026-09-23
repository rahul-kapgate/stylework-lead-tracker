export function normalizeLeadSearch(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function validateLeadSearch(value: string): string | null {
  const search = normalizeLeadSearch(value);

  if (!search) {
    return null;
  }

  if (search.length < 2) {
    return "Enter at least 2 characters.";
  }

  if (search.length > 80) {
    return "Search cannot exceed 80 characters.";
  }

  if (!/[a-zA-Z0-9]/.test(search)) {
    return "Enter a valid name, email or phone number.";
  }

  return null;
}
