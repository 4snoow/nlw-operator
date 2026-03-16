# Especificação da Página de Leaderboard

## Visão Geral
- **Página**: `/leaderboard` - Shame Leaderboard
- **Tipo**: Dados estáticos, SSR para SEO
- **Objetivo**: Exibir os códigos mais "torrados" classificados por pontuação

## Estrutura do Layout

### Header/Navbar
- Altura: 56px
- Logo: ícone `>` (accent-green #10B981) + texto "devroast"
- Navegação: link "leaderboard" (página atual)
- Borda inferior: 1px sólida border-primary

### Seção Hero
- Título: `> shame_leaderboard` com prefixo `>` accent-green
- Subtítulo: "// the most roasted code on the internet"
- Linha de stats: "2,847 submissions" · "avg score: 4.2/10"
- Espaço do conteúdo: 40px

### Entradas do Leaderboard
- 5 entradas exibidas
- Cada entrada possui:
  - **Linha Meta** (48px de altura):
    - Esquerda: Rank (#1) + Score (score: 1.2)
    - Direita: Linguagem (ex: "javascript") + Linhas (ex: "3 lines")
    - Padding: 0 20px
    - Borda inferior: 1px
  - **Bloco de Código** (120px de altura):
    - Coluna de números de linha (40px de largura, borda direita)
    - Conteúdo do código com syntax highlighting

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
- Fonte: JetBrains Mono (primária), IBM Plex Mono (secundária)
- Título: 28px, peso 700
- Subtítulo: 14px, peso 400
- Stats: 12px
- Código: 12px

### Espaçamento
- Padding da página: 40px 80px
- Espaço entre seções: 40px
- Espaço entre entradas: 20px

## Dados Estáticos

### Entrada 1
- Rank: #1
- Score: 1.2
- Linguagem: javascript
- Linhas: 3
- Código:
  ```
  eval(prompt("enter code"))
  document.write(response)
  // trust the user lol
  ```

### Entrada 2
- Rank: #2
- Score: 2.8
- Linguagem: typescript
- Linhas: 3
- Código:
  ```
  const x = 1;
  export default x;
  ```

### Entrada 3
- Rank: #3
- Score: 3.1
- Linguagem: sql
- Linhas: 2
- Código:
  ```
  DROP DATABASE prod;
  -- oops
  ```

### Entrada 4
- Rank: #4
- Score: 3.5
- Linguagem: java
- Linhas: 3
- Código:
  ```
  public class Main {
    public static void main(String[] args) {
  ```

### Entrada 5
- Rank: #5
- Score: 3.9
- Linguagem: javascript
- Linhas: 3
- Código:
  ```
  function foo() {
    return 1;
  }
  ```

## Componentes Necessários
1. Componente Navbar
2. Componente LeaderboardEntry
3. Componente CodeBlock
4. SyntaxHighlighter (para coloração de código)

## Notas de Implementação
- Usar Server Components por padrão
- 'use client' apenas para componentes interativos
- Seguir padrões existentes de componentes em `src/components/ui/`
- Usar utilitário cn() para mesclagem de classes
- Tailwind v4 com variáveis CSS em globals.css