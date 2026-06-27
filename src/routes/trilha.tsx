import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { DomainGraph } from "@/components/DomainGraph";
import { Exercise } from "@/components/Exercise";
import { ChatWidget } from "@/components/ChatWidget";

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
  const { unidades, alunoNome, etapa } = useApp();
  const [selId, setSelId] = useState<number | null>(null);
  const [modo, setModo] = useState<"conteudo" | "exercicio">("conteudo");
  const [fechouModalFinal, setFechouModalFinal] = useState(false);

  if (etapa === "diagnostico") {
    return <Navigate to="/diagnostico" />;
  }

  const sel = unidades.find((u) => u.id === selId) || null;

  const selecionar = (id: number) => {
    setSelId(id);
    setModo("conteudo");
  };

  const todosDominados = unidades.length > 0 && unidades.every(u => u.status === "dominado");
  const mostrarModalFinal = todosDominados && !fechouModalFinal;

  return (
    <main className="h-[calc(100vh-56px)] bg-bg p-3 md:p-4">
      {mostrarModalFinal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="max-w-md w-full bg-surface border border-border-soft rounded-2xl shadow-2xl p-8 text-center">
            <div className="text-6xl mb-6">🎓</div>
            <h2 className="font-display text-2xl font-bold text-ink mb-3">Parabéns! Trilha Concluída</h2>
            <p className="text-ink-mute mb-8 leading-relaxed text-sm">
              Você agora possui uma excelente base de matemática financeira! 
              Você já tem conhecimento suficiente para se aprofundar em conteúdos mais complexos sobre o mundo das finanças.
              <br /><br />
              Lembre-se: a Prof. Fina estará sempre disponível no chat caso precise de ajuda ou queira tirar dúvidas sobre novos assuntos!
            </p>
            <button 
              onClick={() => setFechouModalFinal(true)}
              className="w-full bg-emerald hover:bg-emerald-600 text-bg font-bold py-3 px-4 rounded-xl transition outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              Continuar explorando
            </button>
          </div>
        </div>
      )}

      <div className="flex h-full flex-col gap-4 md:flex-row">
        
        {/* Esquerda: Interação */}
        <section className="flex w-full flex-col order-2 md:order-1 md:w-[55%] min-h-0">
          <div className="flex h-full flex-col overflow-y-auto rounded-2xl border border-border-soft bg-surface p-6 shadow-sm md:p-8">
            {!sel && (
              <div className="flex h-full flex-col items-center justify-center text-center text-ink-mute">
                <div className="text-5xl">🗺️</div>
                <p className="mt-3">Selecione um módulo no mapa ao lado para começar</p>
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

                {sel.status === "disponivel" ? (
                  <button
                    onClick={() => setModo("exercicio")}
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald px-5 py-3 font-semibold text-bg hover:bg-emerald-600 transition outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                  >
                    Praticar agora →
                  </button>
                ) : sel.status === "dominado" ? (
                  <button
                    disabled
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald/10 px-5 py-3 font-semibold text-emerald cursor-not-allowed border border-emerald/20"
                  >
                    ✓ Módulo Concluído
                  </button>
                ) : (
                  <button
                    disabled
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-surface px-5 py-3 font-semibold text-ink-mute cursor-not-allowed border border-border-soft"
                  >
                    🔒 Módulo Bloqueado
                  </button>
                )}
              </div>
            )}

            {sel && modo === "exercicio" && (
              <Exercise unidade={sel} onVoltar={() => setModo("conteudo")} />
            )}
          </div>
        </section>

        {/* Direita: Grafo + Chat */}
        <section className="flex w-full flex-col gap-4 order-1 md:order-2 md:w-[45%] min-h-0">
          <div className="flex-none rounded-2xl border border-border-soft bg-surface p-[20px] shadow-sm">
            <h2 className="font-display text-lg font-semibold text-ink">Mapa de Conhecimento</h2>
            <div className="mt-2">
              <DomainGraph unidades={unidades} selecionada={selId} onSelecionar={selecionar} />
            </div>
            <div className="mt-[12px] flex flex-wrap gap-4 text-[13px] text-ink-mute border-t border-border-soft pt-3 justify-center">
              <span className="inline-flex items-center gap-2"><span className="h-[10px] w-[10px] rounded-full" style={{ background: "#3B82F6" }} />Disponível</span>
              <span className="inline-flex items-center gap-2"><span className="h-[10px] w-[10px] rounded-full" style={{ background: "#10B981" }} />Dominado</span>
              <span className="inline-flex items-center gap-2"><span className="h-[10px] w-[10px] rounded-full" style={{ background: "#475569" }} />Bloqueado</span>
            </div>
          </div>
          
          <div className="flex flex-1 flex-col min-h-0">
             <ChatWidget />
          </div>
        </section>
        
      </div>
    </main>
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
      <div className="h-2 overflow-hidden rounded-full bg-bg border border-border-soft">
        <div className="h-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}
