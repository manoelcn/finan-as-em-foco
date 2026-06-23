import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { EXERCICIOS } from "@/data/perguntas";
import type { Unidade } from "@/data/unidades";

export function Exercise({ unidade, onVoltar }: { unidade: Unidade; onVoltar: () => void }) {
  const { atualizarProficiencia, unidades } = useApp();
  const banco = EXERCICIOS[unidade.id];
  const [qIdx] = useState(() => Math.floor(Math.random() * banco.length));
  const q = banco[qIdx];

  const [tentativa, setTentativa] = useState(1);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [pediuDica, setPediuDica] = useState(false);
  const [mostrarDica, setMostrarDica] = useState(false);
  const [feedback, setFeedback] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const respondeu = escolha !== null && feedback?.tipo === "ok";

  const ucAtual = useMemo(() => unidades.find((u) => u.id === unidade.id)!, [unidades, unidade.id]);

  const responder = (i: number) => {
    if (respondeu) return;
    setEscolha(i);
    if (i === q.correta) {
      const delta = pediuDica ? 15 : tentativa === 1 ? 25 : 15;
      const antes = ucAtual.proficiencia;
      atualizarProficiencia(unidade.id, delta);
      setFeedback({ tipo: "ok", texto: `🎉 Correto! +${delta} pontos` });
      const novo = Math.min(100, antes + delta);
      if (antes < 80 && novo >= 80) {
        setToast("🏆 Módulo Dominado! Novos módulos desbloqueados.");
        setTimeout(() => setToast(null), 3500);
      }
    } else {
      atualizarProficiencia(unidade.id, -10);
      setFeedback({ tipo: "erro", texto: "Tente novamente! -10 pontos" });
      setTimeout(() => {
        setEscolha(null);
        setFeedback(null);
        setTentativa((t) => t + 1);
      }, 1500);
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
        <button onClick={onVoltar} className="text-sm text-ink-mute hover:text-ink">← Voltar ao conteúdo</button>
        <span className="rounded-full bg-bg px-3 py-1 text-xs font-medium text-ink-mute">Tentativa {tentativa}</span>
      </div>

      <h2 className="mt-4 font-display text-2xl font-bold text-ink">Exercício — {unidade.titulo}</h2>
      <p className="mt-4 text-ink">{q.pergunta}</p>

      <div className="mt-5 space-y-3">
        {q.alternativas.map((alt, i) => {
          const ans = escolha === i;
          let cls = "border-border-soft hover:border-emerald text-ink";
          if (ans && feedback?.tipo === "ok") cls = "border-emerald bg-emerald/20 text-ink";
          else if (ans && feedback?.tipo === "erro") cls = "border-danger bg-danger/15 text-ink";
          else if (respondeu && i === q.correta) cls = "border-emerald bg-emerald/10 text-ink";
          return (
            <button
              key={i}
              disabled={respondeu || feedback?.tipo === "erro"}
              onClick={() => responder(i)}
              className={`flex w-full items-center gap-3 rounded-lg border-2 px-4 py-3 text-left transition ${cls}`}
            >
              <span className="font-display text-sm font-bold text-emerald">{String.fromCharCode(65 + i)}</span>
              <span className="flex-1 text-sm">{alt}</span>
              {ans && feedback?.tipo === "ok" && <span className="text-emerald">✓</span>}
              {ans && feedback?.tipo === "erro" && <span className="text-danger">✗</span>}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={`mt-4 rounded-lg p-3 text-sm font-medium ${feedback.tipo === "ok" ? "bg-emerald/15 text-emerald" : "bg-danger/15 text-danger"}`}>
          {feedback.texto}
        </div>
      )}

      {!respondeu && !mostrarDica && q.dica && (
        <button
          onClick={() => { setMostrarDica(true); setPediuDica(true); }}
          className="mt-4 rounded-lg border border-amber/50 bg-amber/10 px-4 py-2 text-sm font-medium text-amber hover:bg-amber/20"
        >
          💡 Pedir dica
        </button>
      )}
      {mostrarDica && q.dica && (
        <div className="mt-4 rounded-lg border border-amber/40 bg-amber/10 p-3 text-sm text-ink">
          <span className="font-semibold text-amber">Dica:</span> {q.dica}
        </div>
      )}

      {respondeu && (
        <button onClick={onVoltar} className="mt-6 w-full rounded-lg bg-emerald px-4 py-3 font-semibold text-bg hover:bg-emerald-600">
          Continuar
        </button>
      )}
    </div>
  );
}
