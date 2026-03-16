# Especificação da Página de Roast Results

## Visão Geral
- **Página**: `/roast/[id]` - Roast Results (página de resultado de um roast)
- **Tipo**: Dados estáticos (por enquanto), SSR para SEO
- **Parâmetro dinâmico**: `id` (UUID do roast)
- **Objetivo**: Exibir o resultado de um roast com score, código submetido, análise detalhada e sugestão de correção

## Estrutura do Layout

### Header/Navbar
- Altura: 56px
- Logo: ícone `>` (accent-green #10B981) + texto "devroast"
- Navegação: link "leaderboard" (texto secundário)
- Borda inferior: 1px sólida border-primary
- Padding horizontal: 40px

### Seção Score Hero
- Layout horizontal com gap: 48px
- Alinhamento: centro

#### Score Ring (esquerda)
- Ellipse externa: 180x180, borda 4px border-primary
- Ellipse interna: 180x180, borda 4px com gradiente angular (red → amber → green)
- Texto do score: "3.5", cor accent-amber, 48px, bold
- Label "/10": cor text-tertiary, 16px

#### Roast Summary (direita)
- Badge: ponto vermelho + texto "verdict: needs_serious_help" (accent-red)
- Roast Title: citação em itálico, 20px, IBM Plex Mono, line-height 1.5
- Meta row: linguagem (ex: "javascript") + "·" + linhas (ex: "7 lines")
- Share button: borda 1px border-primary, padding 8px 16px

### Divisor
- Linha horizontal: 1px border-primary

### Seção Submitted Code
- Título: "// your_submission" com prefixo "//" em accent-green
- Code Preview:
  - Background: bg-input (#111111)
  - Border: 1px border-primary
  - Linha numbers: 48px largura, border-right 1px border-primary, padding 16px 12px
  - Code content: padding 16px

### Divisor
- Linha horizontal: 1px border-primary

### Seção Detailed Analysis
- Título: "// detailed_analysis" com prefixo "//" em accent-green
- Grid de Issue Cards:
  - 2 colunas
  - Gap: 20px
  - Cada card: borda 1px border-primary, padding 20px, gap 12px

### Divisor
- Linha horizontal: 1px border-primary

### Seção Suggested Fix (Diff)
- Título: "// suggested_fix" com prefixo "//" em accent-green
- Diff Block:
  - Header: "your_code.ts → improved_code.ts", 40px altura, border-bottom 1px
  - Background: bg-input (#111111)
  - Border: 1px border-primary
  - Diff lines com cores:
    - Context lines: transparent
    - Removed lines: bg-red-500/15 (linha 1-5)
    - Added lines: bg-emerald-500/15 (linha 1)

## Design Visual

### Cores (Tema Escuro)
- `--bg-page`: #0A0A0A
- `--bg-surface`: #0F0F0F
- `--bg-input`: #111111
- `--bg-elevated`: #1A1A1A
- `--border-primary`: #2A2A2A
- `--text-primary`: #FAFAFA
- `--text-secondary`: #6B7280
- `--text-tertiary`: #4B5563
- `--accent-green`: #10B981
- `--accent-amber`: #F59E0B
- `--accent-red`: #EF4444

### Cores de Syntax Highlighting
- `--syn-function`: #FFC799
- `--syn-operator`: #A0A0A0
- `--syn-variable`: #FFFFFF
- `--syn-string`: #99FFE4

### Tipografia
- Fonte primária: JetBrains Mono
- Fonte secundária: IBM Plex Mono (para citações)
- Score number: 48px, bold
- Score label: 16px
- Roast title: 20px, line-height 1.5
- Meta info: 12px
- Section titles: 14px, bold
- Code: 13px (line numbers), 13px (code content)
- Diff: 13px

### Espaçamento
- Page padding: 40px 80px (vertical, horizontal)
- Section gap: 40px
- Score Hero gap: 48px
- Summary gap: 16px
- Issues grid gap: 20px
- Cards gap: 20px

## Parâmetro de URL

### Rota Dinâmica
- Pattern: `/roast/[id]`
- Tipo do parâmetro: UUID (v4)
- Exemplo: `/roast/550e8400-e29b-41d4-a716-446655440000`

## Dados Estáticos (Placeholder)

### Roast Info
- Score: 3.5/10
- Verdict: needs_serious_help
- Citação: "this code looks like it was written during a power outage... in 2005."
- Linguagem: javascript
- Linhas: 7

### Código Submetido
```javascript
function calculateSum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}
```

### Detailed Analysis (4 issues)
1. **Issue Card 1**: Descrição de problema
2. **Issue Card 2**: Descrição de problema
3. **Issue Card 3**: Descrição de problema
4. **Issue Card 4**: Descrição de problema

### Suggested Fix (Diff)
```
 function calculateSum(arr) {
   let sum = 0;
   for (let i = 0; i < arr.length; i++) {
     sum += arr[i];
   }
-  return sum;
+  return arr.reduce((a, b) => a + b, 0);
 }
```

## Componentes Necessários
1. **Navbar** - Já existente em `src/components/ui/navbar.tsx`
2. **ScoreRing** - Já existente em `src/components/ui/score-ring.tsx`
3. **Badge** - Já existente em `src/components/ui/Badge/index.tsx`
4. **CodeBlock** - Já existente em `src/components/ui/code-block.tsx`
5. **CodeEditor** (read-only) - Já existente em `src/components/ui/CodeEditor/index.tsx`
6. **DiffLine** - Já existente em `src/components/ui/DiffLine/index.tsx`
7. **Card** - Já existente em `src/components/ui/Card/index.tsx`

## Notas de Implementação
- Usar Server Components por padrão
- 'use client' apenas para componentes interativos
- Criar pasta `src/app/roast/[id]/` para a rota dinâmica
- Seguir padrões existentes de componentes em `src/components/ui/`
- Usar utilitário cn() para mesclagem de classes quando necessário
- Tailwind v4 com variáveis CSS em globals.css
- O código submetido deve ser exibido em modo somente leitura (read-only)
- O diff deve usar o componente DiffLine existente
