# Especificação do Editor de Código

## Resultados da Pesquisa

### Opções Comparadas

| Biblioteca | Tamanho | Prós | Contras |
|------------|---------|------|----------|
| **Monaco Editor** | 2-6MB | Core do VS Code, excelente IntelliSense, maduro | Pesado, sem suporte mobile, setup complexo |
| **CodeMirror 6** | ~150KB-1MB | Leve, modular, mobile-friendly | Requer mais setup, menos recursos out-of-box |
| **Shiki** | ~500KB | Já instalado, server-side rendering, temas duplos | Sem capacidade de edição, apenas highlighting |

### Inspiração: ray.so

- Feito com Next.js + TypeScript + Tailwind CSS
- Temas customizados (não do Shiki)
- 12+ estilos de fonte
- Auto-detecção de linguagens
- Seleção manual de linguagem

## Recomendação

**Usar Shiki + um wrapper de editor leve (como Prism ou simples overlay de textarea)**

Como o projeto já usa Shiki no componente `CodeBlock`, aproveite para syntax highlighting. Para edição, combine com:
- Uma textarea simples para input
- Shiki para renderizar output destacado (abordagem overlay)
- Detecção de linguagem via `shiki` ou biblioteca leve como `highlight.js`

Isso mantém o bundle pequeno e aproveita a infraestrutura existente.

## To-Dos

- [ ] Criar componente `CodeEditor` com Shiki para visualização
- [ ] Implementar auto-detecção de linguagem (prioritária)
- [ ] Adicionar dropdown de seleção manual de linguagem
- [ ] Adicionar troca de tema (light/dark + temas customizados)
- [ ] Adicionar seleção de estilo de fonte (fontes monospace)
- [ ] Criar funcionalidade de export (PNG)
- [ ] Adicionar botão de copy para código
- [ ] Adicionar tratamento mobile-responsive

## Decisões

- **Modo**: Apenas leitura (read-only) com botão de copy
- **Detecção**: Auto-detecção é prioritária sobre seleção manual
- **Export**: PNG apenas
