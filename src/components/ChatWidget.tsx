import { useEffect, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import { useServerFn } from "@tanstack/react-start";
import {
  montarContexto,
  type GeminiHistoryEntry,
} from "@/lib/gemini.utils";
import { enviarMensagemTutora } from "@/lib/gemini.server";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const { alunoNome, unidades, mensagensPendentes, consumirMensagensPendentes } =
    useApp();

  const [msgs, setMsgs] = useState<Msg[]>(() => [
    {
      role: "assistant",
      content: `Olá${alunoNome ? `, ${alunoNome}` : ""}! 👋 Eu sou a Prof. Fina, sua tutora de Matemática Financeira. Pode me perguntar qualquer coisa sobre os módulos, pedir explicações ou dicas nos exercícios. Como posso te ajudar hoje?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const geminiHistoryRef = useRef<GeminiHistoryEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const enviarMsgServidor = useServerFn(enviarMensagemTutora);

  useEffect(() => {
    if (mensagensPendentes.length === 0) return;
    setMsgs((prev) => [...prev, ...mensagensPendentes]);
    consumirMensagensPendentes();
  }, [mensagensPendentes, consumirMensagensPendentes]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, loading]);

  const enviarMsg = async () => {
    const texto = input.trim();
    if (!texto || loading) return;

    setMsgs((prev) => [...prev, { role: "user", content: texto }]);
    setInput("");
    setLoading(true);

    try {
      const ucAtual = "nenhuma";
      const msgComContexto =
        montarContexto(alunoNome, unidades, ucAtual, null) + texto;

      const resposta = await enviarMsgServidor({
        data: {
          historico: geminiHistoryRef.current,
          novaMensagem: msgComContexto,
        },
      });

      setMsgs((prev) => [...prev, { role: "assistant", content: resposta }]);

      geminiHistoryRef.current = [
        ...geminiHistoryRef.current,
        { role: "user", parts: [{ text: msgComContexto }] },
        { role: "model", parts: [{ text: resposta }] },
      ];
    } catch (e) {
      console.error(e);
      setMsgs((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Tive um problema técnico aqui. Tente novamente em instantes! 🔧",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-sm">
      <header className="flex items-center gap-3 border-b border-border-soft bg-bg px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald/10 text-xl">
          🤖
        </div>
        <div>
          <div className="font-display font-semibold text-ink">
            Prof. Fina
          </div>
          <div className="text-xs text-ink-mute">Tutora de Finanças</div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-[16px] py-[12px] text-[14px] ${
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
                <span
                  className="dot-bounce h-2 w-2 rounded-full bg-ink-mute"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="dot-bounce h-2 w-2 rounded-full bg-ink-mute"
                  style={{ animationDelay: "0.3s" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          enviarMsg();
        }}
        className="flex gap-2 border-t border-border-soft bg-bg p-3"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte algo..."
          className="h-[48px] flex-1 rounded-lg border border-border-soft bg-surface px-3 py-2 text-[14px] text-ink outline-none focus:border-emerald"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="flex items-center justify-center rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-bg disabled:opacity-40 hover:bg-emerald-600"
          aria-label="Enviar"
        >
          →
        </button>
      </form>
    </div>
  );
}
