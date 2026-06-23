import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { DomainGraph } from "@/components/DomainGraph";
import { Exercise } from "@/components/Exercise";

export const Route = createFileRoute("/trilha")({
  head: () => ({
    meta: [
      { title: "Trilha — Finanças em Foco" },
      { name: "description", content: "Sua trilha personalizada de Matemática Financeira." },
    ],
  }),
  component: Trilha,
});

function Trilha() {
  const { unidades, alunoNome } = useApp();
  const [selId, setSelId] = useState<number | null>(null);
  const [modo, setModo] = useState<"conteudo" | "exercicio">("conteudo");

  const sel = unidades.find((u) => u.id === selId) || null;

  const selecionar = (id: number) => {
    setSelId(id);
    setModo("conteudo");
  };

  return (
    <main className="min-h-screen bg-bg px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">Sua trilha</h1>
            <p className="text-sm text-ink-mute">{alunoNome ? `Olá, ${alunoNome}!` : "Vamos aprender juntos."}</p>
          </div>
          <div className="hidden text-right md:block">
            <div className="text-xs uppercase tracking-wider text-ink-mute">Progresso geral</div>
            <div className="font-display text-2xl font-bold text-emerald">
              {Math.round(unidades.reduce((s, u) => s + u.proficiencia, 0) / unidades.length)}%
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_3fr]">
          {/* Esquerda — grafo */}
          <section className="rounded-2xl border border-border-soft bg-surface p-5">
            <h2 className="font-display text-lg font-semibold text-ink">Mapa de Conhecimento</h2>
            <p className="mt-1 text-xs text-ink-mute">Clique em um módulo desbloqueado para começar.</p>
            <div className="mt-4">
              <DomainGraph unidades={unidades} selecionada={selId} onSelecionar={selecionar} />
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-mute">
              <Legend color="#3B82F6" label="Disponível" />
              <Legend color="#10B981" label="Dominado" />
              <Legend color="#475569" label="Bloqueado" />
            </div>
          </section>

          {/* Direita — conteúdo */}
          <section className="rounded-2xl border border-border-soft bg-surface p-6">
            {!sel && (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center text-ink-mute">
                <div className="text-5xl">🗺️</div>
                <p className="mt-3">Selecione um módulo no mapa para começar</p>
              </div>
            )}

            {sel && modo === "conteudo" && (
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-emerald">Módulo {sel.id}</div>
                    <h2 className="font-display text-2xl font-bold text-ink">{sel.titulo}</h2>
                  </div>
                  <StatusBadge status={sel.status} />
                </div>

                <ProficiencyBar value={sel.proficiencia} />

                <p className="mt-6 leading-relaxed text-ink">{sel.descricao}</p>

                <button
                  onClick={() => setModo("exercicio")}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald px-5 py-3 font-semibold text-bg hover:bg-emerald-600"
                >
                  Praticar agora →
                </button>
              </div>
            )}

            {sel && modo === "exercicio" && (
              <Exercise unidade={sel} onVoltar={() => setModo("conteudo")} />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-3 w-3 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { c: string; t: string }> = {
    disponivel: { c: "bg-blue-500/15 text-blue-400 border-blue-500/30", t: "Disponível" },
    dominado: { c: "bg-emerald/15 text-emerald border-emerald/40", t: "Dominado" },
    bloqueado: { c: "bg-slate-500/15 text-slate-400 border-slate-500/30", t: "Bloqueado" },
  };
  const m = map[status] ?? map.disponivel;
  return <span className={`rounded-full border px-3 py-1 text-xs font-medium ${m.c}`}>{m.t}</span>;
}

function ProficiencyBar({ value }: { value: number }) {
  const color = value >= 80 ? "#10B981" : value >= 50 ? "#F59E0B" : "#EF4444";
  return (
    <div className="mt-4">
      <div className="mb-1 flex justify-between text-xs text-ink-mute">
        <span>Proficiência</span>
        <span style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-bg">
        <div className="h-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}
