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

const SchemaErro = z.object({
  alunoNome: z.string().default(""),
  nomeUC: z.string(),
  pergunta: z.string(),
  alternativaErrada: z.string(),
  alternativaCorreta: z.string(),
});

export const explicarErroExercicio = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SchemaErro.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY não configurada");
    const gateway = createLovableAiGatewayProvider(key);
    const prompt = `O aluno ${data.alunoNome || "estudante"} está estudando o módulo '${data.nomeUC}' e errou uma questão.

Pergunta: ${data.pergunta}
Alternativa que o aluno escolheu (ERRADA): ${data.alternativaErrada}
Alternativa correta: ${data.alternativaCorreta}

Em 2-3 frases curtas: explique por que a alternativa escolhida está errada e dê uma dica para o aluno raciocinar melhor, sem entregar a resposta diretamente. Seja encorajador e use linguagem simples para ensino médio. Responda em português.`;

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system: SYSTEM,
      messages: [{ role: "user" as const, content: prompt }],
      maxOutputTokens: 300,
    });
    return { reply: text };
  });

const SchemaConquista = z.object({
  alunoNome: z.string().default(""),
  nomeUC: z.string(),
  proficiencia: z.number(),
  estadoUnidades: z.string(), // ex: "UC1=dominado(95%), UC2=disponivel(30%), ..."
});

export const parabenizarConquista = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SchemaConquista.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY não configurada");
    const gateway = createLovableAiGatewayProvider(key);
    const prompt = `O aluno ${data.alunoNome || "estudante"} acabou de dominar o módulo '${data.nomeUC}' (proficiência ${data.proficiencia}%).

Estado atual de todas as unidades: ${data.estadoUnidades}

Em 3-4 frases: parabenize o aluno de forma genuína e motivadora, mencione especificamente o que ele aprendeu neste módulo, e indique qual(is) módulo(s) estão agora disponíveis para ele estudar (se houver), explicando brevemente por que faz sentido estudá-los agora. Se não houver próximo módulo disponível ainda, incentive-o a continuar com os módulos em andamento. Responda em português, seja caloroso e use o nome do aluno.`;

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system: SYSTEM,
      messages: [{ role: "user" as const, content: prompt }],
      maxOutputTokens: 400,
    });
    return { reply: text };
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
