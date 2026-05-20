export type LogStatus = 'aguardando' | 'em execução' | 'concluído' | string;

export function formatTurnSeparator(turn: number): string {
  return `--- Turno ${turn} ---`;
}

export function formatGenerationSeparator(generation: number): string {
  return `--- Geração ${generation} ---`;
}
