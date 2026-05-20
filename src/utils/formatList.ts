export function formatList(numbers: number[]): string {
  if (numbers.length === 0) return '';
  return [...numbers].sort((a, b) => a - b).join(', ');
}
