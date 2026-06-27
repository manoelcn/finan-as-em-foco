import { ARESTAS } from "@/data/unidades";
import type { Unidade } from "@/data/unidades";

interface Props {
  unidades: Unidade[];
  selecionada: number | null;
  onSelecionar: (id: number) => void;
}

// Posições dos nós no viewBox 900×200 (coordenadas do CENTRO de cada card)
const POSITIONS: Record<number, { x: number; y: number }> = {
  1: { x: 80,  y: 100 },
  2: { x: 240, y: 60 },
  3: { x: 240, y: 140 },
  4: { x: 420, y: 100 },
  5: { x: 620, y: 60 },
  6: { x: 620, y: 140 },
  7: { x: 800, y: 100 },
};

const CARD_W = 140;
const CARD_H = 52;
const CARD_RX = 8;
const BAR_W = 110;
const BAR_H = 3;

export function DomainGraph({ unidades, selecionada, onSelecionar }: Props) {
  return (
    <div className="w-full" style={{ height: 220, overflow: "hidden" }}>
      <svg
        viewBox="0 0 900 200"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Mapa de conhecimento"
      >
        {/* Arrow marker definitions */}
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#475569" />
          </marker>
          <marker id="arrow-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#10B981" />
          </marker>
        </defs>

        {/* Bezier connections */}
        {ARESTAS.map(([a, b]) => {
          const pa = POSITIONS[a];
          const pb = POSITIONS[b];
          const ua = unidades.find((u) => u.id === a)!;
          const isDominado = ua.status === "dominado";
          const stroke = isDominado ? "#10B981" : "#334155";
          const marker = isDominado ? "url(#arrow-green)" : "url(#arrow)";

          // Exit right edge of A, enter left edge of B
          const x1 = pa.x + CARD_W / 2;
          const y1 = pa.y;
          const x2 = pb.x - CARD_W / 2;
          const y2 = pb.y;
          const cpx1 = x1 + 40;
          const cpx2 = x2 - 40;

          return (
            <path
              key={`${a}-${b}`}
              d={`M ${x1} ${y1} C ${cpx1} ${y1}, ${cpx2} ${y2}, ${x2} ${y2}`}
              fill="none"
              stroke={stroke}
              strokeWidth={1.5}
              strokeDasharray={isDominado ? "0" : "5 4"}
              markerEnd={marker}
            />
          );
        })}

        {/* Node cards */}
        {unidades.map((u) => {
          const pos = POSITIONS[u.id];
          if (!pos) return null;

          const sel = selecionada === u.id;
          let fill = "#334155";
          let stroke = "#475569";
          let txt = "#94A3B8";
          let barColor = "#475569";
          let clickable = false;

          if (u.status === "disponivel") {
            fill = "#1E3A5F"; stroke = "#3B82F6"; txt = "#F1F5F9"; barColor = "#3B82F6"; clickable = true;
          }
          if (u.status === "dominado") {
            fill = "#065F46"; stroke = "#10B981"; txt = "#F1F5F9"; barColor = "#10B981"; clickable = true;
          }

          // Card position (top-left corner from center)
          const cx = pos.x - CARD_W / 2;
          const cy = pos.y - CARD_H / 2;

          // Progress bar position inside card
          const barX = pos.x - BAR_W / 2;
          const barY = cy + CARD_H - 10;
          const barFillW = (BAR_W * u.proficiencia) / 100;

          return (
            <g
              key={u.id}
              onClick={() => clickable && onSelecionar(u.id)}
              style={{ cursor: clickable ? "pointer" : "not-allowed" }}
            >
              {/* Pulse ring for available nodes */}
              {u.status === "disponivel" && (
                <rect
                  x={cx - 3} y={cy - 3}
                  width={CARD_W + 6} height={CARD_H + 6}
                  rx={CARD_RX + 2}
                  fill="none" stroke={stroke} strokeWidth={1.5}
                  className="pulse-ring" opacity={0.4}
                />
              )}

              {/* Card background */}
              <rect
                x={cx} y={cy}
                width={CARD_W} height={CARD_H}
                rx={CARD_RX}
                fill={fill}
                stroke={sel ? "#F59E0B" : stroke}
                strokeWidth={sel ? 2.5 : 1.5}
              />

              {/* Line 1: UC name */}
              <text
                x={pos.x} y={cy + 18}
                textAnchor="middle"
                fontSize="11" fontWeight="bold" fill={txt} fontFamily="Inter, sans-serif"
              >
                {u.titulo.length > 18 ? u.titulo.substring(0, 16) + "…" : u.titulo}
              </text>

              {/* Line 2: percentage */}
              <text
                x={pos.x} y={cy + 31}
                textAnchor="middle"
                fontSize="10" fill={txt} opacity={0.65} fontFamily="Inter, sans-serif"
              >
                {u.proficiencia}%
              </text>

              {/* Line 3: progress bar track */}
              <rect x={barX} y={barY} width={BAR_W} height={BAR_H} rx={2} fill={txt} opacity={0.15} />
              {u.proficiencia > 0 && (
                <rect x={barX} y={barY} width={barFillW} height={BAR_H} rx={2} fill={barColor} />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
