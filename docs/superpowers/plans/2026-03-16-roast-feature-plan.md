# Roast Feature Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow users to submit code for AI-powered analysis with optional roast mode, redirect to results page

**Architecture:** tRPC mutation calling OpenAI GPT-4o, save to PostgreSQL via Drizzle, display results at `/roast/[id]`

**Tech Stack:** Next.js 16, tRPC, Drizzle ORM, OpenAI SDK, React 19

---

## File Structure

```
src/
├── lib/
│   └── openai.ts                    # OpenAI client + prompts (NEW)
├── server/api/routers/
│   ├── roast.ts                     # createRoast mutation (NEW)
│   └── _app.ts                      # Register roastRouter (MODIFY)
├── components/
│   └── home-client.tsx              # Connect mutation (MODIFY)
└── app/
    ├── roast/
    │   └── loading.tsx              # Loading skeleton (NEW)
    └── roast/[id]/
        └── page.tsx                 # Results page (MODIFY)
```

---

## Tasks

### Task 1: Install OpenAI SDK

- [ ] **Step 1: Install package**

```bash
npm install openai
```

- [ ] **Step 2: Verify installation**

Check package.json for openai version

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install openai SDK"
```

---

### Task 2: Create OpenAI Integration

**Files:**
- Create: `src/lib/openai.ts`

- [ ] **Step 1: Write the file**

```typescript
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000, // 60s timeout
  maxRetries: 2,
});

interface RoastResponse {
  score: number;
  verdict: string;
  quote: string;
  issues: Issue[];
  diff: DiffLine[];
}

interface Issue {
  variant: "critical" | "warning" | "good";
  title: string;
  description: string;
}

interface DiffLine {
  type: "added" | "removed" | "context";
  code: string;
}

function getSystemPrompt(roastMode: boolean): string {
  const base = `You are an expert code reviewer. Analyze the following code and provide a detailed review in JSON format with exactly this structure:
{
  "score": number (0-10, 0=terrible, 10=perfect),
  "verdict": "critical" | "needs_serious_help" | "warning" | "good",
  "quote": "a short one-liner comment about the code",
  "issues": [{"variant": "critical" | "warning" | "good", "title": "issue title", "description": "detailed explanation"}],
  "diff": [{"type": "added" | "removed" | "context", "code": "line of code"}]
}`;

  if (roastMode) {
    return base + "\n\nBe sarcastic, witty, and merciless but still technically accurate. Make it entertaining!";
  }
  return base + "\n\nBe constructive but honest. Focus on helping the developer improve.";
}

export type { RoastResponse, Issue, DiffLine };
export { getSystemPrompt };
```

- [ ] **Step 2: Add .env.example entry**

Add to `.env.example`:
```
OPENAI_API_KEY=sk-...
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/openai.ts .env.example
git commit -m "feat: add openai integration with roast prompts"
```

---

### Task 3: Create Roast Router

**Files:**
- Create: `src/server/api/routers/roast.ts`

- [ ] **Step 1: Write the router**

```typescript
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { db } from "@/db";
import { codes } from "@/db/schema";
import { openai, getSystemPrompt, type RoastResponse } from "@/lib/openai";

const createRoastInput = z.object({
  code: z.string().min(1).max(10000),
  roastMode: z.boolean().default(false),
});

const createRoastOutput = z.object({
  id: z.string(),
});

