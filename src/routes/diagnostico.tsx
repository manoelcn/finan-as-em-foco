import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { DIAGNOSTICO } from "@/data/perguntas";

export const Route = createFileRoute("/diagnostico")({
  head: () => ({
    meta: [
      { title: "Diagnóstico — Finanças em Foco" },
      { name: "description", content: "Diagnóstico inicial para personalizar sua trilha." },
    ],
  }),
  component: Diagnostico,
});

function Diagnostico() {
  const { alunoNome, setAlunoNome, unidades, setProficiencia } = useApp();
  const navigate = useNavigate();
  const [nomeInput, setNomeInput] = useState("");
  const [nomeOk, setNomeOk] = useState(!!alunoNome);
  const [idx, setIdx] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [finalizado, setFinalizado] = useState(false);
  const [resultados, setResultados] = useState<Record<number, boolean>>({});

  if (!nomeOk) {
    return (
      <Shell>
        <Card>
          <h1 className="font-display text-3xl font-bold text-ink">Olá! Como você se chama?</h1>
          <p className="mt-2 text-ink-mute">Vamos personalizar sua trilha de aprendizado.</p>
          <input
            value={nomeInput}
            onChange={(e) => setNomeInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && nomeInput.trim()) { setAlunoNome(nomeInput.trim()); setNomeOk(true); } }}
            placeholder="Seu nome"
            className="mt-6 w-full rounded-lg border border-border-soft bg-bg px-4 py-3 text-ink outline-none focus:border-emerald"
            autoFocus
          />
          <button
            disabled={!nomeInput.trim()}
            onClick={() => { setAlunoNome(nomeInput.trim()); setNomeOk(true); }}
            className="mt-4 w-full rounded-lg bg-emerald px-4 py-3 font-semibold text-bg disabled:opacity-40 hover:bg-emerald-600"
          >
            Confirmar
          </button>
        </Card>
      </Shell>
    );
  }

  if (finalizado) {
    const dominadas = unidades.filter((u) => resultados[u.id]);
    const estudar = unidades.filter((u) => !resultados[u.id]);
    return (
      <Shell>
        <Card>
          <h1 className="font-display text-3xl font-bold text-ink">Pronto, {alunoNome}! 🎯</h1>
          <p className="mt-2 text-ink-mute">Aqui está o seu diagnóstico inicial.</p>

          <div className="mt-6 space-y-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald">✓ Você já domina ({dominadas.length})</h2>
              <ul className="mt-2 space-y-1">
                {dominadas.length === 0 && <li className="text-sm text-ink-mute">Nenhum módulo ainda — vamos aprender juntos!</li>}
                {dominadas.map((u) => (<li key={u.id} className="rounded-md bg-emerald/10 px-3 py-2 text-sm text-ink">{u.id}. {u.titulo}</li>))}
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-amber">📘 Vamos estudar ({estudar.length})</h2>
              <ul className="mt-2 space-y-1">
                {estudar.map((u) => (<li key={u.id} className="rounded-md bg-amber/10 px-3 py-2 text-sm text-ink">{u.id}. {u.titulo}</li>))}
              </ul>
            </div>
          </div>

          <button onClick={() => navigate({ to: "/trilha" })} className="mt-8 w-full rounded-lg bg-emerald px-4 py-3 font-display font-semibold text-bg hover:bg-emerald-600">
            Iniciar minha trilha →
          </button>
        </Card>
      </Shell>
    );
  }

  const uc = unidades[idx];
  const q = DIAGNOSTICO[uc.id];
  const respondeu = escolha !== null;
  const acertou = respondeu && escolha === q.correta;

  const proxima = () => {
    if (idx + 1 >= unidades.length) {
      setFinalizado(true);
    } else {
      setIdx(idx + 1);
      setEscolha(null);
    }
  };

  const responder = (i: number) => {
    if (respondeu) return;
    setEscolha(i);
    const ok = i === q.correta;
    setResultados((r) => ({ ...r, [uc.id]: ok }));
    if (ok) setProficiencia(uc.id, 60);
  };

  return (
    <Shell>
      <div className="mb-6 w-full max-w-[600px]">
        <div className="mb-2 flex justify-between text-xs font-medium text-ink-mute">
          <span>Pergunta {idx + 1} de {unidades.length}</span>
          <span>{Math.round(((idx + 1) / unidades.length) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface">
          <div className="h-full bg-emerald transition-all" style={{ width: `${((idx + 1) / unidades.length) * 100}%` }} />
        </div>
      </div>

      <Card>
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald">Módulo {uc.id} · {uc.titulo}</div>
        <h2 className="mt-3 font-display text-xl font-semibold text-ink">{q.pergunta}</h2>

        <div className="mt-6 space-y-3">
          {q.alternativas.map((alt, i) => {
            const isCerta = i === q.correta;
            const isEscolha = i === escolha;
            let cls = "border-border-soft hover:border-emerald text-ink";
            if (respondeu) {
              if (isCerta) cls = "border-emerald bg-emerald/15 text-ink";
              else if (isEscolha) cls = "border-danger bg-danger/10 text-ink";
              else cls = "border-border-soft text-ink-mute opacity-60";
            }
            return (
              <button
                key={i}
                disabled={respondeu}
                onClick={() => responder(i)}
                className={`flex w-full items-center gap-3 rounded-lg border-2 px-4 py-3 text-left transition ${cls}`}
              >
                <span className="font-display text-sm font-bold text-emerald">{String.fromCharCode(65 + i)}</span>
                <span className="text-sm">{alt}</span>
              </button>
            );
          })}
        </div>

        {respondeu && (
          <div className={`mt-5 rounded-lg p-3 text-sm font-medium ${acertou ? "bg-emerald/15 text-emerald" : "bg-danger/15 text-danger"}`}>
            {acertou ? "✓ Boa! Você já tem uma base nesse tema — vamos confirmar na trilha." : "✗ Vamos estudar esse tema juntos."}
          </div>
        )}

        {respondeu && (
          <button onClick={proxima} className="mt-5 w-full rounded-lg bg-emerald px-4 py-3 font-semibold text-bg hover:bg-emerald-600">
            {idx + 1 >= unidades.length ? "Ver resumo" : "Próxima pergunta →"}
          </button>
        )}
      </Card>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 py-12">{children}</main>;
}
function Card({ children }: { children: React.ReactNode }) {
  return <div className="w-full max-w-[600px] rounded-2xl border border-border-soft bg-surface p-8 shadow-xl">{children}</div>;
}
