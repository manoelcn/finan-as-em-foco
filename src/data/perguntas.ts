export interface Questao {
  pergunta: string;
  alternativas: string[];
  correta: number; // index
  dica?: string;
}

export const DIAGNOSTICO: Record<number, Questao> = {
  1: { pergunta: "João quer comprar um tênis novo de R$300, mas já tem um par em bom estado. Esse gasto é:", alternativas: ["Uma necessidade básica", "Um desejo, pois o atual ainda atende à função", "Um investimento", "Uma despesa fixa"], correta: 1 },
  2: { pergunta: "Maria recebe R$1.200/mês e gasta R$400 em aluguel, R$300 em alimentação e R$150 em transporte. Qual é o saldo disponível?", alternativas: ["R$250", "R$350", "R$450", "R$500"], correta: 1 },
  3: { pergunta: "Um produto custa R$80 e está com 15% de desconto. Qual o valor a pagar?", alternativas: ["R$65", "R$68", "R$72", "R$75"], correta: 1 },
  4: { pergunta: "Empréstimo de R$1.000 a 2% ao mês por 3 meses. Qual o valor dos juros?", alternativas: ["R$20", "R$40", "R$60", "R$80"], correta: 2 },
  5: { pergunta: "R$500 aplicados a 10% ao mês por 2 meses com juros compostos. Qual o montante?", alternativas: ["R$595", "R$600", "R$605", "R$610"], correta: 2 },
  6: { pergunta: "Ana gastou R$1.000 no crédito e pagou apenas R$200 da fatura. Sobre o que incidirão os juros rotativos?", alternativas: ["Sobre os R$200 pagos", "Sobre os R$800 restantes", "Sobre os R$1.000 totais", "Não há juros se pagar o mínimo"], correta: 1 },
  7: { pergunta: "Pedro quer juntar R$1.200 em 6 meses. Quanto ele deve guardar por mês (sem juros)?", alternativas: ["R$150", "R$175", "R$200", "R$250"], correta: 2 },
};

