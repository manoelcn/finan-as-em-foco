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
- `@google/generative-ai` (Gemini SDK)
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

## Configurar chave de API (GEMINI_API_KEY)

O chat da tutora (IA) agora é integrado diretamente com o **Google Gemini SDK** via Server Functions. Para que funcione localmente, é necessário configurar sua chave de API do Google Gemini. Siga estes passos:

1. No diretório raiz do projeto, crie ou edite o arquivo `.env` com o conteúdo:

```bash
GEMINI_API_KEY=sua_chave_real_aqui
```

2. O arquivo `.env` já está protegido no `.gitignore` para que sua chave não seja exposta no repositório.

3. Reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Abra a aplicação e teste o chat. Se a chave não estiver configurada, o servidor lançará um erro.

**Notas de Segurança da Arquitetura:**
- O código que lê a chave está centralizado de forma segura em `src/lib/gemini.server.ts` rodando via Server Functions do TanStack Start.
- **Aviso Importante:** Nunca utilize o prefixo `VITE_` (ex: `VITE_GEMINI_API_KEY`), pois isso exporia publicamente a sua chave secreta no bundle JavaScript do navegador. A aplicação acessa a chave de forma segura no lado do servidor através de `process.env.GEMINI_API_KEY`.
- Para produção, configure a variável `GEMINI_API_KEY` no ambiente de deploy.

## Contato

Esse README foi gerado automaticamente para documentar o projeto `Finanças em Foco`.
