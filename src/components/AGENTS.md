# Components

## Estrutura

```
src/components/
├── ui/                    # Componentes genéricos (Base UI)
│   ├── Button.tsx
│   └── ...
├── metrics.tsx            # Componente de feature (tRPC + NumberFlow)
└── home-client.tsx        # Client component da página home
```

## Padrões

### Feature Components
- Arquivos em `src/components/` (raiz)
- Nome descritivo (ex: `metrics.tsx`, `home-client.tsx`)
- Separar Server e Client Components quando necessário

### Server + Client Components

Quando uma página precisa de dados do banco via tRPC:
1. **Server Component** (page.tsx): faz prefetch com `trpc.x.prefetch()` e envolve com `<HydrateClient>`
2. **Client Component** (components/feature.tsx): consome dados com `trpc.x.useQuery()`

### Animações com NumberFlow
- Usar estado interno iniciando em `0`
- `useEffect` para atualizar quando dados chegarem
- Isso cria a transição 0 → valor para ativar a animação

```typescript
// metrics.tsx
const [displayData, setDisplayData] = useState({ totalRoasted: 0, avgScore: 0 });

useEffect(() => {
  if (data) setDisplayData(data);
}, [data]);

<NumberFlow value={displayData.totalRoasted} />
```

## Server vs Client Components

### Quando usar Client Component com tRPC (Recomendado)

- Quando você quer **streaming SSR** (página carrega enquanto dados buscam)
- Quando você quer **cache automático** entre navegações
- Quando o componente precisa de **loading states granulares** com Suspense
- Quando há **interatividade** (useState, useEffect, event handlers)

```typescript
// Server: page.tsx
void trpc.products.list.prefetch();
<HydrateClient><ProductList /></HydrateClient>

// Client: components/product-list.tsx
const { data } = trpc.products.list.useQuery();
```

### Quando usar Server Component (passando props)

- Quando os dados são **simples e previsíveis**
- Quando você quer **menor JS bundle**
- Quando não precisa de **loading states complexos**
- Páginas estáticas ou que não dependem de dados dinâmicos frequentemente

```typescript
// Server: page.tsx
const products = await caller.products.list();
<ProductList products={products} />

// Client: components/product-list.tsx (sem useQuery!)
export function ProductList({ products }) { ... }
```

### Resumo

| Critério | Server + Props | Client + tRPC |
|----------|---------------|---------------|
| TTFB | Espera dados | Streaming |
| Cache | Manual | Automático |
| Bundle | Menor | +5KB (React Query) |
| Complexidade | Simples | Moderado |

**Regra geral**: Usar tRPC + Client Component para dados dinâmicos; Server Component para dados simples ou estáticos.

## Suspense

Quando usar Server Components async que fetch dados, usar `<Suspense>` para streaming SSR:

```typescript
import { Suspense } from 'react';

export default async function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <LeaderboardPreview />
    </Suspense>
  );
}
```

**Nota**: Com `cacheComponents: true` no `next.config.ts`, todos os componentes async que fazem fetch precisam estar dentro de `<Suspense>` para funcionar corretamente no build de produção.
