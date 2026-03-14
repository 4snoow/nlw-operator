# Padrões de Componentes UI

## Visão Geral

Este documento estabelece os padrões para criação de componentes UI genéricos neste projeto. Todos os componentes devem seguir estas diretrizes para manter consistência e manutenibilidade.

## Estrutura de Arquivos

```
src/components/ui/
├── button.tsx
├── badge.tsx
├── toggle.tsx
├── code-block.tsx
├── AGENTS.md (este arquivo)
└── [novo-componente].tsx
```

## Padrões de Implementação

### 1. Named Exports

Sempre usar named exports para componentes:

```typescript
export function ComponentName({ className, variant, ...props }: ComponentNameProps) {
  return <div className={componentTv({ variant, className })} {...props} />;
}
```

### 2. React 19 - Sem forwardRef

O `forwardRef` foi depreciado no React 19. Não usar mais:

```typescript
// ❌ Errado - React 19 deprecated
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(...)

// ✅ Correto - Função componente normal
export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={buttonTv({ variant, className })} {...props} />;
}
```

### 3. Usar tailwind-variants para Variantes

```typescript
import { tv, type VariantProps } from "tailwind-variants";

const componentTv = tv({
  base: "classes base sempre aplicadas",
  variants: {
    variant: {
      default: "classes da variante default",
      secondary: "classes da variante secondary",
    },
    size: {
      sm: "classes para tamanho small",
      lg: "classes para tamanho large",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
```

### 4. NÃO usar cn() com tailwind-variants (mas USAR quando houver interpolação)

O `tailwind-variants` já faz merge automaticamente. Não usar:

```typescript
// ❌ Errado - uso desnecessário
import { cn } from "@/lib/utils";
className={cn(componentTv({ variant, size, className }))}

// ✅ Correto - tailwind-variants faz o merge
className={componentTv({ variant, size, className })}
```

**MAS quando houver interpolação de strings com condições, USAR cn():**

```typescript
// ✅ Correto - cn() para interpolações
import { cn } from "@/lib/utils";
className={cn("base-classes", condition && "conditional-class")}

// ❌ Errado - interpolação de string direta
className={`base-classes ${condition ? "conditional" : ""}`}
```

### 5. Estender Props Nativas

```typescript
export interface ComponentNameProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentTv> {
  // propriedades específicas do componente
}
```

### 6. Variáveis de Tema

Usar as variáveis definidas em `src/app/globals.css`:

#### Cores
- `--color-primary` / `--color-primary-foreground`
- `--color-destructive` / `--color-destructive-foreground`
- `--color-muted` / `--color-muted-foreground`
- `--color-border` / `--color-input`
- `--color-ring`
- `--color-secondary` / `--color-secondary-foreground`
- `--color-accent` / `--color-accent-foreground`

#### Fontes
- `font-mono` → JetBrains Mono
- `font-sans` → Fonte padrão do sistema

### 7. Arquivo globals.css

Sempre adicionar novas variáveis de cores/temas em `src/app/globals.css` usando a sintaxe do Tailwind v4:

```css
@theme {
  --color-primary: #10b981;
  --color-primary-foreground: #0a0a0a;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;
}
```

### 8. Aplicar ao elemento html

As variáveis de fonte devem estar no elemento `<html>`:

```typescript
// layout.tsx
<html lang="pt-BR" className={jetbrainsMono.variable}>
```

### 9. Server vs Client Components

- **Server Components** (padrão): Componentes que não precisam de interactivity. Não usar `'use client'`.
- **Client Components**: Componentes que precisam de estado ou eventos (onClick, useState, etc.). Usar `'use client'` no topo.

```typescript
// Client Component (interativo)
"use client";
import { Toggle } from "@base-ui/react/toggle";

// Server Component (padrão - sem 'use client')
import { codeToHtml } from "shiki";
export async function CodeBlock({ code }) { ... }
```

### 10. Base UI para Comportamento

Para componentes que precisam de comportamento (Toggle, Switch, etc.), usar `@base-ui/react`:

```bash
npm install @base-ui/react
```

```typescript
"use client";
import { Toggle } from "@base-ui/react/toggle";
```

## Checklist de Revisão

Antes de criar um novo componente, verifique:

- [ ] Named export usado
- [ ] Sem forwardRef (React 19)
- [ ] tailwind-variants para variantes
- [ ] NÃO usa cn() desnecessariamente
- [ ] Props nativas estendidas corretamente
- [ ] Variáveis do tema usadas quando possível
- [ ] Fontes configuradas no layout
- [ ] 'use client' apenas se necessário (interatividade)
- [ ] Base UI usado para componentes com comportamento
