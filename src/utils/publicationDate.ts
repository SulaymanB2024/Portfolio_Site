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

/** Latest declared content date, never the build clock. Reject malformed dates rather than advertising them. */
export function latestContentDate(values: readonly string[]) {
  if (!values.length) throw new Error('At least one content date is required.');
  const dates = values.map(normalizePublicationDate);
  for (const date of dates) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)
      || !Number.isFinite(Date.parse(date))
      || new Date(date).toISOString().slice(0, 10) !== date) {
      throw new Error(`Invalid content date: ${date}`);
    }
  }
  return dates.sort().at(-1)!;
}
