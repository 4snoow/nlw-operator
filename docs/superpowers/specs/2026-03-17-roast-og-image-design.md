# OG Image para Roast Results

## Visão Geral

Implementar geração automática de Open Graph images para páginas de resultado de roast usando Takumi. Quando alguém compartilha um link como `devroast.com/roast/[id]`, plataformas sociais geram uma preview visual com score, verdict e quote.

## Stack

- `@takumi-rs/image-response` — rendering JSX → imagem
- Drizzle ORM — buscar dados do banco
- Next.js App Router — opengraph-image.tsx
- Tailwind CSS — styling

## Arquitetura

### Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `src/app/roast/[id]/opengraph-image.tsx` | Rota dinâmica do Next.js para OG image |
| `src/app/roast/[id]/metadata.ts` | generateMetadata dinâmico |

### Fluxo

1. Next.js detecta `/roast/[id]` e chama `opengraph-image.tsx`
2. Componente recebe `params.id`
3. Busca dados do banco via Drizzle
4. Renderiza JSX com Takumi + Tailwind
5. Retorna imagem (PNG, 1200x630)

## Dependências

```bash
npm install @takumi-rs/image-response
```

### next.config.ts

```ts
export const config = {
  serverExternalPackages: ["@takumi-rs/core"],
};
```

## Implementação

### opengraph-image.tsx

```tsx
import { ImageResponse } from "@takumi-rs/image-response";
import { db } from "@/db";
import { codes } from "@/db/schema";

export const runtime = "nodejs";
export const alt = "DevRoast - Code Review Results";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const codeEntry = await db.query.codes.findFirst({
    where: (codes, { eq }) => eq(codes.id, id),
  });

  if (!codeEntry) {
    return new ImageResponse(<Root>Roast not found</Root>, { ...size, tailwind: false });
  }

  const roastData = JSON.parse(codeEntry.roast);
  const codeLines = codeEntry.code.split("\n").length;

  return new ImageResponse(
    <Root
      style={{ backgroundColor: "#0A0A0A" }}
      className="w-full h-full flex flex-col items-center justify-center p-16 gap-7"
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-[#10B981]" style={{ fontSize: 24, fontWeight: 900, fontFamily: "JetBrains Mono" }}>&gt;</span>
        <span className="text-[#FAFAFA]" style={{ fontSize: 20, fontFamily: "JetBrains Mono" }}>devroast</span>
      </div>

      {/* Score */}
      <div className="flex items-baseline gap-1">
        <span className="text-[#F59E0B]" style={{ fontSize: 160, fontWeight: 900 }}>{roastData.score}</span>
        <span className="text-[#737373]" style={{ fontSize: 56 }}>/10</span>
      </div>

      {/* Verdict */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
        <span className="text-[#EF4444]" style={{ fontSize: 20 }}>{codeEntry.status.replace("_", " ")}</span>
      </div>

      {/* Meta */}
      <span className="text-[#737373]" style={{ fontSize: 16, fontFamily: "JetBrains Mono" }}>
        lang: {codeEntry.language} · {codeLines} lines
      </span>

      {/* Quote */}
      <p className="text-[#FAFAFA] text-[22px] italic text-center leading-relaxed m-0" style={{ fontFamily: "IBM Plex Mono" }}>
        "{roastData.quote}"
      </p>
    </Root>,
    { ...size, tailwind: true }
  );
}

function Root({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      {children}
    </div>
  );
}
```

### metadata.ts

```tsx
import { Metadata } from "next";
import { db } from "@/db";
import { codes } from "@/db/schema";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  const codeEntry = await db.query.codes.findFirst({
    where: (codes, { eq }) => eq(codes.id, id),
  });

  if (!codeEntry) {
    return {
      title: "Roast not found | DevRoast",
    };
  }

  const roastData = JSON.parse(codeEntry.roast);

  return {
    title: `Score: ${roastData.score}/10 | DevRoast`,
    description: roastData.quote,
    openGraph: {
      title: `DevRoast - Score ${roastData.score}/10`,
      description: roastData.quote,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}
```

## Tratamento de Erros

- **Roast não encontrado**: Renderiza "Roast not found"
- **DB error**: Log e retorna placeholder
- **Parse error**: Handled pelo try/catch no page.tsx existente

## Design Reference

OG Image dimensions: 1200x630 (Twitter/LinkedIn standard)

Elementos visuais (do Pencil design):
- Logo: `> devroast` (#10B981 + #FAFAFA)
- Score: valor dinâmico (#F59E0B)
- Verdict: ponto vermelho + texto (#EF4444)
- Meta info: (#737373)
- Quote: itálico (#FAFAFA), IBM Plex Mono
- Background: #0A0A0A

## To-Dos

- [ ] Instalar `@takumi-rs/image-response`
- [ ] Configurar `serverExternalPackages` no next.config.ts
- [ ] Criar `opengraph-image.tsx`
- [ ] Criar `metadata.ts`
- [ ] Testar geração de imagem
