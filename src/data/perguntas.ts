export interface Questao {
  pergunta: string;
  alternativas: string[];
  correta: number; // index
  dica?: string;
  feedbacks?: Record<number, string>;
}

export const DIAGNOSTICO: Record<number, Questao> = {
  1: { 
    pergunta: "João quer comprar um tênis novo de R$300, mas já tem um par em bom estado. Esse gasto é:", 
    alternativas: ["Uma necessidade básica", "Um desejo, pois o atual ainda atende à função", "Um investimento", "Uma despesa fixa"], 
    correta: 1,
    feedbacks: {
      0: "Necessidade é algo indispensável para sobreviver. Como ele já tem um par bom, não é urgente.",
      2: "Investimentos são aplicações que geram retorno financeiro no futuro.",
      3: "Despesa fixa é aquela que se repete todo mês, como o aluguel."
    },
    dica: "Exato! Desejos são compras motivadas por vontade, não por urgência de sobrevivência."
  },
  2: { 
    pergunta: "Maria recebe R$1.200/mês e gasta R$400 em aluguel, R$300 em alimentação e R$150 em transporte. Qual é o saldo disponível?", 
    alternativas: ["R$250", "R$350", "R$450", "R$500"], 
    correta: 1,
    feedbacks: {
      0: "Verifique a soma das despesas: 400 + 300 + 150 = 850. Agora subtraia de 1200.",
      2: "Cuidado na subtração. As despesas somam R$850. Quanto sobra de 1200?",
      3: "A soma das despesas é R$850, o que deixa um saldo menor que 500."
    },
    dica: "Perfeito! A soma das despesas é R$850, e R$1.200 - R$850 deixa exatamente R$350 de saldo."
  },
  3: { 
    pergunta: "Um produto custa R$80 e está com 15% de desconto. Qual o valor a pagar?", 
    alternativas: ["R$65", "R$68", "R$72", "R$75"], 
    correta: 1,
    feedbacks: {
      0: "Isso seria um desconto maior que R$12. Calcule 15% de 80 e subtraia.",
      2: "Esse desconto foi de apenas 10% (R$8). O desconto pedido é de 15%.",
      3: "Esse desconto foi de apenas R$5. Para achar 15%, calcule 80 x 0,15."
    },
    dica: "Muito bem! 15% de 80 é R$12. Subtraindo R$12 de R$80, temos R$68."
  },
  4: { 
    pergunta: "Empréstimo de R$1.000 a 2% ao mês por 3 meses. Qual o valor dos juros?", 
    alternativas: ["R$20", "R$40", "R$60", "R$80"], 
    correta: 2,
    feedbacks: {
      0: "Isso seria os juros de apenas 1 mês (2% de 1000). O prazo é de 3 meses.",
      1: "Isso seria os juros para 2 meses. Lembre-se que o prazo é de 3 meses.",
      3: "Isso seria os juros de 4 meses. A fórmula é J = C * i * t."
    },
    dica: "Correto! Juros = 1000 * 0.02 * 3 = 60 reais."
  },
  5: { 
    pergunta: "R$500 aplicados a 10% ao mês por 2 meses com juros compostos. Qual o montante?", 
    alternativas: ["R$595", "R$600", "R$605", "R$610"], 
    correta: 2,
    feedbacks: {
      0: "O cálculo ficou um pouco abaixo do esperado. Calcule mês a mês: 10% sobre 500, depois 10% sobre o novo valor.",
      1: "R$600 seria no regime de juros simples. Em juros compostos há 'juros sobre juros'.",
      3: "O valor ficou um pouco acima do esperado. O cálculo é 500 * (1.10)^2."
    },
    dica: "Excelente! No 1º mês vai para R$550. No 2º mês, rende mais 10% de R$550 (R$55), totalizando R$605."
  },
  6: { 
    pergunta: "Ana gastou R$1.000 no crédito e pagou apenas R$200 da fatura. Sobre o que incidirão os juros rotativos?", 
    alternativas: ["Sobre os R$200 pagos", "Sobre os R$800 restantes", "Sobre os R$1.000 totais", "Não há juros se pagar o mínimo"], 
    correta: 1,
    feedbacks: {
      0: "Os R$200 já foram quitados. Os juros incidem apenas sobre o que ficou em aberto.",
      2: "O banco não cobra juros do valor que você já pagou, apenas da diferença que rolou para o mês que vem.",
      3: "O rotativo cobra (e muitos) juros sobre o valor que não foi pago, mesmo pagando o mínimo."
    },
    dica: "Isso aí! O rotativo sempre é cobrado sobre a diferença que fica para o próximo mês (neste caso, R$800)."
  },
  7: { 
    pergunta: "Pedro quer juntar R$1.200 em 6 meses. Quanto ele deve guardar por mês (sem juros)?", 
    alternativas: ["R$150", "R$175", "R$200", "R$250"], 
    correta: 2,
    feedbacks: {
      0: "Guardando R$150, em 6 meses ele terá apenas R$900.",
      1: "Guardando R$175, em 6 meses ele terá R$1.050.",
      3: "Guardando R$250, ele juntaria R$1.500, que é mais do que a meta."
    },
    dica: "Acertou! Basta dividir a meta pelo tempo: 1200 / 6 = 200 reais por mês."
  },
};

