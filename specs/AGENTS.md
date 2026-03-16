# Specs

## Estrutura de uma Spec

Cada arquivo em `@specs/` deve seguir este formato:

```md
# Nome da Feature

## Resultados da Pesquisa

### Opções Comparadas

| Biblioteca | Tamanho | Prós | Contras |
|------------|---------|------|----------|
| ...        | ...     | ... | ...     |

### Inspiração: nome-do-projeto

- Referências visuais/funcional
- Links ou observações relevantes

## Recomendação

Abordagem escolhida com justificativa breve.

## To-Dos

- [ ] Tarefa 1
- [ ] Tarefa 2

## Decisões

- **Decisão 1**: rationale
- **Decisão 2**: rationale
```

## Regras

- Nome do arquivo: `kebab-case.md` (ex: `code-editor.md`)
- Seja conciso: máximo 50 linhas por spec
- Inclua apenas informações relevantes para implementação
- Adicione Links/Bibliotecas mencionadas na pesquisa
- To-Dos devem ser ações concretas de implementação