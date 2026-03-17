# NLW Operator

## Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Biome (lint/format)
- Base UI (componentes interativos)
- Shiki (syntax highlighting)

## Estrutura
- `src/app/` - rotas Next.js
- `src/components/ui/` - componentes genéricos (Base UI)
- `src/components/` - componentes de features (home-client, metrics, etc)
- `src/lib/` - utilitários
- `src/server/` - lógica de servidor (API routes)
- `src/trpc/` - configuração tRPC

## Padrões
- Todos os componentes em `src/components/ui/`
- Named exports
- React 19 (sem forwardRef)
- tailwind-variants para variantes
- Server Components por padrão
- 'use client' apenas quando necessário
- cn() do @/lib/utils para interpolações
- Cores/temas em `src/app/globals.css` (@theme)
- tRPC para camada de API com TanStack React Query
- Separação clara entre Server/Client Components
- Prefetch em Server Components com HydrateClient
- Revalidação com `export const revalidate = X` (em segundos)

## Cache e Revalidação

### Revalidação de páginas
Para revalidar uma página a cada X segundos, adicione `export const revalidate` na página:

```typescript
// src/app/leaderboard/page.tsx
export const revalidate = 3600; // 1 hora

export default async function LeaderboardPage() {
  const data = await fetchLeaderboard();
  // ...
}
```

### Input com limite flexível
Quando um router precisa de um limite configurável, use Zod com default:

```typescript
// src/server/api/routers/leaderboard.ts
import { asc } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { codes } from "@/db/schema";

getLeaderboard: publicProcedure
  .input(z.object({ limit: z.number().min(1).max(100).default(3) }))
  .query(async ({ input }) => {
    const leaderboard = await db.query.codes.findMany({
      orderBy: [asc(codes.score)],
      limit: input.limit,
    });
    return leaderboard;
  }),
```