export const EXERCICIOS: Record<number, Questao[]> = {
  1: [
    { pergunta: "Comprar um celular novo sendo que o atual funciona bem é um exemplo de:", alternativas: ["Necessidade", "Desejo", "Investimento", "Despesa fixa"], correta: 1, dica: "Pense: você consegue viver sem ele agora?" },
    { pergunta: "Qual dessas é uma NECESSIDADE?", alternativas: ["Streaming de música", "Academia", "Remédio prescrito", "Tênis de marca"], correta: 2, dica: "Necessidade está ligada à saúde, segurança e sobrevivência." },
    { pergunta: "Ana separa 20% da renda antes de gastar. Essa atitude reflete:", alternativas: ["Desejo", "Impulso", "Planejamento consciente", "Desperdício"], correta: 2, dica: "Guardar dinheiro antes de gastar é um hábito de quem prioriza necessidades." },
  ],
  2: [
    { pergunta: "Receitas: R$2.000. Despesas: R$1.650. Qual o saldo?", alternativas: ["R$300", "R$350", "R$400", "R$450"], correta: 1, dica: "Saldo = Receitas − Despesas" },
    { pergunta: "Se o saldo é negativo, significa que:", alternativas: ["Você ganhou mais do que gastou", "Você gastou mais do que ganhou", "Suas receitas são zero", "Não há despesas fixas"], correta: 1, dica: "Negativo = gastou mais do que entrou." },
    { pergunta: "Carlos ganha R$1.500 e tem despesas fixas de R$900. Quanto sobra para despesas variáveis e poupança?", alternativas: ["R$500", "R$600", "R$700", "R$800"], correta: 1, dica: "1500 − 900 = ?" },
  ],
  3: [
    { pergunta: "Qual é 20% de R$150?", alternativas: ["R$25", "R$30", "R$35", "R$40"], correta: 1, dica: "150 × 0,20 = ?" },
    { pergunta: "Um produto de R$200 tem 10% de desconto. Quanto você paga?", alternativas: ["R$170", "R$180", "R$190", "R$160"], correta: 1, dica: "Desconto = 200 × 0,10. Valor final = 200 − desconto." },
    { pergunta: "Salário de R$2.000 com aumento de 5%. Novo salário:", alternativas: ["R$2.050", "R$2.100", "R$2.150", "R$2.200"], correta: 1, dica: "Aumento = 2000 × 0,05" },
  ],
  4: [
    { pergunta: "C=R$500, i=2% a.m., t=3 meses. Calcule J.", alternativas: ["R$20", "R$25", "R$30", "R$35"], correta: 2, dica: "J = C × i × t = 500 × 0,02 × 3" },
    { pergunta: "Tomei R$800 e paguei R$864 após 2 meses. Qual foi a taxa mensal?", alternativas: ["2%", "3%", "4%", "5%"], correta: 2, dica: "J = 64. i = J ÷ (C × t)" },
    { pergunta: "Qual fórmula representa os Juros Simples?", alternativas: ["M = C(1+i)^t", "J = C+i+t", "J = C×i×t", "M = C×i×t"], correta: 2, dica: "J é o juros, C o capital, i a taxa e t o tempo." },
  ],
  5: [
    { pergunta: "R$1.000 a 10% a.m. por 2 meses (juros compostos). Montante:", alternativas: ["R$1.200", "R$1.210", "R$1.220", "R$1.100"], correta: 1, dica: "M = 1000 × (1,10)²" },
    { pergunta: "No juro composto, os juros de cada período incidem sobre:", alternativas: ["Apenas o capital inicial", "O montante acumulado", "Apenas os juros anteriores", "O dobro do capital"], correta: 1, dica: "Por isso chamamos de 'juros sobre juros'." },
    { pergunta: "Por que juros compostos crescem mais rápido que simples no longo prazo?", alternativas: ["Porque a taxa é maior", "Porque o tempo é menor", "Porque incidem sobre montante crescente", "Porque o capital diminui"], correta: 2, dica: "A base de cálculo cresce a cada período." },
  ],
  6: [
    { pergunta: "Fatura de R$1.500. Você pagou R$400. Sobre quanto incidem os juros rotativos?", alternativas: ["R$400", "R$1.100", "R$1.500", "R$0"], correta: 1, dica: "Juros incidem sobre o saldo não pago." },
    { pergunta: "O crédito rotativo do cartão é conhecido por:", alternativas: ["Ter as menores taxas do mercado", "Ser isento de juros", "Ter uma das maiores taxas de juros do Brasil", "Ser obrigatório pagar"], correta: 2, dica: "Pode ultrapassar 300% ao ano!" },
    { pergunta: "Parcelar uma compra de R$600 em 6x sem juros significa que cada parcela é:", alternativas: ["R$90", "R$100", "R$110", "R$120"], correta: 1, dica: "600 ÷ 6 = ?" },
  ],
  7: [
    { pergunta: "Meta: R$1.800 em 9 meses, sem juros. Quanto guardar por mês?", alternativas: ["R$150", "R$175", "R$200", "R$225"], correta: 2, dica: "1800 ÷ 9 = ?" },
    { pergunta: "O que é mais eficiente para atingir metas financeiras mais cedo?", alternativas: ["Gastar mais no presente", "Ignorar os juros", "Guardar regularmente com juros compostos", "Parcelar tudo no cartão"], correta: 2, dica: "Juros compostos trabalham a seu favor quando você poupa." },
    { pergunta: "Fernanda quer R$3.000 em 12 meses. Ela guarda R$200/mês. Em quanto tempo atingirá a meta (sem juros)?", alternativas: ["10 meses", "12 meses", "15 meses", "18 meses"], correta: 2, dica: "3000 ÷ 200 = ?" },
  ],
};
