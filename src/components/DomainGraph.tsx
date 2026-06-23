import { ARESTAS, POSICOES } from "@/data/unidades";
import type { Unidade } from "@/data/unidades";

interface Props {
  unidades: Unidade[];
  selecionada: number | null;
  onSelecionar: (id: number) => void;
}

export function DomainGraph({ unidades, selecionada, onSelecionar }: Props) {
  return (
    <svg viewBox="0 0 300 500" className="w-full" role="img" aria-label="Mapa de conhecimento">
      {ARESTAS.map(([a, b]) => {
        const pa = POSICOES[a], pb = POSICOES[b];
        const ua = unidades.find((u) => u.id === a)!;
        const stroke = ua.status === "dominado" ? "#10B981" : "#334155";
        return <line key={`${a}-${b}`} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke={stroke} strokeWidth={2} strokeDasharray={ua.status === "dominado" ? "0" : "4 4"} />;
      })}
      {unidades.map((u) => {
        const p = POSICOES[u.id];
        const sel = selecionada === u.id;
        let fill = "#334155", stroke = "#475569", txt = "#94A3B8";
        let clickable = false;
        if (u.status === "disponivel") { fill = "#1E3A5F"; stroke = "#3B82F6"; txt = "#F1F5F9"; clickable = true; }
        if (u.status === "dominado") { fill = "#065F46"; stroke = "#10B981"; txt = "#F1F5F9"; clickable = true; }
        return (
          <g
            key={u.id}
            onClick={() => clickable && onSelecionar(u.id)}
            style={{ cursor: clickable ? "pointer" : "not-allowed" }}
          >
            {u.status === "disponivel" && (
              <circle cx={p.x} cy={p.y} r={34} fill="none" stroke={stroke} strokeWidth={2} className="pulse-ring" opacity={0.5} />
            )}
            <circle cx={p.x} cy={p.y} r={28} fill={fill} stroke={sel ? "#F59E0B" : stroke} strokeWidth={sel ? 4 : 3} />
            {u.status === "dominado" ? (
              <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="18" fill="#10B981" fontWeight="700">✓</text>
            ) : (
              <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="14" fill={txt} fontWeight="700" fontFamily="Space Grotesk">{u.id}</text>
            )}
            <text x={p.x} y={p.y + 48} textAnchor="middle" fontSize="10" fill={txt} fontFamily="Inter">{u.titulo}</text>
          </g>
        );
      })}
    </svg>
  );
}
