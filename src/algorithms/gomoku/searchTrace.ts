// Portado de: algorithms/gomoku/search_trace.py

export function fmtScore(value: number): string {
  if (value >= 999_000) return '+∞ vitória';
  if (value <= -999_000) return '-∞ derrota';
  if (value === Infinity) return '+∞';
  if (value === -Infinity) return '-∞';
  return Math.abs(value) >= 100 ? `${value >= 0 ? '+' : ''}${value.toFixed(0)}` : `${value >= 0 ? '+' : ''}${value.toFixed(1)}`;
}

export function fmtCoord(row: number, col: number): string {
  return `(${row + 1},${col + 1})`;
}

export class SearchTrace {
  maxLines = 48;
  lines: string[] = [];
  prunesAtRoot = 0;
  candidatesLogged = 0;

  add(line: string): void {
    if (this.lines.length < this.maxLines) {
      this.lines.push(line);
    }
  }

  addPrune(skipped: number): void {
    this.prunesAtRoot += skipped;
    this.add(`  >> PODA a-b · ${skipped} ramo(s) ignorado(s)`);
  }

  formatBlock(): string {
    let body = this.lines.join('\n');
    if (this.prunesAtRoot) {
      body += `\n>> Podas na raiz: ${this.prunesAtRoot} ramo(s)`;
    }
    return body;
  }

  clear(): void {
    this.lines = [];
    this.prunesAtRoot = 0;
    this.candidatesLogged = 0;
  }
}
