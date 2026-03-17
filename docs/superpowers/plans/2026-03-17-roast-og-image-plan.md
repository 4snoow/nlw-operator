# OG Image para Roast Results - Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar geração automática de Open Graph images para páginas de resultado de roast usando Takumi.

**Architecture:** Criar opengraph-image.tsx e metadata.ts na pasta da rota dinâmica. O Next.js detecta automaticamente e usa para social previews.

**Tech Stack:** @takumi-rs/image-response, Drizzle ORM, Next.js App Router, Tailwind CSS

---

### Task 1: Instalar dependência Takumi

- [ ] **Step 1: Instalar @takumi-rs/image-response**

Run:
```bash
npm install @takumi-rs/image-response
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add @takumi-rs/image-response"
```

---

### Task 2: Configurar next.config.ts

**Files:**
- Modify: `next.config.ts:1-7`

- [ ] **Step 1: Adicionar serverExternalPackages**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@takumi-rs/core"],
};

export default nextConfig;
```

- [ ] **Step 2: Commit**

```bash
git add next.config.ts
git commit -m "config: add serverExternalPackages for Takumi"
```

---

### Task 3: Criar opengraph-image.tsx

**Files:**
- Create: `src/app/roast/[id]/opengraph-image.tsx`

- [ ] **Step 1: Criar arquivo com componente OG Image**

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

- [ ] **Step 2: Commit**

```bash
git add src/app/roast/[id]/opengraph-image.tsx
git commit -m "feat: add opengraph-image.tsx for roast results"
```

---

### Task 4: Criar metadata.ts

**Files:**
- Create: `src/app/roast/[id]/metadata.ts`

- [ ] **Step 1: Criar generateMetadata**

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

- [ ] **Step 2: Commit**

```bash
git add src/app/roast/[id]/metadata.ts
git commit -m "feat: add generateMetadata for roast results"
```

---

### Task 5: Testar geração

- [ ] **Step 1: Build do projeto**

Run:
```bash
npm run build
```

Expected: Build completa sem erros

- [ ] **Step 2: Testar visualmente (opcional)**

Acessar `http://localhost:3000/roast/[id]/opengraph-image` em desenvolvimento para verificar se a imagem é gerada corretamente.

---

### Task 6: Finalizar

- [ ] **Step 1: Verificar lint**

Run:
```bash
npm run lint
```

- [ ] **Step 2: Commit final**

```bash
git commit --allow-empty -m "chore: OG image feature complete"
```
