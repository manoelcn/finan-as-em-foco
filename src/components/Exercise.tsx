import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { useServerFn } from "@tanstack/react-start";
import { EXERCICIOS } from "@/data/perguntas";
import { montarContexto } from "@/lib/gemini.utils";
import { enviarMensagemTutora } from "@/lib/gemini.server";
import type { Unidade } from "@/data/unidades";

export function Exercise({ unidade, onVoltar }: { unidade: Unidade; onVoltar: () => void }) {
  const { atualizarProficiencia, unidades, alunoNome, empurrarMensagemChat } = useApp();
  const banco = EXERCICIOS[unidade.id];
  const ucAtual = useMemo(() => unidades.find((u) => u.id === unidade.id)!, [unidades, unidade.id]);

  const [filaIdx] = useState(() => {
    const indices = banco.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    // Se o aluno já pontuou bem no diagnóstico (ex: >= 60%), ele responde menos perguntas
    const maxQ = ucAtual.proficiencia >= 60 ? 1 : indices.length;
    return indices.slice(0, maxQ);
  });
  const [progressoFila, setProgressoFila] = useState(0);
  const qIdx = filaIdx[progressoFila];
  const q = banco[qIdx];

  const [tentativa, setTentativa] = useState(1);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [pediuDica, setPediuDica] = useState(false);
  const [mostrarDica, setMostrarDica] = useState(false);
  const [feedback, setFeedback] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Inline AI tutor card state
  const [feedbackIA, setFeedbackIA] = useState<string | null>(null);
  const [loadingIA, setLoadingIA] = useState(false);

  const enviarMsgServidor = useServerFn(enviarMensagemTutora);

  const respondeu = escolha !== null && feedback?.tipo === "ok";



  const responder = (i: number) => {
    if (respondeu) return;

    // Clear previous IA feedback when the student tries again
    setFeedbackIA(null);
    setEscolha(i);

    if (i === q.correta) {
      const deltaNormal = pediuDica ? 15 : tentativa === 1 ? 35 : 15;
      const isUltima = progressoFila + 1 === filaIdx.length;
      const antes = ucAtual.proficiencia;
      
      let novo = Math.min(100, antes + deltaNormal);
      if (isUltima) novo = 100;
      
      const deltaReal = novo - antes;
      
      atualizarProficiencia(unidade.id, deltaReal);
      setFeedback({ tipo: "ok", texto: `🎉 Correto!${deltaReal > 0 ? ` +${deltaReal} pontos` : ""}` });

      if (antes < 80 && novo >= 80) {
        // Show local toast
        setToast("🏆 Módulo Dominado! Novos módulos desbloqueados.");
        setTimeout(() => setToast(null), 3500);

        // Fire AI congratulation message into ChatWidget (non-blocking)
        const unidadesAtualizadas = unidades.map((u) => ({
          ...u,
          proficiencia: u.id === unidade.id ? novo : u.proficiencia,
          status: u.id === unidade.id ? ("dominado" as const) : u.status,
        }));

        const msgComContexto =
          montarContexto(alunoNome, unidadesAtualizadas, unidade.titulo, null) +
          `Acabei de dominar o módulo "${unidade.titulo}"!`;

        enviarMsgServidor({ data: { historico: [], novaMensagem: msgComContexto } })
          .then((resposta) => {
            empurrarMensagemChat({ role: "assistant", content: `🏆 ${resposta}` });
          })
          .catch(() => {
            // Fallback message if AI is unavailable
            empurrarMensagemChat({
              role: "assistant",
              content: `🏆 Parabéns, ${alunoNome || "estudante"}! Você dominou o módulo "${unidade.titulo}"! Continue assim! 🎉`,
            });
          });
      }
    } else {
      atualizarProficiencia(unidade.id, -10);
      const reflexivo = q.feedbacks?.[i];
      setFeedback({
        tipo: "erro",
        texto: reflexivo ?? "Tente novamente! −10 pontos",
      });

      // Set static hint in the AI tutor card instead of making an API call
      setFeedbackIA(reflexivo ?? "Tente novamente! −10 pontos");

      // Reset visual state after 4s so the student can try again
      setTimeout(() => {
        setEscolha(null);
        setFeedback(null);
        setTentativa((t) => t + 1);
        // Keep feedbackIA visible until the student clicks another option
      }, 4000);
    }
  };

  return (
    <div className="relative">
      {toast && (
        <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-xl bg-amber px-5 py-3 font-semibold text-bg shadow-2xl">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button onClick={onVoltar} className="text-sm text-ink-mute hover:text-ink transition">← Voltar ao conteúdo</button>
        <div className="flex gap-2">
          <span className="rounded-full bg-bg px-3 py-1 text-xs font-medium text-ink-mute">
            Questão {progressoFila + 1} de {filaIdx.length}
          </span>
          <span className="rounded-full bg-bg px-3 py-1 text-xs font-medium text-ink-mute">Tentativa {tentativa}</span>
        </div>
      </div>

      <h2 className="mt-4 font-display text-2xl font-bold text-ink">Exercício — {unidade.titulo}</h2>
      <p className="mt-4 font-display text-[22px] font-semibold text-ink leading-relaxed">{q.pergunta}</p>

      <div className="mt-8 flex flex-col gap-[14px]">
        {q.alternativas.map((alt, i) => {
          const ans = escolha === i;
          let cls = "border-border-soft hover:border-emerald bg-surface";
          let labelCls = "text-emerald";

          if (ans && feedback?.tipo === "ok") { cls = "border-emerald bg-emerald/20"; }
          else if (ans && feedback?.tipo === "erro") { cls = "border-danger bg-danger/15"; labelCls = "text-danger"; }
          else if (respondeu && i === q.correta) { cls = "border-emerald bg-emerald/10"; }
          else if (ans) { cls = "border-emerald bg-emerald/5"; }

          return (
            <button
              key={i}
              disabled={respondeu || feedback?.tipo === "erro"}
              onClick={() => responder(i)}
              className={`flex w-full items-center gap-4 rounded-lg border-2 px-[20px] py-[18px] text-left transition ${cls}`}
            >
              <span className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded border border-border-soft bg-bg font-display text-[15px] font-bold shadow-sm ${labelCls}`}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 text-sm text-ink">{alt}</span>
              {ans && feedback?.tipo === "ok" && <span className="text-emerald text-lg">✓</span>}
              {ans && feedback?.tipo === "erro" && <span className="text-danger text-lg">✗</span>}
            </button>
          );
        })}
      </div>

      {feedback?.tipo === "ok" && (
        <div className="mt-4 rounded-lg bg-emerald/15 p-3 text-sm font-medium text-emerald">
          {feedback.texto}
        </div>
      )}

      {/* ── Inline AI tutor feedback card (shown on wrong answers) ── */}
      {(loadingIA || feedbackIA) && (
        <div
          className="mt-4 animate-fade-in rounded-lg p-3"
          style={{
            background: "#1E293B",
            borderLeft: "3px solid #F59E0B",
            borderRadius: "8px",
            padding: "12px",
          }}
        >
          <div className="mb-2 flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-base"
              style={{ background: "#10B981", fontSize: "16px" }}
            >
              🤖
            </span>
            <span className="text-xs font-semibold" style={{ color: "#F59E0B" }}>
              Prof. Fina
            </span>
          </div>

          {loadingIA ? (
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "#94A3B8" }}>Prof. Fina está analisando</span>
              <span className="flex gap-1">
                {[0, 0.15, 0.3].map((delay, idx) => (
                  <span
                    key={idx}
                    className="dot-bounce inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: "#94A3B8", animationDelay: `${delay}s` }}
                  />
                ))}
              </span>
            </div>
          ) : (
            <p className="text-sm leading-relaxed" style={{ color: "#F1F5F9" }}>
              {feedbackIA}
            </p>
          )}
        </div>
      )}

      {!respondeu && (
        <button
          disabled={pediuDica}
          onClick={() => {
            setPediuDica(true);
            
            // Push user message to chat so they see they asked for a hint
            empurrarMensagemChat({ role: "user", content: "Pode me dar uma dica sobre essa questão?" });
            
            const msgComContexto = `Estou respondendo a seguinte questão: "${q.pergunta}". As alternativas são: ${q.alternativas.join(", ")}. Por favor, me dê uma dica breve para me ajudar a chegar na resposta, mas NÃO me dê a resposta direta.`;
            
            enviarMsgServidor({ data: { historico: [], novaMensagem: msgComContexto } })
              .then((resposta) => {
                empurrarMensagemChat({ role: "assistant", content: resposta });
              })
              .catch(() => {
                empurrarMensagemChat({ role: "assistant", content: q.dica || "Pense bem sobre os conceitos que vimos..." });
              });
          }}
          className="mt-4 rounded-lg border border-amber/50 bg-amber/10 px-4 py-2 text-sm font-medium text-amber hover:bg-amber/20 outline-none focus-visible:ring-2 focus-visible:ring-amber disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pediuDica ? "💡 Dica enviada no chat" : "💡 Pedir dica"}
        </button>
      )}

      {respondeu && (
        <button 
          onClick={() => {
            if (progressoFila + 1 >= filaIdx.length) {
              onVoltar();
            } else {
              setProgressoFila(p => p + 1);
              setTentativa(1);
              setEscolha(null);
              setFeedback(null);
              setPediuDica(false);
              setMostrarDica(false);
              setFeedbackIA(null);
              setLoadingIA(false);
            }
          }} 
          className="mt-6 w-full rounded-lg bg-emerald px-4 py-3 font-semibold text-bg hover:bg-emerald-600 transition outline-none focus-visible:ring-2 focus-visible:ring-emerald"
        >
          {progressoFila + 1 >= filaIdx.length ? "Finalizar exercício" : "Próxima questão →"}
        </button>
      )}
    </div>
  );
}
