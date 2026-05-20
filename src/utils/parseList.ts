export function parseList(listaStr: string): number[] {
  if (!listaStr || listaStr.trim() === '') return [];
  return listaStr
    .split(',')
    .map((x) => x.trim())
    .filter((x) => /^\d+$/.test(x))
    .map(Number);
}
