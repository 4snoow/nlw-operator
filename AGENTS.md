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
- `src/components/ui/` - componentes genéricos
- `src/lib/` - utilitários

## Padrões
- Todos os componentes em `src/components/ui/`
- Named exports
- React 19 (sem forwardRef)
- tailwind-variants para variantes
- Server Components por padrão
- 'use client' apenas quando necessário
- cn() do @/lib/utils para interpolações
- Cores/temas em `src/app/globals.css` (@theme)
