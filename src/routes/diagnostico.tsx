import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { DIAGNOSTICO } from "@/data/perguntas";
import { DomainGraph } from "@/components/DomainGraph";
import { ChatWidget } from "@/components/ChatWidget";

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
  const [idx, setIdx] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [finalizado, setFinalizado] = useState(false);
  const [resultados, setResultados] = useState<Record<number, boolean>>({});

  const renderInteracao = () => {

    if (finalizado) {
      const dominadas = unidades.filter((u) => resultados[u.id]);
      const estudar = unidades.filter((u) => !resultados[u.id]);
      return (
        <div className="flex h-full flex-col justify-center">
          <h1 className="font-display text-3xl font-bold text-ink">Pronto, {alunoNome}! 🎯</h1>
          <p className="mt-2 text-ink-mute">Aqui está o seu diagnóstico inicial.</p>

          <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
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

          <button onClick={() => navigate({ to: "/trilha" })} className="mt-8 w-full shrink-0 rounded-lg bg-emerald px-4 py-3 font-display font-semibold text-bg hover:bg-emerald-600">
            Iniciar minha trilha →
          </button>
        </div>
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
    };

    const confirmar = () => {
      if (escolha === null) return;
      const ok = escolha === q.correta;
      setResultados((r) => ({ ...r, [uc.id]: ok }));
      if (ok) setProficiencia(uc.id, 60);
      proxima();
    };

    const pular = () => {
      setResultados((r) => ({ ...r, [uc.id]: false }));
      proxima();
    };

    return (
      <div className="flex h-full flex-col">
        {/* Progresso Header */}
        <div className="mb-6 shrink-0">
          <div className="mb-2 text-right text-xs font-medium text-ink-mute">
            Questão {idx + 1} de {unidades.length}
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-bg border border-border-soft">
            <div className="h-full bg-emerald transition-all" style={{ width: `${((idx + 1) / unidades.length) * 100}%` }} />
          </div>
        </div>

        {/* Questão */}
        <div className="flex-1 overflow-y-auto pb-4">
          <div className="inline-block rounded-full border border-border-soft bg-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink-mute">
            Tópico avaliado: {uc.titulo}
          </div>
          <h2 className="mt-4 font-display text-[22px] font-semibold text-ink leading-relaxed">
            {q.pergunta}
          </h2>

          <div className="mt-8 flex flex-col gap-[14px]">
            {q.alternativas.map((alt, i) => {
              const isEscolha = i === escolha;
              let cls = "border-border-soft hover:border-emerald bg-surface";
              let labelCls = "text-emerald";
              
              if (isEscolha) {
                cls = "border-emerald bg-emerald/5";
              }

              return (
                <button
                  key={i}
                  onClick={() => responder(i)}
                  className={`flex w-full items-center gap-4 rounded-lg border-2 px-[20px] py-[18px] text-left transition ${cls}`}
                >
                  <span className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded border border-border-soft bg-bg font-display text-[15px] font-bold shadow-sm ${labelCls}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm text-ink">{alt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-4 flex shrink-0 items-center justify-between border-t border-border-soft pt-4">
          <button 
            onClick={pular} 
            className="rounded-lg px-4 py-3 text-sm font-semibold text-ink-mute hover:bg-bg hover:text-ink transition"
          >
            Pular
          </button>
          <button 
            disabled={escolha === null}
            onClick={confirmar} 
            className="rounded-lg bg-emerald px-6 py-3 font-semibold text-bg transition hover:bg-emerald-600 disabled:opacity-50"
          >
            Confirmar resposta
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="h-[calc(100vh-56px)] bg-bg p-3 md:p-4">
      <div className="flex h-full flex-col gap-4 md:flex-row">
        
        {/* Esquerda: Interação */}
        <section className="flex w-full flex-col order-2 md:order-1 md:w-[55%] min-h-0">
          <div className="flex h-full flex-col rounded-2xl border border-border-soft bg-surface p-6 shadow-sm md:p-8 overflow-hidden">
            {renderInteracao()}
          </div>
        </section>

        {/* Direita: Grafo + Chat */}
        <section className="flex w-full flex-col gap-4 order-1 md:order-2 md:w-[45%] min-h-0">
          <div className="flex-none rounded-2xl border border-border-soft bg-surface p-[20px] shadow-sm">
            <h2 className="font-display text-lg font-semibold text-ink">Mapa de Conhecimento</h2>
            <div className="mt-2">
              <DomainGraph unidades={unidades} selecionada={null} onSelecionar={() => {}} />
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
