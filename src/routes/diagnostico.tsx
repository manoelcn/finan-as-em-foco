import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { DIAGNOSTICO } from "@/data/perguntas";
import { DomainGraph } from "@/components/DomainGraph";

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
  const { alunoNome, setAlunoNome, unidades, setProficiencia, setEtapa } = useApp();
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [confirmado, setConfirmado] = useState(false);
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

          <button 
            onClick={() => {
              setEtapa("trilha");
              navigate({ to: "/trilha" });
            }} 
            className="mt-8 w-full shrink-0 rounded-lg bg-emerald px-4 py-3 font-display font-semibold text-bg hover:bg-emerald-600"
          >
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
        setConfirmado(false);
      }
    };

    const responder = (i: number) => {
      if (confirmado) return;
      setEscolha(i);
    };

    const confirmar = () => {
      if (escolha === null) return;
      setConfirmado(true);
      const ok = escolha === q.correta;
      setResultados((r) => ({ ...r, [uc.id]: ok }));
      if (ok) setProficiencia(uc.id, 60);
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
              const isCerta = i === q.correta;
              const isEscolha = i === escolha;
              
              let cls = "border-border-soft hover:border-emerald bg-surface";
              let labelCls = "text-emerald";
              
              if (!confirmado) {
                if (isEscolha) {
                  cls = "border-emerald bg-emerald/5";
                }
              } else {
                if (isCerta) {
                  cls = "border-emerald bg-emerald/15";
                  labelCls = "bg-emerald text-bg border-emerald";
                } else if (isEscolha) {
                  cls = "border-danger bg-danger/10";
                  labelCls = "bg-danger text-bg border-danger";
                } else {
                  cls = "border-border-soft opacity-50";
                }
              }

              return (
                <button
                  key={i}
                  disabled={confirmado}
                  onClick={() => responder(i)}
                  className={`flex w-full items-center gap-4 rounded-lg border-2 px-[20px] py-[18px] text-left transition outline-none focus-visible:ring-2 focus-visible:ring-emerald ${cls}`}
                >
                  <span className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded border border-border-soft bg-bg font-display text-[15px] font-bold shadow-sm transition-colors ${labelCls}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm text-ink">{alt}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback Inline */}
          {confirmado && (
            <div className={`mt-6 rounded-xl border p-4 text-[15px] font-medium animate-fade-in ${acertou ? "border-emerald/30 bg-emerald/15 text-emerald" : "border-danger/30 bg-danger/15 text-danger"}`}>
              {acertou ? `✓ ${q.dica || "Resposta correta! Você já tem uma base nesse tema."}` : `✗ ${escolha !== null && q.feedbacks ? q.feedbacks[escolha] : "Resposta incorreta. Vamos estudar esse tema na trilha."}`}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-4 flex shrink-0 items-center justify-between border-t border-border-soft pt-4">
          {!confirmado ? (
            <>
              <button 
                onClick={pular} 
                className="rounded-lg px-4 py-3 text-sm font-semibold text-ink-mute hover:bg-bg hover:text-ink transition outline-none focus-visible:ring-2 focus-visible:ring-emerald"
              >
                Pular
              </button>
              <button 
                disabled={escolha === null}
                onClick={confirmar} 
                className="rounded-lg bg-emerald px-6 py-3 font-semibold text-bg transition hover:bg-emerald-600 disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-emerald"
              >
                Confirmar resposta
              </button>
            </>
          ) : (
            <button
              onClick={proxima}
              className="ml-auto rounded-lg bg-emerald px-8 py-3 font-semibold text-bg transition hover:bg-emerald-600 outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              {idx + 1 >= unidades.length ? "Ver resultado final →" : "Próxima questão →"}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="h-[calc(100vh-56px)] bg-bg p-3 md:p-4">
      <div className="flex h-full flex-col gap-4 md:flex-row">
        
        {/* Área Central: Interação (Ocupa toda a tela) */}
        <section className="flex w-full flex-col min-h-0 max-w-4xl mx-auto">
          <div className="flex h-full flex-col rounded-2xl border border-border-soft bg-surface p-6 shadow-sm md:p-8 overflow-hidden">
            {renderInteracao()}
          </div>
        </section>


      </div>
    </main>
  );
}
