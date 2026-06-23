import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const SYSTEM = `Você é a Prof. Fina, tutora especializada em Matemática Financeira para estudantes do ensino médio. Você é parte de um ITS (Sistema de Tutoria Inteligente) chamado 'Finanças em Foco'.

Você tem acesso ao estado atual do aluno que será passado no contexto da mensagem.

Seu estilo: didático, encorajador, usa exemplos do cotidiano de jovens (celular, lanche, mesada, primeiro emprego). Nunca dê a resposta direta dos exercícios — guie com perguntas e dicas. Limite suas respostas a 3-4 parágrafos curtos. Use emojis com moderação. Responda SEMPRE em português.

Os 7 módulos do sistema são: (1) Necessidade vs. Desejo, (2) Orçamento Pessoal, (3) Porcentagem, (4) Juros Simples, (5) Juros Compostos, (6) Cartão de Crédito, (7) Poupança e Metas.`;

const Schema = z.object({
  mensagem: z.string().min(1),
  alunoNome: z.string().default(""),
  ucAtual: z.string().default("nenhuma"),
  proficiencias: z.string().default(""),
  historico: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).default([]),
});

export const enviarMensagemTutora = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Schema.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY não configurada");
    const gateway = createLovableAiGatewayProvider(key);
    const contexto = `[Contexto do aluno: Nome: ${data.alunoNome || "(sem nome)"}. UC selecionada: ${data.ucAtual}. Proficiências: ${data.proficiencias}]\n\nPergunta do aluno: ${data.mensagem}`;

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system: SYSTEM,
      messages: [
        ...data.historico.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: contexto },
      ],
      maxOutputTokens: 1000,
    });
    return { reply: text };
  });