export const EXERCICIOS: Record<number, Questao[]> = {
1: [
  {
    pergunta: "Comprar um celular novo sendo que o atual funciona bem é um exemplo de:",
    alternativas: ["Necessidade", "Desejo", "Investimento", "Despesa fixa"],
    correta: 1,
    dica: "Pense: você consegue viver sem ele agora?",
    feedbacks: {
      0: "Você marcou 'Necessidade'. Mas se o aparelho atual ainda funciona, dá pra viver sem o novo agora? O que muda se ele for algo que você quer, não que precisa?",
      2: "'Investimento' costuma trazer retorno financeiro futuro. Um celular para uso pessoal devolve dinheiro pra você?",
      3: "'Despesa fixa' se repete todo mês (aluguel, luz). Comprar um celular é um gasto único — encaixa nisso?",
    },
  },
  {
    pergunta: "Qual dessas é uma NECESSIDADE?",
    alternativas: ["Streaming de música", "Academia", "Remédio prescrito", "Tênis de marca"],
    correta: 2,
    dica: "Necessidade está ligada à saúde, segurança e sobrevivência.",
    feedbacks: {
      0: "Streaming é entretenimento. Compare com algo ligado à saúde ou à sobrevivência: dá pra viver bem sem ele?",
      1: "Academia faz bem, mas é essencial para sobreviver? Pense no que você realmente não conseguiria deixar de ter.",
      3: "A marca é um desejo. Você precisa de calçado — mas precisa que seja 'de marca'? Separe a função do status.",
    },
  },
  {
    pergunta: "Ana separa 20% da renda antes de gastar. Essa atitude reflete:",
    alternativas: ["Desejo", "Impulso", "Planejamento consciente", "Desperdício"],
    correta: 2,
    dica: "Guardar dinheiro antes de gastar é um hábito de quem prioriza necessidades.",
    feedbacks: {
      0: "Desejo é querer algo. Aqui Ana está organizando o dinheiro antes de gastar — isso é querer, ou é planejar?",
      1: "Impulso é agir sem pensar. Reservar uma parte fixa todo mês é o oposto disso.",
      3: "Desperdício é jogar dinheiro fora. Guardar parte da renda perde dinheiro, ou protege?",
    },
  },
],
2: [
  {
    pergunta: "Receitas: R$2.000. Despesas: R$1.650. Qual o saldo?",
    alternativas: ["R$300", "R$350", "R$400", "R$450"], correta: 1, dica: "Saldo = Receitas − Despesas",
    feedbacks: {
      0: "Confira a subtração 2000 − 1650 — não tirou 50 a mais sem querer?",
      2: "Parece que sobrou algo na conta. Quanto dá exatamente 2000 − 1650?",
      3: "Esse valor está alto para o que sobra. Refaça 2000 − 1650 com calma.",
    },
  },
  {
    pergunta: "Se o saldo é negativo, significa que:",
    alternativas: ["Você ganhou mais do que gastou", "Você gastou mais do que ganhou", "Suas receitas são zero", "Não há despesas fixas"], correta: 1, dica: "Negativo = gastou mais do que entrou.",
    feedbacks: {
      0: "Se ganhou mais do que gastou, sobraria dinheiro — e sobra dá saldo positivo, não negativo.",
      2: "Receita zero é um caso extremo. Dá pra ter saldo negativo recebendo algum dinheiro; o que conta é entrar menos do que sai.",
      3: "O sinal do saldo não diz nada sobre o tipo de despesa. Pense só: entrou mais ou saiu mais?",
    },
  },
  {
    pergunta: "Carlos ganha R$1.500 e tem despesas fixas de R$900. Quanto sobra para despesas variáveis e poupança?",
    alternativas: ["R$500", "R$600", "R$700", "R$800"], correta: 1, dica: "1500 − 900 = ?",
    feedbacks: {
      0: "Refaça 1500 − 900 — não faltou somar 100?",
      2: "Esse valor passou um pouco. Quanto é exatamente 1500 − 900?",
      3: "Cuidado: 1500 − 900 dá menos que isso. Tente de novo.",
    },
  },
],
3: [
  {
    pergunta: "Qual é 20% de R$150?",
    alternativas: ["R$25", "R$30", "R$35", "R$40"], correta: 1, dica: "150 × 0,20 = ?",
    feedbacks: {
      0: "20% é multiplicar por 0,20. Quanto dá 150 × 0,20?",
      2: "Você passou do valor. Refaça 150 × 0,20.",
      3: "Isso seria mais que 25%. Recalcule 150 × 0,20.",
    },
  },
  {
    pergunta: "Um produto de R$200 tem 10% de desconto. Quanto você paga?",
    alternativas: ["R$170", "R$180", "R$190", "R$160"], correta: 1, dica: "Desconto = 200 × 0,10. Valor final = 200 − desconto.",
    feedbacks: {
      0: "Quanto é 10% de 200? Parece que você descontou mais do que isso.",
      2: "10% de 200 não é só R$10. Calcule o desconto e subtraia de 200.",
      3: "Você descontou demais — isso seria 20%. Aqui o desconto é de 10%.",
    },
  },
  {
    pergunta: "Salário de R$2.000 com aumento de 5%. Novo salário:",
    alternativas: ["R$2.050", "R$2.100", "R$2.150", "R$2.200"], correta: 1, dica: "Aumento = 2000 × 0,05",
    feedbacks: {
      0: "5% de 2000 não é 50. Refaça 2000 × 0,05 e some ao salário.",
      2: "Você aumentou mais que 5%. Quanto é 2000 × 0,05?",
      3: "Isso seria um aumento de 10%. O enunciado fala em 5%.",
    },
  },
],
4: [
  {
    pergunta: "C=R$500, i=2% a.m., t=3 meses. Calcule J.",
    alternativas: ["R$20", "R$25", "R$30", "R$35"], correta: 2, dica: "J = C × i × t = 500 × 0,02 × 3",
    feedbacks: {
      0: "Parece que você usou só 2 meses. O tempo no enunciado é t = 3.",
      1: "Confira J = C × i × t com C=500, i=0,02 e t=3.",
      3: "Você passou do valor. Multiplique 500 × 0,02 × 3 com atenção.",
    },
  },
  {
    pergunta: "Tomei R$800 e paguei R$864 após 2 meses. Qual foi a taxa mensal?",
    alternativas: ["2%", "3%", "4%", "5%"], correta: 2, dica: "J = 64. i = J ÷ (C × t)",
    feedbacks: {
      0: "Ache os juros primeiro: 864 − 800. Depois i = J ÷ (800 × 2). Não parou cedo demais?",
      1: "Quase. Com J = 64, faça i = 64 ÷ (800 × 2).",
      3: "Você passou da taxa. Refaça 64 ÷ 1600.",
    },
  },
  {
    pergunta: "Qual fórmula representa os Juros Simples?",
    alternativas: ["M = C(1+i)^t", "J = C+i+t", "J = C×i×t", "M = C×i×t"], correta: 2, dica: "J é o juros, C o capital, i a taxa e t o tempo.",
    feedbacks: {
      0: "Essa é a fórmula dos juros compostos (montante). A questão pede a dos juros simples.",
      1: "Juros não se calculam somando capital, taxa e tempo — a operação é multiplicação.",
      3: "Atenção ao símbolo: M é o montante, não os juros. C×i×t resulta em J, não em M.",
    },
  },
],
5: [
  {
    pergunta: "R$1.000 a 10% a.m. por 2 meses (juros compostos). Montante:",
    alternativas: ["R$1.200", "R$1.210", "R$1.220", "R$1.100"], correta: 1, dica: "M = 1000 × (1,10)²",
    feedbacks: {
      0: "R$1.200 seria juros simples (10% sobre 1000, duas vezes). No composto, o 2º mês rende sobre o montante do 1º. Refaça 1000 × (1,10)².",
      2: "Você passou um pouco. Calcule 1000 × 1,10 × 1,10 com calma.",
      3: "Isso é só o montante de 1 mês. Faltou aplicar o segundo período.",
    },
  },
  {
    pergunta: "No juro composto, os juros de cada período incidem sobre:",
    alternativas: ["Apenas o capital inicial", "O montante acumulado", "Apenas os juros anteriores", "O dobro do capital"], correta: 1, dica: "Por isso chamamos de 'juros sobre juros'.",
    feedbacks: {
      0: "Isso descreve os juros simples. No composto, sobre o que os juros passam a incidir a cada mês?",
      2: "Não são só os juros — é o capital somado aos juros. Como chamamos esse total?",
      3: "Não há nada de 'dobro' aqui. Pense no montante acumulado período a período.",
    },
  },
  {
    pergunta: "Por que juros compostos crescem mais rápido que simples no longo prazo?",
    alternativas: ["Porque a taxa é maior", "Porque o tempo é menor", "Porque incidem sobre montante crescente", "Porque o capital diminui"], correta: 2, dica: "A base de cálculo cresce a cada período.",
    feedbacks: {
      0: "A taxa pode ser a mesma nos dois casos. O que muda é a base sobre a qual os juros incidem.",
      1: "O tempo não é menor — a diferença aparece justamente no longo prazo.",
      3: "O capital não diminui; ele cresce a cada período, e os juros incidem sobre esse total maior.",
    },
  },
],
6: [
  {
    pergunta: "Fatura de R$1.500. Você pagou R$400. Sobre quanto incidem os juros rotativos?",
    alternativas: ["R$400", "R$1.100", "R$1.500", "R$0"], correta: 1, dica: "Juros incidem sobre o saldo não pago.",
    feedbacks: {
      0: "R$400 foi o que você pagou. Os juros incidem sobre o que ficou em aberto, não sobre o que foi quitado.",
      2: "R$1.500 é a fatura cheia. Mas você já pagou uma parte — sobre quanto resta o juro?",
      3: "Pagar parte da fatura não zera os juros. Sobre o saldo não pago, eles incidem sim.",
    },
  },
  {
    pergunta: "O crédito rotativo do cartão é conhecido por:",
    alternativas: ["Ter as menores taxas do mercado", "Ser isento de juros", "Ter uma das maiores taxas de juros do Brasil", "Ser obrigatório pagar"], correta: 2, dica: "Pode ultrapassar 300% ao ano!",
    feedbacks: {
      0: "É o contrário: o rotativo é um dos créditos mais caros que existem.",
      1: "Se fosse isento, não seria um problema. O rotativo cobra juros — e altos.",
      3: "Você não é obrigado a usar o rotativo; ele aparece quando não se paga a fatura inteira. A questão é sobre a taxa dele.",
    },
  },
  {
    pergunta: "Parcelar uma compra de R$600 em 6x sem juros significa que cada parcela é:",
    alternativas: ["R$90", "R$100", "R$110", "R$120"], correta: 1, dica: "600 ÷ 6 = ?",
    feedbacks: {
      0: "Confira a divisão 600 ÷ 6 — não ficou um pouco abaixo?",
      2: "Você passou. Sem juros, é só dividir 600 por 6.",
      3: "Isso seria dividir por 5. São 6 parcelas: 600 ÷ 6.",
    },
  },
],
7: [
  {
    pergunta: "Meta: R$1.800 em 9 meses, sem juros. Quanto guardar por mês?",
    alternativas: ["R$150", "R$175", "R$200", "R$225"], correta: 2, dica: "1800 ÷ 9 = ?",
    feedbacks: {
      0: "Guardando isso, levaria mais que 9 meses para juntar R$1.800. Divida 1800 ÷ 9.",
      1: "Quase. Refaça 1800 ÷ 9 — o resultado é redondo.",
      3: "Você passou. 1800 ÷ 9 dá menos que isso.",
    },
  },
  {
    pergunta: "O que é mais eficiente para atingir metas financeiras mais cedo?",
    alternativas: ["Gastar mais no presente", "Ignorar os juros", "Guardar regularmente com juros compostos", "Parcelar tudo no cartão"], correta: 2, dica: "Juros compostos trabalham a seu favor quando você poupa.",
    feedbacks: {
      0: "Gastar mais hoje afasta a meta, não aproxima. O que faz o dinheiro render a seu favor?",
      1: "Ignorar os juros é abrir mão de uma ajuda. Quando você poupa, eles jogam a favor ou contra?",
      3: "Parcelar gera dívida, não poupança. Pense no que faz seu dinheiro crescer ao longo do tempo.",
    },
  },
  {
    pergunta: "Fernanda quer R$3.000 em 12 meses. Ela guarda R$200/mês. Em quanto tempo atingirá a meta (sem juros)?",
    alternativas: ["10 meses", "12 meses", "15 meses", "18 meses"], correta: 2, dica: "3000 ÷ 200 = ?",
    feedbacks: {
      0: "Em 10 meses guardando R$200 dá R$2.000, não R$3.000. Faça 3000 ÷ 200.",
      1: "Os 12 meses são o desejo dela, não o resultado da conta. Divida 3000 ÷ 200.",
      3: "Você passou. 3000 ÷ 200 dá menos que 18.",
    },
  },
],
};