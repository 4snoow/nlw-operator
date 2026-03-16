# tRPC + Next.js App Router

## Resultados da Pesquisa

### Instalação

```bash
npm install @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query zod
```

### Arquitetura

| Arquivo | Função |
|---------|--------|
| `src/server/api/trpc.ts` | Configuração base (init, procedures) |
| `src/server/api/routers/` | Rotas/endpoints da API |
| `src/trpc/server.ts` | Server Components: caller, getQueryClient, HydrateClient |
| `src/trpc/client.tsx` | Client Components: provider, TRPCProvider |
| `src/trpc/query-client.ts` | QueryClient singleton |

### Server Components (SSR)

```tsx
// src/trpc/server.ts
import 'server-only';
import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { cache } from 'react';
import { createCallerFactory, createTRPCContext } from './init';
import { makeQueryClient } from './query-client';

export const getQueryClient = cache(makeQueryClient);
const caller = createCallerFactory(appRouter)(createTRPCContext);
export const { trpc, HydrateClient } = createHydrationHelpers(caller, getQueryClient);
```

### Client Components

```tsx
// src/trpc/client.tsx
'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { makeQueryClient } from './query-client';

export const trpc = createTRPCReact<AppRouter>();
let clientQueryClientSingleton: QueryClient;

export function TRPCProvider({ children }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    trpc.createClient({ links: [httpBatchLink({ url: '/api/trpc' })] })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
```

### Uso em Server Component

```tsx
// app/page.tsx
import { trpc } from '~/trpc/server';
import { HydrateClient } from '~/trpc/server';

export default async function Page() {
  void trpc.exemplo.queryOptions(); // prefetch
  return <HydrateClient><Componente /></HydrateClient>;
}
```

## Recomendação

Usar arquitetura `tRPC + TanStack Query` com:
- Provider em `layout.tsx` (raiz)
- Server Components para prefetch com HydrationBoundary
- Client Components para interações (mutations, suspense)

## To-Dos

- [ ] Instalar dependências
- [ ] Criar estrutura `src/server/api/routers/`
- [ ] Configurar `src/trpc/server.ts` (Server Components)
- [ ] Configurar `src/trpc/client.tsx` (Client Components)
- [ ] Adicionar `TRPCProvider` no `layout.tsx`
- [ ] Criar API route `app/api/trpc/[trpc]/route.ts`
- [ ] Criar router de exemplo

## Decisões

- **Validação**: Zod (padrão tRPC para inputs/outputs)
- **Prefetch**: Server Components com `trpc.x.prefetch()`
- **Provider**: Singleton no client, cache no server
- **Transformers**: superjson opcional (padrão sem transforms)