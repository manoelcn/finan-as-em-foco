import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppProvider, useApp } from "@/context/AppContext";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-ink">404</h1>
        <p className="mt-2 text-sm text-ink-mute">A página que você procura não existe.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-emerald px-4 py-2 text-sm font-semibold text-bg hover:bg-emerald-600">
            Ir para o início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-ink">Algo deu errado</h1>
        <p className="mt-2 text-sm text-ink-mute">Tente novamente em instantes.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-md bg-emerald px-4 py-2 text-sm font-semibold text-bg">Tentar novamente</button>
          <a href="/" className="rounded-md border border-border-soft px-4 py-2 text-sm text-ink">Início</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Finanças em Foco — Tutoria de Matemática Financeira" },
      { name: "description", content: "Sistema de Tutoria Inteligente em Matemática Financeira para estudantes do ensino médio." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function GlobalHeader() {
  const { unidades, resetar } = useApp();
  const progresso = Math.round(unidades.reduce((s, u) => s + u.proficiencia, 0) / unidades.length);
  
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border-soft bg-surface px-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-xl">📊</span>
        <div>
          <h1 className="font-display text-sm font-bold text-ink leading-tight">Finanças em Foco</h1>
          <p className="text-[10px] text-ink-mute uppercase tracking-wider">Tutoria adaptativa com IA</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-ink-mute">Progresso global</div>
          <div className="font-display text-sm font-bold text-emerald">{progresso}%</div>
        </div>
        <button 
          onClick={() => {
            if (confirm("Deseja realmente reiniciar todo o seu progresso?")) {
              resetar();
            }
          }}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border-soft text-ink-mute hover:bg-bg hover:text-ink transition-colors"
          title="Reiniciar Progresso"
        >
          ⟳
        </button>
      </div>
    </header>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <GlobalHeader />
        <Outlet />
      </AppProvider>
    </QueryClientProvider>
  );
}
