export function normalizePublicationDate(value: string) {
  return value.replaceAll('.', '-');
}

export function formatPublicationDate(value: string) {
  const normalized = normalizePublicationDate(value);
  const [year, month, day] = normalized.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    [year, month, day].some((part) => !Number.isFinite(part))
    || Number.isNaN(date.getTime())
  ) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
