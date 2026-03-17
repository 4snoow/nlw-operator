# Server API

## Estrutura

```
src/server/api/
├── trpc.ts          # Configuração base (initTRPC, router, procedure)
└── routers/
    ├── _app.ts      # AppRouter principal (exporta tipo AppRouter)
    └── metrics.ts   # Routers específicos
```

## Padrões

- Cada router em arquivo separado em `routers/`
- Usar Zod para validação de inputs/outputs
- Named exports para routers
- Tipos exportados de `_app.ts` para uso no cliente

## Exemplo de Router

```typescript
// src/server/api/routers/metrics.ts
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db } from '@/db';
import { stats } from '@/db/schema';

export const metricsRouter = router({
  getMetrics: publicProcedure
    .output(z.object({ totalRoasted: z.number(), avgScore: z.number() }))
    .query(async () => {
      const statsData = await db.query.stats.findFirst();
      return statsData ?? { totalRoasted: 0, avgScore: 0 };
    }),
});
```

```typescript
// src/server/api/routers/_app.ts
import { router } from '../trpc';
import { metricsRouter } from './metrics';

export const appRouter = router({
  metrics: metricsRouter,
});

export type AppRouter = typeof appRouter;
```
