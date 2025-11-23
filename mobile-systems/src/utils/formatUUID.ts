export function formatUUIDAsShort(
  uuid: string | null | undefined,
  startLength: number = 5,
  endLength: number = 4
): string {
  if (!uuid || uuid.length <= (startLength + endLength + 3)) {
    return uuid || '';
  }

  const start = uuid.slice(0, startLength);
  const end = uuid.slice(-endLength);

  return `${start}...${end}`
}