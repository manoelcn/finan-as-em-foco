import type { Unidade } from "@/data/unidades";

// ── Tipos ─────────────────────────────────────────────────────────────

export interface GeminiHistoryEntry {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface UltimoExercicio {
  pergunta: string;
  respostaAluno: string;
  respostaCorreta: string;
  resultado: "acerto" | "erro";
  tentativas: number;
  usouDica: boolean;
}

// ── Montagem de contexto ──────────────────────────────────────────────

export function montarContexto(
  alunoNome: string,
  unidades: Unidade[],
  ucAtual: string,
  ultimoExercicio: UltimoExercicio | null,
): string {
  const proficiencias = unidades
    .map((u) => `  UC${u.id} - ${u.titulo}: ${u.proficiencia}% [${u.status}]`)
    .join("\n");

  const exercicio = ultimoExercicio
    ? `\nÚltimo exercício:\n  Pergunta: ${ultimoExercicio.pergunta}\n  Resposta do aluno: ${ultimoExercicio.respostaAluno}\n  Resposta correta: ${ultimoExercicio.respostaCorreta}\n  Resultado: ${ultimoExercicio.resultado}\n  Número de tentativas: ${ultimoExercicio.tentativas}\n  Usou dica: ${ultimoExercicio.usouDica ? "sim" : "não"}`
    : "";

  return `[CONTEXTO DO ALUNO]
Módulo atual: ${ucAtual}
Proficiências:
${proficiencias}${exercicio}
[FIM DO CONTEXTO]

Pergunta do aluno: `;
}
