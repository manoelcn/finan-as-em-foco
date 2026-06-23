# Finanças em Foco

Um app interativo de tutoria em Matemática Financeira, com diagnóstico inicial, trilha adaptativa e chat de IA.

## O que é

`Finanças em Foco` é uma aplicação web construída em React e TypeScript que ajuda estudantes a aprenderem conceitos de matemática financeira de forma prática.

Principais recursos:
- Landing page apresentando o produto
- Diagnóstico inicial com perguntas para personalizar a trilha
- Mapa de conhecimento com módulos desbloqueados por pré-requisitos
- Conteúdo e exercícios para cada unidade
- Chat de tutora com IA para dúvidas e explicações
- SSR-ready com `@tanstack/react-start`

## Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS
- `@tanstack/react-router`
- `@tanstack/react-query`
- `@tanstack/react-start`
- `@ai-sdk/openai-compatible`
- `zod`
- `sonner`

## Estrutura do projeto

- `src/routes/` - rotas e páginas principais
  - `index.tsx` - landing page
  - `diagnostico.tsx` - diagnóstico inicial
  - `trilha.tsx` - página da trilha de aprendizado
- `src/components/` - componentes de interface reutilizáveis
  - `ChatWidget.tsx` - chat da tutora Prof. Fina
  - `DomainGraph.tsx` - visualização do mapa de unidades
  - `Exercise.tsx` - módulo de exercícios
- `src/context/` - estado global da aplicação
  - `AppContext.tsx`
- `src/data/` - conteúdo de unidades, perguntas e exercícios
  - `unidades.ts`
  - `perguntas.ts`
- `src/lib/` - funcionalidades auxiliares e integrações
- `src/server.ts` - entrypoint do servidor para SSR
- `styles.css` - estilos globais

## Como usar

1. Instale as dependências:
   ```bash
   npm install
   ```
   Ou, se preferir Bun:
   ```bash
   bun install
   ```

2. Inicie o modo de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse a aplicação em `http://localhost:4173` (ou a porta exibida no terminal).

## Scripts disponíveis

- `npm run dev` - executa o servidor de desenvolvimento
- `npm run build` - gera a versão de produção
- `npm run build:dev` - build em modo development
- `npm run preview` - pré-visualiza a build de produção
- `npm run lint` - verifica o código com ESLint
- `npm run format` - formata o projeto com Prettier

## Observações

- A aplicação usa pré-requisitos de unidades para desbloquear o próximo conteúdo.
- O chat de IA faz chamadas ao servidor usando `useServerFn` de `@tanstack/react-start`.
- O estado do aluno e o progresso das unidades são gerenciados no contexto `AppContext`.

## Configurar chave de API (LOVABLE_API_KEY)

Para que o chat da tutora (IA) funcione localmente, é necessário configurar a chave de API fornecida pelo provedor Lovable. Siga estes passos:

1. No diretório raiz do projeto, crie um arquivo `.env.local` com o conteúdo:

```bash
LOVABLE_API_KEY=su_a_chave_aqui
```

2. Proteja a chave do controle de versão adicionando `.env.local` ao `.gitignore` (se ainda não estiver):

```bash
echo ".env.local" >> .gitignore
```

3. Reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Abra a aplicação e teste o chat. Se a chave não estiver configurada, o servidor lançará o erro "LOVABLE_API_KEY não configurada".

Notas:
- O código que lê a chave está em `src/lib/chat.functions.ts` e a chave é passada ao gateway em `src/lib/ai-gateway.server.ts`.
- Esse valor é necessário apenas no lado do servidor; não use o prefixo `VITE_` para essa variável.
- Para produção, configure `LOVABLE_API_KEY` nas variáveis de ambiente do seu provedor (Vercel, Heroku, Docker, etc.).

## Contato

Esse README foi gerado automaticamente para documentar o projeto `Finanças em Foco`.
