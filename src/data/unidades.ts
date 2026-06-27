export type Status = "bloqueado" | "disponivel" | "dominado";

export interface Unidade {
  id: number;
  titulo: string;
  descricao: string;
  prerequisitos: number[];
  proficiencia: number;
  status: Status;
}

export const UNIDADES: Unidade[] = [
  { id: 1, titulo: "Necessidade vs. Desejo", descricao: "Necessidade é algo essencial para sobreviver ou funcionar bem, como alimentação e moradia. Desejo é o que queremos, mas podemos viver sem. Reconhecer essa diferença é o primeiro passo para uma vida financeira saudável.", prerequisitos: [], proficiencia: 0, status: "disponivel" },
  { id: 2, titulo: "Orçamento Pessoal", descricao: "Orçamento é a lista de tudo que você recebe (receitas) e tudo que você gasta (despesas). Saldo = Receitas − Despesas. Saber para onde vai seu dinheiro é fundamental para tomar decisões conscientes.", prerequisitos: [1], proficiencia: 0, status: "bloqueado" },
  { id: 3, titulo: "Porcentagem", descricao: "Porcentagem significa 'por cento', ou seja, a parte de cada 100. Para calcular X% de um valor: multiplique o valor por X e divida por 100. Desconto de 15% em R$200 = R$200 × 0,15 = R$30 → você paga R$170.", prerequisitos: [1], proficiencia: 0, status: "bloqueado" },
  { id: 4, titulo: "Juros Simples", descricao: "Juros Simples: J = C × i × t. C = capital inicial, i = taxa de juros, t = tempo. Se você toma R$1.000 a 3% ao mês por 4 meses: J = 1000 × 0,03 × 4 = R$120.", prerequisitos: [2, 3], proficiencia: 0, status: "bloqueado" },
  { id: 5, titulo: "Juros Compostos", descricao: "Juros Compostos: M = C × (1 + i)^t. Os juros incidem sobre o montante total (capital + juros anteriores). R$1.000 a 5% ao mês por 2 meses: M = 1000 × (1,05)² = R$1.102,50.", prerequisitos: [4], proficiencia: 0, status: "bloqueado" },
  { id: 6, titulo: "Cartão de Crédito", descricao: "O cartão de crédito tem limite, fatura e vencimento. Se você paga menos que o total da fatura, o saldo restante entra no crédito rotativo com juros altíssimos (pode passar de 300% ao ano). Nunca pague só o mínimo!", prerequisitos: [4], proficiencia: 0, status: "bloqueado" },
  { id: 7, titulo: "Poupança e Metas", descricao: "Para atingir uma meta financeira: defina o valor e o prazo. Valor mensal = Meta ÷ Meses. Exemplo: juntar R$2.400 em 12 meses = R$200/mês. Com juros compostos, o valor mensal necessário é menor.", prerequisitos: [5, 6], proficiencia: 0, status: "bloqueado" },
];

export const POSICOES: Record<number, { x: number; y: number }> = {
  1: { x: 300, y: 50 },
  2: { x: 150, y: 150 },
  3: { x: 450, y: 150 },
  4: { x: 300, y: 250 },
  5: { x: 150, y: 350 },
  6: { x: 450, y: 350 },
  7: { x: 300, y: 450 },
};

export const ARESTAS: Array<[number, number]> = [
  [1, 2], [1, 3], [2, 4], [3, 4], [4, 5], [4, 6], [5, 7], [6, 7],
];
