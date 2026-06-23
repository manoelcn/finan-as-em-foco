import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Finanças em Foco — Aprenda Matemática Financeira" },
      { name: "description", content: "Tutor com IA, 7 módulos práticos e trilha adaptativa para você dominar matemática financeira." },
      { property: "og:title", content: "Finanças em Foco" },
      { property: "og:description", content: "Aprenda Matemática Financeira do jeito certo." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="min-h-screen" style={{ background: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)" }}>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface/60 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-emerald">
          <span className="h-2 w-2 rounded-full bg-emerald" /> ITS · Tutoria Inteligente
        </span>

        <h1 className="font-display text-5xl font-bold text-ink md:text-7xl">
          Finanças <span className="text-emerald">em Foco</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-ink-mute md:text-xl">
          Aprenda Matemática Financeira do jeito certo — no seu ritmo, com um tutor com IA.
        </p>

        <Link
          to="/diagnostico"
          className="mt-10 inline-flex items-center gap-2 rounded-xl bg-emerald px-8 py-4 font-display text-lg font-semibold text-bg shadow-lg shadow-emerald/20 transition hover:bg-emerald-600 hover:shadow-xl"
        >
          Começar agora →
        </Link>

        <div className="mt-20 grid w-full max-w-4xl grid-cols-1 gap-5 md:grid-cols-3">
          {[
            { icone: "📚", titulo: "7 módulos práticos", texto: "De orçamento pessoal a juros compostos." },
            { icone: "⏱️", titulo: "Aprenda no seu ritmo", texto: "Trilha adaptativa que evolui com você." },
            { icone: "🤖", titulo: "Tutor com IA", texto: "Prof. Fina, sua tutora 24/7." },
          ].map((b) => (
            <div key={b.titulo} className="rounded-2xl border border-border-soft bg-surface/70 p-6 text-left backdrop-blur transition hover:border-emerald/50">
              <div className="text-3xl">{b.icone}</div>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink">{b.titulo}</h3>
              <p className="mt-1 text-sm text-ink-mute">{b.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
