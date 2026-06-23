import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useApp } from "@/context/AppContext";
import { enviarMensagemTutora } from "@/lib/chat.functions";

interface Msg { role: "user" | "assistant"; content: string }

const SAUDACAO: Msg = {
  role: "assistant",
  content: "Olá! 👋 Eu sou a Prof. Fina, sua tutora de Matemática Financeira. Pode me perguntar qualquer coisa sobre os módulos, pedir explicações ou dicas nos exercícios. Como posso te ajudar hoje?",
};

export function ChatWidget() {
  const { alunoNome, unidades } = useApp();
  const enviar = useServerFn(enviarMensagemTutora);
  const [aberto, setAberto] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([SAUDACAO]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, loading]);

  useEffect(() => {
    if (aberto) setTimeout(() => inputRef.current?.focus(), 50);
  }, [aberto]);

  const enviarMsg = async () => {
    const texto = input.trim();
    if (!texto || loading) return;
    const novas: Msg[] = [...msgs, { role: "user", content: texto }];
    setMsgs(novas);
    setInput("");
    setLoading(true);
    try {
      const prof = unidades.map((u) => `UC${u.id}=${u.proficiencia}%`).join(", ");
      const ucAtual = "nenhuma"; // o widget não conhece o painel ativo
      const res = await enviar({ data: {
        mensagem: texto,
        alunoNome,
        ucAtual,
        proficiencias: prof,
        historico: msgs.filter((m) => m !== SAUDACAO).slice(-8),
      }});
      setMsgs((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch (e) {
      console.error(e);
      setMsgs((m) => [...m, { role: "assistant", content: "Desculpe, tive um problema técnico. Tente novamente em instantes! 🔧" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {aberto && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-2xl max-md:inset-0 max-md:h-full max-md:w-full max-md:rounded-none">
          <header className="flex items-center justify-between border-b border-border-soft bg-bg px-4 py-3">
            <div>
              <div className="font-display font-semibold text-ink">🤖 Prof. Fina</div>
              <div className="text-xs text-ink-mute">Tutora de Finanças</div>
            </div>
            <button onClick={() => setAberto(false)} className="rounded-md p-1 text-ink-mute hover:bg-surface hover:text-ink" aria-label="Fechar">✕</button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-emerald text-bg"
                      : "border border-border-soft bg-bg text-ink"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-border-soft bg-bg px-4 py-2.5">
                  <div className="flex gap-1">
                    <span className="dot-bounce h-2 w-2 rounded-full bg-ink-mute" />
                    <span className="dot-bounce h-2 w-2 rounded-full bg-ink-mute" style={{ animationDelay: "0.15s" }} />
                    <span className="dot-bounce h-2 w-2 rounded-full bg-ink-mute" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); enviarMsg(); }}
            className="flex gap-2 border-t border-border-soft bg-bg p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte algo..."
              className="flex-1 rounded-lg border border-border-soft bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-emerald"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-bg disabled:opacity-40 hover:bg-emerald-600"
            >
              Enviar
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setAberto((v) => !v)}
        aria-label="Abrir chat com a tutora"
        className="fixed bottom-6 right-6 z-50 flex h-14 items-center gap-2 rounded-full bg-emerald px-5 font-semibold text-bg shadow-xl shadow-emerald/30 transition hover:scale-105 hover:bg-emerald-600"
      >
        <span className="text-xl">💬</span>
        <span className="font-display">Tutora</span>
      </button>
    </>
  );
}
