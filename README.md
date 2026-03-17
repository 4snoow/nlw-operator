# DevRoast

> Paste your code. Get roasted.

## O que é?

DevRoast é uma ferramenta que analisa seu código e dá um feedback honesto e implacável sobre a qualidade dele. Quer ver o quão ruim (ou bom) seu código realmente é?

## Funcionalidades

- **Análise de Código**: Cole seu código e receba uma avaliação detalhada
- **Modo Roast**: Ative para sarcasmos infinitos
- **Leaderboard**: Veja os piores códigos ranqueados por vergonha
- **Feedback**: Opiniões (nem sempre) construtivas

## Como usar

1. Acesse a página principal
2. Cole seu código no campo de texto
3. Selecione a linguagem (auto-detecção disponível)
4. Escolha o tema e fonte do editor
5. Clique em "roast_my_code"
6. Descubra o quão horrível seu código é

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS v4
- **Componentes**: Base UI
- **Syntax Highlighting**: Shiki
- **ORM**: Drizzle ORM
- **Banco de Dados**: Neon (PostgreSQL serverless)
- **API**: tRPC + TanStack React Query
- **Validação**: Zod
- **Animações**: Number Flow
- **Linting**: Biome
- **Gerador de Imagens**: Takumi (OG Images)
- **AI**: OpenAI (GPT-4o)
- **Utilitários**: clsx, tailwind-merge, tailwind-variants

## Configuração

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
npm install
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com a connection string do Neon:

```env
DATABASE_URL=postgresql://neondb_owner:password@host.neon.tech/neondb?sslmode=require
```

### Scripts Disponíveis

```bash
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Iniciar servidor de produção
npm run lint         # Verificar lint
npm run db:seed      # Seed básico do banco
npm run db:seed:faker # Seed com 100 roasts de exemplo
```

## Contributing

Contribuições são bem-vindas! Feel free to open issues e PRs.
