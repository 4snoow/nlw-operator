# tRPC

## Estrutura

```
src/trpc/
├── client.tsx         # TRPCProvider para Client Components
├── server.ts          # trpc, HydrateClient para Server Components
├── init.ts            # createTRPCContext e createCallerFactory
└── query-client.ts   # makeQueryClient singleton
```

## Padrões

### Server Components
```typescript
import { trpc, HydrateClient } from '@/trpc/server';

export default async function Page() {
  void trpc.metrics.getMetrics.prefetch();
  
  return (
    <HydrateClient>
      <ClientComponent />
    </HydrateClient>
  );
}
```

### Client Components
```typescript
import { trpc } from '@/trpc/client';

export function ClientComponent() {
  const { data } = trpc.metrics.getMetrics.useQuery();
  // ...
}
```

### Provider
O `TRPCProvider` deve envolver a aplicação no `layout.tsx` raiz.

### API Route
```typescript
// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/api/routers/_app';
import { createTRPCContext } from '@/trpc/init';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext(),
  });

export { handler as GET, handler as POST };
```
