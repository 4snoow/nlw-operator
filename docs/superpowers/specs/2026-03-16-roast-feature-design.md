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

#### 1. tRPC Mutation (`createRoast`)

**File**: `src/server/api/routers/roast.ts`

```typescript
// Input
{
  code: string,      // Required, max 10000 chars
  language: string,  // Detected or selected language
  roastMode: boolean // false = constructive, true = sarcastic
}

// Output
{
  id: string // UUID for redirect
}
```

**Behavior**:
1. Validate input (Zod)
2. Call OpenAI API with prompt
3. Parse AI response (JSON)
4. Save to database (`codes` table)
5. Return ID for redirect

#### 2. OpenAI Integration

**File**: `src/lib/openai.ts`

```typescript
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
```

**Prompt Strategy**:
- Base prompt: Constructive feedback with technical issues
- Roast mode: Add sarcastic tone while maintaining technical accuracy
- Always return valid JSON

#### 3. Loading Page

**File**: `src/app/roast/loading.tsx`

- Display loading skeleton matching result page layout
- Show progress indicator (e.g., "Analyzing your code...")
- Auto-redirect or poll for completion

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
- Install `openai` package
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

1. **Empty code**: Show validation error before submission
2. **API failure**: Show error toast, allow retry
3. **Timeout**: Implement request timeout (60s), show error
4. **Invalid response**: Parse errors, fallback message
5. **Not found**: 404 page for invalid IDs

## Security Considerations

1. **Rate limiting**: Consider limiting requests per IP
2. **API key**: Never expose on client
3. **Code sanitization**: Already handled by Shiki
4. **Input validation**: Max length 10000 chars

## Out of Scope (v1)

- Share functionality
- User authentication
- Code history/persistence per user
- Multiple language support beyond detection