export const roastRouter = router({
  createRoast: publicProcedure
    .input(createRoastInput)
    .output(createRoastOutput)
    .mutation(async ({ input }) => {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: getSystemPrompt(input.roastMode) },
            { role: "user", content: input.code },
          ],
          response_format: { type: "json_object" },
          temperature: input.roastMode ? 0.8 : 0.3,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error("No response from AI");
        }

        let roastData: RoastResponse;
        try {
          roastData = JSON.parse(content) as RoastResponse;
        } catch {
          throw new Error("Invalid response format from AI");
        }

        const [savedCode] = await db.insert(codes).values({
          code: input.code,
          language: "auto", // Auto-detected by OpenAI
          status: roastData.verdict,
          score: roastData.score,
          roast: JSON.stringify(roastData),
          roastMode: input.roastMode,
        }).returning({ id: codes.id });

        return { id: savedCode.id };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Roast failed: ${error.message}`);
        }
        throw new Error("Roast failed: Unknown error");
      }
    }),
});
```

- [ ] **Step 2: Commit**

```bash
git add src/server/api/routers/roast.ts
git commit -m "feat: add roastRouter with createRoast mutation"
```

---

### Task 4: Register Router in _app.ts

**Files:**
- Modify: `src/server/api/routers/_app.ts`

- [ ] **Step 1: Read current file**

```bash
cat src/server/api/routers/_app.ts
```

- [ ] **Step 2: Update the file**

Add import and register router:

```typescript
import { router } from '../trpc';
import { leaderboardRouter } from './leaderboard';
import { metricsRouter } from './metrics';
import { roastRouter } from './roast';

export const appRouter = router({
  leaderboard: leaderboardRouter,
  metrics: metricsRouter,
  roast: roastRouter,
});

export type AppRouter = typeof appRouter;
```

- [ ] **Step 3: Commit**

```bash
git add src/server/api/routers/_app.ts
git commit -m "feat: register roastRouter in appRouter"
```

---

### Task 5: Update Home Client

**Files:**
- Modify: `src/components/home-client.tsx`

- [ ] **Step 1: Read current file**

```bash
cat src/components/home-client.tsx
```

- [ ] **Step 2: Update imports and state**

Add `useRouter` and `trpc`:

```typescript
"use client";

import { type ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { Metrics } from "@/components/metrics";
import { Button } from "@/components/ui/Button";
import { CodeEditor } from "@/components/ui/CodeEditor";
import { Toggle } from "@/components/ui/Toggle";
import { trpc } from "@/trpc/client";

interface HomeClientProps {
  children: ReactNode;
}
```

- [ ] **Step 3: Update component logic**

Add router, mutation, and handlers:

```typescript
export function HomeClient({ children }: HomeClientProps) {
  const router = useRouter();
  const [roastMode, setRoastMode] = useState(false);
  const [code, setCode] = useState("");
  const isOverLimit = code.length > 10000;

  const createRoast = trpc.roast.createRoast.useMutation({
    onSuccess: (data) => {
      router.push(`/roast/${data.id}`);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleRoast = () => {
    if (!code.trim()) return;
    createRoast.mutate({
      code,
      roastMode,
    });
  };
```

- [ ] **Step 4: Update button**

Change button to use mutation:

```typescript
<Button
  disabled={isOverLimit || createRoast.isLoading}
  variant="default"
  onClick={handleRoast}
>
  {createRoast.isLoading ? "roasting..." : "$ roast_my_code"}
</Button>
```

- [ ] **Step 5: Commit**

```bash
git add src/components/home-client.tsx
git commit -m "feat: connect roast button to createRoast mutation"
```

---

### Task 6: Create Loading Page

**Files:**
- Create: `src/app/roast/loading.tsx`

- [ ] **Step 1: Create the file**

```typescript
function RoastLoadingSkeleton() {
  return (
    <main className="min-h-screen bg-bg-page">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-20 py-10">
        <div className="flex items-center gap-12 animate-pulse">
          <div className="h-32 w-32 rounded-full bg-gray-800" />
          <div className="flex flex-1 flex-col gap-4">
            <div className="h-6 w-32 rounded bg-gray-800" />
            <div className="h-8 w-full rounded bg-gray-800" />
          </div>
        </div>
        <div className="h-px w-full bg-border-primary" />
        <div className="h-48 w-full rounded border border-border-primary bg-gray-800 animate-pulse" />
        <div className="h-px w-full bg-border-primary" />
        <div className="grid grid-cols-2 gap-5">
          <div className="h-32 rounded border border-border-primary bg-gray-800 animate-pulse" />
          <div className="h-32 rounded border border-border-primary bg-gray-800 animate-pulse" />
        </div>
        <div className="flex items-center justify-center py-4">
          <span className="font-mono text-gray-500 text-sm">Analyzing your code...</span>
        </div>
      </div>
    </main>
  );
}

export default function RoastLoading() {
  return <RoastLoadingSkeleton />;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/roast/loading.tsx
git commit -m "feat: add roast loading skeleton"
```

---

### Task 7: Update Results Page

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Read current file and check schema**

```bash
cat src/app/roast/[id]/page.tsx
```

- [ ] **Step 2: Add trpc import and fetch data**

Add at top:
```typescript
import { notFound } from "next/navigation";
import { trpc } from "@/trpc/server";
import { db } from "@/db";
import { codes } from "@/db/schema";
```

Change page to async and fetch:
```typescript
export default async function RoastResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const codeEntry = await db.query.codes.findFirst({
    where: (codes, { eq }) => eq(codes.id, id),
  });

  if (!codeEntry) {
    notFound();
  }

  let roastData;
  try {
    roastData = JSON.parse(codeEntry.roast);
  } catch {
    notFound(); // Invalid data, treat as not found
  }
  
  // ... rest of render using codeEntry and roastData
}
```

- [ ] **Step 3: Update render to use database data**

Replace mock data references:
- `roastData.score` → `codeEntry.score`
- `roastData.verdict` → `codeEntry.status`
- etc.

- [ ] **Step 4: Add revalidation**

Add at top of file:
```typescript
export const revalidate = 0; // Dynamic - always fetch fresh
```

- [ ] **Step 5: Commit**

```bash
git add src/app/roast/\[id\]/page.tsx
git commit -m "feat: update roast results page to fetch from database"
```

---

### Task 8: Verify Build

- [ ] **Step 1: Run build**

```bash
npm run build
```

- [ ] **Step 2: Fix any errors**

- [ ] **Step 3: Commit**

```bash
git commit -m "fix: build errors if any"
```

---

### Task 9: Test Manually

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test flow**

1. Go to homepage
2. Paste some code
3. Toggle roast mode (optional)
4. Click "roast_my_code"
5. Wait for redirect
6. Verify results display

- [ ] **Step 3: Test error cases**

1. Empty code submission
2. Invalid roast ID

- [ ] **Step 4: Commit any fixes**

---

## Summary

Total tasks: 9
- Install OpenAI SDK: 3 steps
- Create OpenAI integration: 3 steps
- Create roast router: 3 steps
- Register router: 3 steps
- Update home client: 5 steps
- Create loading page: 2 steps
- Update results page: 5 steps
- Verify build: 3 steps
- Test manually: 4 steps
