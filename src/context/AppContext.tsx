import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { UNIDADES, type Unidade } from "@/data/unidades";

type Etapa = "diagnostico" | "trilha";

interface AppCtx {
  unidades: Unidade[];
  alunoNome: string;
  setAlunoNome: (n: string) => void;
  etapa: Etapa;
  setEtapa: (e: Etapa) => void;
  atualizarProficiencia: (id: number, delta: number) => void;
  setProficiencia: (id: number, valor: number) => void;
  desbloquearDependentes: (idDominado: number) => void;
  resetar: () => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [unidades, setUnidades] = useState<Unidade[]>(() => UNIDADES.map((u) => ({ ...u })));
  const [alunoNome, setAlunoNome] = useState("");
  const [etapa, setEtapa] = useState<Etapa>("diagnostico");

  const recomputarStatus = useCallback((arr: Unidade[]): Unidade[] => {
    return arr.map((u) => {
      if (u.status === "dominado") return u;
      const prereqOk = u.prerequisitos.every((pid) => arr.find((x) => x.id === pid)?.status === "dominado");
      const baseDisponivel = u.prerequisitos.length === 0 || prereqOk;
      return { ...u, status: baseDisponivel ? "disponivel" : "bloqueado" };
    });
  }, []);

  const setProficiencia = useCallback((id: number, valor: number) => {
    setUnidades((prev) => {
      const next = prev.map((u) => {
        if (u.id !== id) return u;
        const v = Math.max(0, Math.min(100, valor));
        const status: Unidade["status"] = v >= 80 ? "dominado" : u.status === "dominado" ? "dominado" : u.status;
        return { ...u, proficiencia: v, status };
      });
      return recomputarStatus(next);
    });
  }, [recomputarStatus]);

  const atualizarProficiencia = useCallback((id: number, delta: number) => {
    setUnidades((prev) => {
      const next = prev.map((u) => {
        if (u.id !== id) return u;
        const v = Math.max(0, Math.min(100, u.proficiencia + delta));
        const status: Unidade["status"] = v >= 80 ? "dominado" : u.status === "dominado" ? "dominado" : u.status;
        return { ...u, proficiencia: v, status };
      });
      return recomputarStatus(next);
    });
  }, [recomputarStatus]);

  const desbloquearDependentes = useCallback((_idDominado: number) => {
    setUnidades((prev) => recomputarStatus(prev));
  }, [recomputarStatus]);

  const resetar = useCallback(() => {
    setUnidades(UNIDADES.map((u) => ({ ...u })));
    setAlunoNome("");
    setEtapa("diagnostico");
  }, []);

  const value = useMemo<AppCtx>(() => ({
    unidades, alunoNome, setAlunoNome, etapa, setEtapa,
    atualizarProficiencia, setProficiencia, desbloquearDependentes, resetar,
  }), [unidades, alunoNome, etapa, atualizarProficiencia, setProficiencia, desbloquearDependentes, resetar]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used within AppProvider");
  return v;
}
