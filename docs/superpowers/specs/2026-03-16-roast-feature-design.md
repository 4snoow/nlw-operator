# Roast Feature Design

## Overview

Implement a feature that allows users to submit code snippets for AI-powered analysis. Users paste their code, optionally enable "roast mode" for sarcastic tone, and receive a detailed review with score, issues, and suggested fixes.

## User Flow

1. User pastes code into CodeEditor on homepage
2. User optionally toggles "roast mode" for sarcastic analysis
3. User clicks "$ roast_my_code" button
4. Loading screen appears while AI processes
5. User is redirected to `/roast/[id]` with results

## Architecture

### Stack
- **AI Provider**: OpenAI GPT-4o
- **API Layer**: tRPC mutations
- **Database**: PostgreSQL with Drizzle ORM
- **Frontend**: Next.js App Router, React 19

### Components

#### 1. tRPC Mutation (createRoast)

**File**: `src/server/api/routers/roast.ts`

```typescript
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { db } from "@/db";
import { codes } from "@/db/schema";
import { openai } from "@/lib/openai";

const createRoastInput = z.object({
  code: z.string().min(1).max(10000),
  language: z.string(),
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
      // 1. Call OpenAI API with prompt
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: getSystemPrompt(input.roastMode) },
          { role: "user", content: input.code },
        ],
        response_format: { type: "json_object" },
        temperature: input.roastMode ? 0.8 : 0.3,
      });

      // 2. Parse AI response (JSON)
      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from AI");
      }

      const roastData = JSON.parse(content) as RoastResponse;

      // 3. Save to database
      const [savedCode] = await db.insert(codes).values({
        code: input.code,
        language: input.language,
        status: roastData.verdict,
        score: roastData.score,
        roast: JSON.stringify(roastData),
        roastMode: input.roastMode,
      }).returning({ id: codes.id });

      // 4. Return ID for redirect
      return { id: savedCode.id };
    }),
});
```

**Helper**: `getSystemPrompt(roastMode: boolean)` - Returns system prompt based on mode

**Behavior**:
1. Validate input (Zod)
2. Call OpenAI API with prompt (with 60s timeout)
3. Parse AI response (JSON)
4. Save to database (`codes` table)
5. Return ID for redirect

#### 2. OpenAI Integration

**File**: `src/lib/openai.ts`

```typescript
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000, // 60s timeout
  maxRetries: 2,  // Retry on transient failures
});

interface RoastResponse {
  score: number;           // 0-10
  verdict: string;         // critical | needs_serious_help | warning | good
  quote: string;           // Short sarcastic/constructive comment
  issues: Issue[];         // Array of issues found
  diff: DiffLine[];        // Suggested code improvements
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
    return base + `\n\nBe sarcastic, witty, and merciless but still technically accurate. Make it entertaining!`;
  }
  return base + `\n\nBe constructive but honest. Focus on helping the developer improve.`;
}

export type { RoastResponse, Issue, DiffLine };
export { getSystemPrompt };

#### 3. Loading Page

**File**: `src/app/roast/loading.tsx`

```typescript
function RoastLoadingSkeleton() {
  return (
    <main className="min-h-screen bg-bg-page">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-20 py-10">
        {/* ScoreRing skeleton */}
        <div className="flex items-center gap-12 animate-pulse">
          <div className="h-32 w-32 rounded-full bg-gray-800" />
          <div className="flex flex-1 flex-col gap-4">
            <div className="h-6 w-32 rounded bg-gray-800" />
            <div className="h-8 w-full rounded bg-gray-800" />
          </div>
        </div>
        {/* More skeletons matching results page */}
      </div>
    </main>
  );
}

export default function RoastLoading() {
  return <RoastLoadingSkeleton />;
}
```

- Display loading skeleton matching result page layout
- Show progress indicator (e.g., "Analyzing your code...")

#### 4. Results Page (update)

**File**: `src/app/roast/[id]/page.tsx`

- Fetch from database by ID
- Display ScoreRing, Badge, CodeBlock, Cards, DiffLine
- Handle not-found case

#### 5. Home Page (update)

**File**: `src/components/home-client.tsx`

- Connect button to mutation
- Handle loading state
- Handle errors (show toast/message)

### Database Schema

**Table**: `codes` (already exists)

```typescript
// Already defined in schema.ts
codes = pgTable("codes", {
  id: uuid().defaultRandom().primaryKey(),
  code: text().notNull(),
  language: text().notNull(),
  status: roastStatusEnum().notNull(),  // critical | needs_serious_help | warning | good
  score: doublePrecision().notNull(),    // 0-10
  roast: text().notNull(),               // JSON string of full roast response
  roastMode: boolean().notNull().default(false),
  createdAt: timestamp().defaultNow().notNull(),
})
```

### Environment Variables

```env
OPENAI_API_KEY=sk-...
```

## Implementation Steps

### Step 1: Setup OpenAI client
- Install `openai` package: `npm install openai`
- Create `src/lib/openai.ts` with client initialization

### Step 2: Create roast router
- Create `src/server/api/routers/roast.ts`
- Implement `createRoast` mutation
- Add to `src/server/api/routers/_app.ts`

### Step 3: Create prompt system
- Define system prompt for constructive feedback
- Define system prompt for roast mode
- Create response parsing logic

### Step 4: Update home client
- Connect button to mutation
- Add loading state handling
- Add redirect logic

### Step 5: Create loading page
- Create `src/app/roast/loading.tsx`
- Design skeleton matching results page

### Step 6: Update results page
- Make `/roast/[id]` fetch from database
- Handle loading states with Suspense

### Step 7: Testing
- Test with various code samples
- Test roast mode toggle
- Test error handling

## Error Handling

1. **Empty code**: Show validation error before submission (Zod validation)
2. **API failure**: Show error toast, allow retry
3. **Timeout**: Implement request timeout (60s via OpenAI SDK), show error message
4. **Invalid JSON response**: Catch parse errors, return fallback message, log for debugging
5. **Not found**: 404 page for invalid IDs
6. **Rate limiting**: Return 429 status, show "too many requests" message

### Retry Logic
- OpenAI SDK handles retries automatically (maxRetries: 2)
- Client-side: Show retry button on failure

## Security Considerations

1. **Rate limiting**: Implement via tRPC middleware or Next.js middleware (rate-limit packages like `rate-limiter-flexible`)
2. **API key**: Stored in `.env`, never exposed to client
3. **Code sanitization**: Already handled by Shiki (output only)
4. **Input validation**: Zod schema enforces max 10000 chars, min 1 char
5. **Database**: Use parameterized queries (Drizzle handles this)

## Out of Scope (v1)

- Share functionality
- User authentication
- Code history/persistence per user
- Multiple language support beyond detection
