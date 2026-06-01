3:I[4707,[],""]
4:I[6423,[],""]
5:I[3932,["972","static/chunks/972-2934f95bef3ea866.js","91","static/chunks/app/admin/layout-40be25c57cf30acc.js"],"AdminShell"]
6:I[2187,["185","static/chunks/app/layout-ac98af2271d99a23.js"],"AnalyticsScript"]
7:I[3745,["601","static/chunks/app/error-cf083380388af96e.js"],"default"]
8:I[73,["972","static/chunks/972-2934f95bef3ea866.js","160","static/chunks/app/not-found-33f59d0c8c9390c0.js"],"NotFoundContent"]
0:["8ydrcIh3KGigBeltj5BkL",[[["",{"children":["admin",{"children":["articles",{"children":["__PAGE__",{}]}]}]},"$undefined","$undefined",true],["",{"children":["admin",{"children":["articles",{"children":["__PAGE__",{},[["$L1","$L2",null],null],null]},[null,["$","$L3",null,{"parallelRouterKey":"children","segmentPath":["children","admin","children","articles","children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","notFoundStyles":"$undefined"}]],null]},[[null,["$","$L5",null,{"children":["$","$L3",null,{"parallelRouterKey":"children","segmentPath":["children","admin","children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","notFoundStyles":"$undefined"}]}]],null],null]},[[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/40f747fda0da2d0a.css","precedence":"next","crossOrigin":"$undefined"}]],["$","html",null,{"lang":"en","className":"scroll-smooth","suppressHydrationWarning":true,"children":[["$","head",null,{"children":[["$","link",null,{"rel":"icon","href":"/favicon.ico","sizes":"any"}],["$","link",null,{"rel":"apple-touch-icon","href":"/apple-touch-icon.png"}],["$","meta",null,{"name":"theme-color","content":"#2563eb"}],["$","meta",null,{"name":"author","content":"Abiyyu Abidiffatir Al Majid"}]]}],["$","body",null,{"className":"min-h-screen flex flex-col bg-white","children":[["$","$L6",null,{}],["$","$L3",null,{"parallelRouterKey":"children","segmentPath":["children"],"error":"$7","errorStyles":[],"errorScripts":[],"template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":["$","$L8",null,{}],"notFoundStyles":[]}]]}]]}]],null],[["$","div",null,{"className":"min-h-screen flex items-center justify-center","children":["$","div",null,{"className":"flex flex-col items-center gap-4","children":[["$","div",null,{"className":"w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"}],["$","p",null,{"className":"text-sm text-gray-500","children":"Loading..."}]]}]}],[],[]]],["$L9",null]]]]
9:[["$","meta","0",{"name":"viewport","content":"width=device-width, initial-scale=1"}],["$","meta","1",{"charSet":"utf-8"}],["$","title","2",{"children":"abyte panel"}]]
1:null
a:I[2972,["972","static/chunks/972-2934f95bef3ea866.js","985","static/chunks/app/admin/articles/page-374c19c1d758f4cc.js"],""]
b:I[2022,["972","static/chunks/972-2934f95bef3ea866.js","985","static/chunks/app/admin/articles/page-374c19c1d758f4cc.js"],"ArticleListPreviewButton"]
d:I[9109,["972","static/chunks/972-2934f95bef3ea866.js","985","static/chunks/app/admin/articles/page-374c19c1d758f4cc.js"],"DeleteArticleButton"]
c:T10a1,React Server Components (RSC) represent one of the most significant shifts in how we think about rendering in React applications. Introduced as the default rendering model in Next.js 13+ and refined in Next.js 14, Server Components let you move rendering work to the server while keeping the interactive parts on the client.

## What Are React Server Components?

A Server Component runs exclusively on the server. It never ships JavaScript to the browser, which means:

- **Zero client-side bundle cost** -- the component logic, dependencies, and data fetching stay on the server.
- **Direct access to backend resources** -- you can query databases, read files, or call internal APIs without exposing them to the client.
- **Automatic code splitting** -- client components imported inside a server component are automatically split into their own bundles.

```tsx
// app/articles/page.tsx  --  this is a Server Component by default
import { getArticles } from '@/lib/db'

export default async function ArticlesPage() {
  const articles = await getArticles() // direct DB call, no API layer needed

  return (
    <main>
      <h1>Latest Articles</h1>
      {articles.map((article) => (
        <article key={article.id}>
          <h2>{article.title}</h2>
          <p>{article.summary}</p>
        </article>
      ))}
    </main>
  )
}
```

## Server vs. Client Components

In Next.js 14, every component inside the `app/` directory is a **Server Component by default**. You opt into client rendering with the `"use client"` directive at the top of a file:

```tsx
'use client'

import { useState } from 'react'

export function LikeButton({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount)

  return (
    <button onClick={() => setCount((c) => c + 1)}>
      {count} Likes
    </button>
  )
}
```

A good mental model: **keep as much as possible on the server**, and only push interactivity to the client when you need hooks like `useState`, `useEffect`, or browser APIs.

## The Composition Pattern

The real power of RSC comes from composition. A server component can import and render a client component, passing serializable props:

```tsx
// Server Component
import { LikeButton } from './LikeButton'
import { getArticle } from '@/lib/db'

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id)

  return (
    <article>
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: article.html }} />
      <LikeButton articleId={article.id} initialCount={article.likes} />
    </article>
  )
}
```

Here, `ArticlePage` runs on the server and renders the article content. The `LikeButton` is a client component that handles the interactive "like" logic. The boundary is clean: data fetching and static content on the server, interactivity on the client.

## When to Use Which?

| Use Case | Component Type |
|---|---|
| Fetching data from a database or API | Server |
| Displaying static or read-only content | Server |
| Using `useState`, `useReducer`, `useEffect` | Client |
| Using browser-only APIs (localStorage, geolocation) | Client |
| Handling user events (clicks, form inputs) | Client |
| Passing non-serializable props (functions, class instances) | Client |

## Performance Benefits

Switching to Server Components in a typical Next.js app can reduce the client-side JavaScript bundle by **30-50%**. The main wins come from:

1. **Smaller bundles** -- heavy libraries like `marked`, `prisma`, or date formatters stay on the server.
2. **Faster initial load** -- the server sends rendered HTML, not a JavaScript framework that then renders HTML.
3. **Reduced waterfall** -- data fetching happens server-side in a single round trip, eliminating client-side loading spinners.

## Key Takeaways

- Server Components are the **default** in the Next.js 14 App Router. You only add `"use client"` when you need client interactivity.
- Use the **composition pattern**: let server components own data fetching and layout, and delegate interactive leaves to client components.
- Always measure the impact -- use the Next.js build output (`next build`) to verify your bundle sizes after migrating components.e:T1168,Microservices architecture has become the go-to approach for building large-scale, independently deployable services. But moving from a monolith to microservices is not just a technical migration -- it is a fundamental shift in how teams own, build, and operate software.

## Service Decomposition

The hardest part of microservices is deciding where to draw the boundaries. A common mistake is splitting services by technical layer (e.g., "database service", "API service") rather than by business capability.

**Use Domain-Driven Design (DDD)** to identify bounded contexts. Each microservice should map to a single business domain:

```
E-commerce example:
├── Order Service        → handles order lifecycle
├── Inventory Service    → manages stock levels
├── Payment Service      → processes transactions
├── User Service         → authentication and profiles
└── Notification Service → emails, push, SMS
```

Each service owns its data. There is no shared database -- if Order Service needs inventory data, it calls the Inventory Service API or subscribes to its events.

## Communication Patterns

Microservices communicate through two primary patterns:

### Synchronous (Request/Response)
Best for queries where you need an immediate answer.

```typescript
// Order Service calling Inventory Service
async function checkStock(productId: string): Promise<boolean> {
  const response = await fetch('http://inventory-svc/api/stock/' + productId)
  const data = await response.json()
  return data.available > 0
}
```

**Pros:** Simple, familiar, real-time.
**Cons:** Creates coupling, cascading failures if the downstream service is slow or down.

### Asynchronous (Event-Driven)
Best for commands and workflows where eventual consistency is acceptable.

```typescript
// Order Service publishes an event
await messageBroker.publish('order.created', {
  orderId: '12345',
  items: [{ productId: 'abc', quantity: 2 }],
  customerId: 'user-789',
})

// Inventory Service subscribes and reserves stock
messageBroker.subscribe('order.created', async (event) => {
  await reserveStock(event.items)
  await messageBroker.publish('inventory.reserved', { orderId: event.orderId })
})
```

**Pros:** Loose coupling, resilient to failures, enables replay.
**Cons:** More complex, harder to debug, eventual consistency.

## Data Management

Each service must own its data store. This is non-negotiable -- sharing a database creates tight coupling that defeats the purpose of microservices.

Common patterns for cross-service data needs:

1. **API Composition** -- a gateway or orchestrator queries multiple services and aggregates results.
2. **CQRS (Command Query Responsibility Segregation)** -- separate write and read models, with the read model built from events.
3. **Event Sourcing** -- store state as a sequence of events rather than current state, enabling full reconstruction.

```
Order Service (PostgreSQL)       → owns order data
Inventory Service (MongoDB)      → owns stock data
Payment Service (PostgreSQL)     → owns transaction data
Search Service (Elasticsearch)   → builds search index from events
```

## Deployment Strategies

Each service should be independently deployable. Containerization with Docker and orchestration with Kubernetes is the industry standard:

```yaml
# kubernetes/order-service.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: order-service
  template:
    spec:
      containers:
        - name: order-service
          image: registry.example.com/order-service:1.4.2
          ports:
            - containerPort: 3000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: order-db-credentials
                  key: url
```

Key practices:
- **Blue/Green deployments** for zero-downtime releases.
- **Canary releases** to roll out changes to a small percentage of traffic first.
- **Feature flags** to decouple deployment from release.

## Key Takeaways

- Decompose by **business capability**, not by technical layer.
- Prefer **asynchronous, event-driven** communication for inter-service workflows.
- Each service must **own its data** -- no shared databases.
- Invest early in **observability** (distributed tracing, centralized logging, metrics) -- debugging microservices without it is nearly impossible.f:T109f,GitHub Actions has become one of the most popular CI/CD platforms thanks to its tight integration with GitHub, generous free tier, and a massive marketplace of reusable actions. But a poorly configured pipeline can be slow, flaky, and hard to maintain. Here is how to build one that is fast and reliable.

## Workflow Structure

A well-organized workflow separates concerns into distinct jobs. Here is a typical Node.js CI pipeline:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test -- --coverage
      - uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
```

Notice the `concurrency` block -- it cancels in-progress runs when a new commit is pushed to the same branch, saving CI minutes.

## Caching Dependencies

Caching is the single biggest performance win. The `setup-node` action supports caching for npm, yarn, and pnpm out of the box:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: 'pnpm'  # automatically caches ~/.pnpm-store
```

For more granular control, use `actions/cache`:

```yaml
- uses: actions/cache@v4
  with:
    path: |
      ~/.pnpm-store
      node_modules/.cache
    key: deps-${{ runner.os }}-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      deps-${{ runner.os }}-
```

## Secrets Management

Never hardcode secrets. Use GitHub encrypted secrets and pass them as environment variables:

```yaml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  API_KEY: ${{ secrets.API_KEY }}

steps:
  - run: pnpm test
    env:
      # Only expose secrets to steps that need them
      TEST_DB_URL: ${{ secrets.TEST_DATABASE_URL }}
```

Best practices:
- Use **Environment-scoped secrets** for production credentials (requires approval gates).
- Rotate secrets regularly.
- Use `GITHUB_TOKEN` for GitHub API operations -- it is automatically provided and scoped to the repository.

## Matrix Builds

Test across multiple versions or platforms in parallel:

```yaml
test:
  runs-on: ubuntu-latest
  strategy:
    matrix:
      node-version: [18, 20, 22]
      database: [postgres, mysql]
    fail-fast: false  # don't cancel other jobs if one fails
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'pnpm'
    - run: pnpm install --frozen-lockfile
    - run: pnpm test
      env:
        DB_TYPE: ${{ matrix.database }}
```

## Deployment Strategies

For deployments, use GitHub Environments to add approval gates and protection rules:

```yaml
deploy-production:
  needs: [build]
  runs-on: ubuntu-latest
  environment:
    name: production
    url: https://example.com
  steps:
    - uses: actions/checkout@v4
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-args: '--prod'
```

## Key Takeaways

- Use `concurrency` to cancel redundant runs and save CI minutes.
- Always cache dependencies -- it can cut install times from minutes to seconds.
- Scope secrets tightly: prefer environment-scoped secrets for production credentials.
- Use `matrix` for cross-platform/cross-version testing, but keep the matrix reasonable to avoid combinatorial explosion.
- Leverage GitHub Environments for deployment approval gates.10:T1501,Large Language Models (LLMs) are powerful, but they have a critical limitation: their knowledge is frozen at training time. Retrieval-Augmented Generation (RAG) solves this by grounding LLM responses in your own data. In this article, we will build a complete RAG pipeline from scratch.

## What Is RAG?

RAG is a pattern where you:

1. **Retrieve** relevant documents from a knowledge base based on the user's query.
2. **Augment** the LLM prompt with those retrieved documents as context.
3. **Generate** a response that is grounded in the retrieved information.

This eliminates hallucination for domain-specific questions and keeps your AI up to date without retraining.

## Architecture Overview

A typical RAG pipeline has two phases:

```
Indexing Phase (offline):
  Documents → Chunking → Embedding → Vector Store

Query Phase (online):
  User Query → Embedding → Similarity Search → Context Assembly → LLM → Response
```

## Document Ingestion and Chunking

First, load your documents and split them into manageable chunks. LangChain provides document loaders for PDFs, websites, Notion, and more:

```typescript
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'

// Load a PDF document
const loader = new PDFLoader('./knowledge-base/product-docs.pdf')
const docs = await loader.load()

// Split into chunks of ~1000 characters with 200 character overlap
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ['\n\n', '\n', '. ', ' ', ''],
})
const chunks = await splitter.splitDocuments(docs)

console.log(`Split ${docs.length} document(s) into ${chunks.length} chunks`)
```

The `chunkOverlap` parameter is critical -- it prevents context from being lost at chunk boundaries.

## Embedding and Vector Storage

Next, convert each chunk into a vector embedding and store it in a vector database. Here we use Pinecone, but the pattern is similar for Weaviate, Qdrant, or Chroma:

```typescript
import { OpenAIEmbeddings } from '@langchain/openai'
import { PineconeStore } from '@langchain/pinecone'
import { Pinecone } from '@pinecone-database/pinecone'

const pinecone = new Pinecone()
const index = pinecone.Index('abyte-knowledge-base')

const embeddings = new OpenAIEmbeddings({
  modelName: 'text-embedding-3-small',
  dimensions: 1536,
})

// Store chunks in Pinecone
const vectorStore = await PineconeStore.fromDocuments(chunks, embeddings, {
  pineconeIndex: index,
  namespace: 'product-docs',
})
```

Each chunk is converted into a 1536-dimensional vector. When a query comes in, we embed the query and find the most similar vectors using cosine similarity.

## Retrieval

At query time, embed the user's question and retrieve the top-K most relevant chunks:

```typescript
const retriever = vectorStore.asRetriever({
  k: 4,           // return top 4 chunks
  filter: {       // optional metadata filter
    source: 'product-docs',
  },
})

const relevantDocs = await retriever.invoke('How do I configure rate limiting?')

console.log(relevantDocs.map((doc) => doc.pageContent))
```

## Generation with Context

Finally, assemble the retrieved context into a prompt and call the LLM:

```typescript
import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'

const model = new ChatOpenAI({ modelName: 'gpt-4o', temperature: 0 })

const prompt = PromptTemplate.fromTemplate(`
You are a technical support assistant for abyte.
Answer the question based ONLY on the following context.
If the context doesn't contain the answer, say "I don't have enough information to answer that."

Context:
{context}

Question: {question}

Answer:`)

const chain = prompt.pipe(model).pipe(new StringOutputParser())

const response = await chain.invoke({
  context: relevantDocs.map((d) => d.pageContent).join('\n\n---\n\n'),
  question: 'How do I configure rate limiting?',
})

console.log(response)
```

## Improving Retrieval Quality

Raw similarity search is a starting point. To improve results:

- **Hybrid search** -- combine vector similarity with keyword (BM25) search. Pinecone and Weaviate support this natively.
- **Re-ranking** -- use a cross-encoder model (e.g., Cohere Rerank) to re-score retrieved chunks before passing them to the LLM.
- **Metadata filtering** -- filter by document type, date, or category before doing similarity search.
- **Query transformation** -- use the LLM to rewrite ambiguous queries into clearer search queries.

```typescript
// Example: Multi-query retrieval
import { MultiQueryRetriever } from 'langchain/retrievers/multi_query'

const multiRetriever = MultiQueryRetriever.fromLLM({
  llm: model,
  retriever: vectorStore.asRetriever({ k: 4 }),
  queryCount: 3, // generate 3 variations of the query
})
```

## Key Takeaways

- RAG grounds LLM responses in your own data, reducing hallucination and keeping answers current.
- **Chunk size and overlap** matter enormously -- experiment with different values for your domain.
- Use **hybrid search** and **re-ranking** to improve retrieval quality beyond basic vector similarity.
- Always include a **"I don't know"** fallback in your prompt to handle cases where the context does not contain the answer.11:T10de,Most engineers think code review is about finding bugs. While that is one benefit, the real value of code review lies elsewhere: knowledge transfer, design consistency, and team growth. After years of reviewing thousands of pull requests, here is what I have learned about doing it well.

## The Purpose of Code Review

Code review serves multiple purposes, in order of importance:

1. **Knowledge sharing** -- the reviewer learns about changes they did not write, and the author learns from feedback.
2. **Design consistency** -- ensures the codebase follows agreed-upon patterns.
3. **Catching issues early** -- bugs, edge cases, and performance problems.
4. **Mentoring** -- a place for more experienced engineers to guide less experienced ones.

If your reviews are only focused on finding bugs, you are missing most of the value.

## What to Look For

When reviewing code, I use a layered approach:

### Layer 1: Intent and Design
- Does the PR description clearly explain **why** this change is needed?
- Is the approach sound? Would a different pattern be simpler or more maintainable?
- Does it fit the existing architecture, or does it introduce inconsistency?

### Layer 2: Correctness
- Are edge cases handled (null values, empty arrays, concurrent access)?
- Are error paths handled gracefully?
- Are there race conditions or potential deadlocks?

### Layer 3: Readability and Maintainability
- Are variable and function names descriptive?
- Is the code self-documenting, or does it need more comments?
- Are there any clever tricks that should be replaced with clearer code?

### Layer 4: Performance and Security
- Are there N+1 queries, unnecessary allocations, or missing indexes?
- Is user input validated and sanitized?
- Are secrets or credentials exposed?

## How to Give Good Feedback

The way you phrase feedback matters as much as the feedback itself.

**Bad:** "This is wrong."

**Good:** "This could fail when the array is empty. Consider adding a guard clause: `if (!items.length) return []`"

Principles for effective feedback:

- **Ask questions instead of making demands.** "What happens if this is null?" is more effective than "Add a null check here."
- **Explain the why.** Don't just say what to change -- explain the reasoning.
- **Distinguish severity.** Use prefixes to make your intent clear:
  - **"Nit:"** -- style preference, optional to address.
  - **"Suggestion:"** -- would improve the code but is not blocking.
  - **"Issue:"** -- something that should be fixed before merging.
  - **"Blocker:"** -- critical problem that must be addressed.
- **Praise good code.** When you see a clever solution or clean refactor, say so. Positive reinforcement matters.

## Automate the Boring Stuff

A great code review process automates everything that does not require human judgment:

```yaml
# .github/workflows/pr-check.yml
- name: Lint
  run: pnpm lint

- name: Type Check
  run: pnpm tsc --noEmit

- name: Test
  run: pnpm test

- name: Format Check
  run: pnpm prettier --check .
```

Use tools like:
- **ESLint/Prettier** for style and formatting.
- **TypeScript** strict mode for type safety.
- **Danger.js** for automated PR checks (missing tests, large PRs, changelog updates).
- **SonarQube** or **Codecov** for code coverage thresholds.

This way, human reviewers can focus on design, logic, and architecture -- the things that actually require judgment.

## For the Author: Make Reviews Easy

If you want fast, thorough reviews, make the reviewer's job easy:

- **Keep PRs small** -- under 400 lines of changes. Large PRs get rubber-stamped.
- **Write a clear PR description** -- explain the problem, the approach, and any trade-offs.
- **Self-review first** -- read your own diff before requesting reviews. You will catch obvious issues.
- **Respond to every comment** -- even if just to say "Done" or explain your reasoning.

## Key Takeaways

- Code review is primarily about **knowledge sharing and design**, not just bug hunting.
- Use **layered review** -- start with intent/design, then correctness, then readability.
- **Phrase feedback as questions** and explain the reasoning behind suggestions.
- **Automate** formatting, linting, and type checking so human reviewers focus on what matters.
- As a PR author, keep your changes small and your descriptions clear.12:T1444,TypeScript's type system is remarkably powerful, but most codebases barely scratch the surface. In this article, we will explore advanced patterns that make production TypeScript code safer, more expressive, and easier to refactor.

## Discriminated Unions

Discriminated unions are the single most useful TypeScript pattern for modeling state. Instead of using optional fields or type assertions, you give each variant a literal discriminant:

```typescript
// Instead of this (fragile):
type ApiResponse<T> = {
  data?: T
  error?: string
  loading?: boolean
}

// Do this (type-safe):
type ApiResponse<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

function handleResponse<T>(response: ApiResponse<T>) {
  switch (response.status) {
    case 'loading':
      return <Spinner />
    case 'success':
      return <DataView data={response.data} />
    case 'error':
      return <ErrorMessage message={response.error} />
  }
}
```

The compiler ensures you handle every case. Add a new variant? You get a compile error if you forget to handle it. No more `undefined is not a function` at runtime.

## Template Literal Types

Template literal types let you build string types from other types, which is incredibly useful for APIs, CSS, and event systems:

```typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type ApiVersion = 'v1' | 'v2'

// Generates: '/api/v1/users' | '/api/v2/users' | '/api/v1/posts' | ...
type ApiEndpoint = `/api/${ApiVersion}/${'users' | 'posts' | 'comments'}`

// Event handler naming convention
type EventName = 'click' | 'hover' | 'focus'
type EventHandler = `on${Capitalize<EventName>}`
// Result: 'onClick' | 'onHover' | 'onFocus'

// Type-safe CSS units
type CSSUnit = 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw'
type CSSValue = `${number}${CSSUnit}`

const width: CSSValue = '100px'  // valid
const bad: CSSValue = '100'      // error: missing unit
```

## Conditional Types

Conditional types let you create types that depend on other types. They are the foundation of many built-in utility types:

```typescript
// Basic conditional type
type IsString<T> = T extends string ? true : false

type A = IsString<'hello'> // true
type B = IsString<42>      // false

// Extract the return type of async functions
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

type Result = UnwrapPromise<Promise<string>> // string
type Plain = UnwrapPromise<number>            // number

// Practical example: extract props from a React component
type PropsOf<C> = C extends React.ComponentType<infer P> ? P : never

type ButtonProps = PropsOf<typeof Button> // extracts Button's prop type
```

## Practical Utility Types

Here are utility types I use constantly in production code:

```typescript
// Make specific keys required (opposite of Partial)
type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

type User = {
  id?: string
  name?: string
  email?: string
}

// CreateUser requires 'name' and 'email', but 'id' stays optional
type CreateUser = RequireKeys<User, 'name' | 'email'>

// Deep readonly -- prevents mutation at any nesting level
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

type Config = DeepReadonly<{
  database: {
    host: string
    port: number
    credentials: { user: string; pass: string }
  }
}>

// This errors: cannot mutate nested objects
// config.database.port = 3000

// Exhaustive switch helper
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`)
}

// Use with discriminated unions
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'rectangle':
      return shape.width * shape.height
    default:
      return assertNever(shape) // compile error if a case is missing
  }
}
```

## Branded Types

TypeScript uses structural typing, which means `string` and `string` are interchangeable. Branded types let you create nominally-distinct types:

```typescript
type Brand<T, B extends string> = T & { readonly __brand: B }

type UserId = Brand<string, 'UserId'>
type OrderId = Brand<string, 'OrderId'>

function getUser(id: UserId) { /* ... */ }
function getOrder(id: OrderId) { /* ... */ }

const userId = 'user-123' as UserId
const orderId = 'order-456' as OrderId

getUser(userId)   // valid
getUser(orderId)  // error: OrderId is not assignable to UserId
```

This prevents accidentally passing an order ID where a user ID is expected -- a bug that structural typing alone cannot catch.

## Key Takeaways

- **Discriminated unions** replace optional fields and type assertions for modeling state.
- **Template literal types** give you type-safe strings for APIs, CSS, and naming conventions.
- **Conditional types** unlock powerful type transformations and inference.
- **Branded types** add nominal typing on top of TypeScript's structural system, preventing ID mix-ups.
- These patterns pay for themselves in reduced runtime bugs and safer refactoring.16:T10a1,React Server Components (RSC) represent one of the most significant shifts in how we think about rendering in React applications. Introduced as the default rendering model in Next.js 13+ and refined in Next.js 14, Server Components let you move rendering work to the server while keeping the interactive parts on the client.

## What Are React Server Components?

A Server Component runs exclusively on the server. It never ships JavaScript to the browser, which means:

- **Zero client-side bundle cost** -- the component logic, dependencies, and data fetching stay on the server.
- **Direct access to backend resources** -- you can query databases, read files, or call internal APIs without exposing them to the client.
- **Automatic code splitting** -- client components imported inside a server component are automatically split into their own bundles.

```tsx
// app/articles/page.tsx  --  this is a Server Component by default
import { getArticles } from '@/lib/db'

export default async function ArticlesPage() {
  const articles = await getArticles() // direct DB call, no API layer needed

  return (
    <main>
      <h1>Latest Articles</h1>
      {articles.map((article) => (
        <article key={article.id}>
          <h2>{article.title}</h2>
          <p>{article.summary}</p>
        </article>
      ))}
    </main>
  )
}
```

## Server vs. Client Components

In Next.js 14, every component inside the `app/` directory is a **Server Component by default**. You opt into client rendering with the `"use client"` directive at the top of a file:

```tsx
'use client'

import { useState } from 'react'

export function LikeButton({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount)

  return (
    <button onClick={() => setCount((c) => c + 1)}>
      {count} Likes
    </button>
  )
}
```

A good mental model: **keep as much as possible on the server**, and only push interactivity to the client when you need hooks like `useState`, `useEffect`, or browser APIs.

## The Composition Pattern

The real power of RSC comes from composition. A server component can import and render a client component, passing serializable props:

```tsx
// Server Component
import { LikeButton } from './LikeButton'
import { getArticle } from '@/lib/db'

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id)

  return (
    <article>
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: article.html }} />
      <LikeButton articleId={article.id} initialCount={article.likes} />
    </article>
  )
}
```

Here, `ArticlePage` runs on the server and renders the article content. The `LikeButton` is a client component that handles the interactive "like" logic. The boundary is clean: data fetching and static content on the server, interactivity on the client.

## When to Use Which?

| Use Case | Component Type |
|---|---|
| Fetching data from a database or API | Server |
| Displaying static or read-only content | Server |
| Using `useState`, `useReducer`, `useEffect` | Client |
| Using browser-only APIs (localStorage, geolocation) | Client |
| Handling user events (clicks, form inputs) | Client |
| Passing non-serializable props (functions, class instances) | Client |

## Performance Benefits

Switching to Server Components in a typical Next.js app can reduce the client-side JavaScript bundle by **30-50%**. The main wins come from:

1. **Smaller bundles** -- heavy libraries like `marked`, `prisma`, or date formatters stay on the server.
2. **Faster initial load** -- the server sends rendered HTML, not a JavaScript framework that then renders HTML.
3. **Reduced waterfall** -- data fetching happens server-side in a single round trip, eliminating client-side loading spinners.

## Key Takeaways

- Server Components are the **default** in the Next.js 14 App Router. You only add `"use client"` when you need client interactivity.
- Use the **composition pattern**: let server components own data fetching and layout, and delegate interactive leaves to client components.
- Always measure the impact -- use the Next.js build output (`next build`) to verify your bundle sizes after migrating components.15:{"id":"ca61dbb4-629c-4043-8ba0-6e5c944b5695","articleId":"7b102660-7fc5-4de2-b84e-388ecaee3bf6","languageCode":"en","title":"Mastering React Server Components in Next.js 14","description":"A deep dive into React Server Components in Next.js 14 -- understand how they work, when to use them, and how to combine server and client components for maximum performance.","content":"$16","coverImageAlt":"Mastering React Server Components in Next.js 14","readingTime":"12 min read"}
14:["$15"]
19:{"id":"306f6aee-d3db-4aca-a9e3-094a5ddb421d","categoryId":"7929b15f-8f31-4f83-ac48-a7798d93d649","languageCode":"en","name":"Web Development","description":"Modern web development techniques, frameworks, and best practices for building fast, accessible applications."}
18:["$19"]
17:{"id":"7929b15f-8f31-4f83-ac48-a7798d93d649","slug":"web-development","createdAt":"$D2026-05-29T13:15:55.476Z","updatedAt":"$D2026-05-29T13:15:55.476Z","translations":"$18"}
1c:{"id":"5f788196-f996-4fbc-9a1f-24deaf6e9956","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","languageCode":"en","role":"Software Engineer","bio":"Software Engineer passionate about building scalable web applications and sharing knowledge about modern web development, system design, and emerging technologies."}
1b:["$1c"]
1a:{"id":"e69c2918-f7d4-46e4-9335-d61b267a676e","name":"Abiyyu Abidiffatir Al Majid","avatar":"/images/author-avatar.jpg","url":"https://a2mdev.site","createdAt":"$D2026-05-29T13:15:55.248Z","updatedAt":"$D2026-05-29T15:02:35.676Z","translations":"$1b"}
13:{"id":"7b102660-7fc5-4de2-b84e-388ecaee3bf6","slug":"mastering-server-components-nextjs-14","coverImage":"/uploads/1780240471315-mzhf5c.png","featured":true,"datePublished":"$D2024-06-15T00:00:00.000Z","dateModified":"$D2026-05-31T15:14:36.916Z","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","categoryId":"7929b15f-8f31-4f83-ac48-a7798d93d649","translations":"$14","category":"$17","author":"$1a"}
20:T1168,Microservices architecture has become the go-to approach for building large-scale, independently deployable services. But moving from a monolith to microservices is not just a technical migration -- it is a fundamental shift in how teams own, build, and operate software.

## Service Decomposition

The hardest part of microservices is deciding where to draw the boundaries. A common mistake is splitting services by technical layer (e.g., "database service", "API service") rather than by business capability.

**Use Domain-Driven Design (DDD)** to identify bounded contexts. Each microservice should map to a single business domain:

```
E-commerce example:
├── Order Service        → handles order lifecycle
├── Inventory Service    → manages stock levels
├── Payment Service      → processes transactions
├── User Service         → authentication and profiles
└── Notification Service → emails, push, SMS
```

Each service owns its data. There is no shared database -- if Order Service needs inventory data, it calls the Inventory Service API or subscribes to its events.

## Communication Patterns

Microservices communicate through two primary patterns:

### Synchronous (Request/Response)
Best for queries where you need an immediate answer.

```typescript
// Order Service calling Inventory Service
async function checkStock(productId: string): Promise<boolean> {
  const response = await fetch('http://inventory-svc/api/stock/' + productId)
  const data = await response.json()
  return data.available > 0
}
```

**Pros:** Simple, familiar, real-time.
**Cons:** Creates coupling, cascading failures if the downstream service is slow or down.

### Asynchronous (Event-Driven)
Best for commands and workflows where eventual consistency is acceptable.

```typescript
// Order Service publishes an event
await messageBroker.publish('order.created', {
  orderId: '12345',
  items: [{ productId: 'abc', quantity: 2 }],
  customerId: 'user-789',
})

// Inventory Service subscribes and reserves stock
messageBroker.subscribe('order.created', async (event) => {
  await reserveStock(event.items)
  await messageBroker.publish('inventory.reserved', { orderId: event.orderId })
})
```

**Pros:** Loose coupling, resilient to failures, enables replay.
**Cons:** More complex, harder to debug, eventual consistency.

## Data Management

Each service must own its data store. This is non-negotiable -- sharing a database creates tight coupling that defeats the purpose of microservices.

Common patterns for cross-service data needs:

1. **API Composition** -- a gateway or orchestrator queries multiple services and aggregates results.
2. **CQRS (Command Query Responsibility Segregation)** -- separate write and read models, with the read model built from events.
3. **Event Sourcing** -- store state as a sequence of events rather than current state, enabling full reconstruction.

```
Order Service (PostgreSQL)       → owns order data
Inventory Service (MongoDB)      → owns stock data
Payment Service (PostgreSQL)     → owns transaction data
Search Service (Elasticsearch)   → builds search index from events
```

## Deployment Strategies

Each service should be independently deployable. Containerization with Docker and orchestration with Kubernetes is the industry standard:

```yaml
# kubernetes/order-service.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: order-service
  template:
    spec:
      containers:
        - name: order-service
          image: registry.example.com/order-service:1.4.2
          ports:
            - containerPort: 3000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: order-db-credentials
                  key: url
```

Key practices:
- **Blue/Green deployments** for zero-downtime releases.
- **Canary releases** to roll out changes to a small percentage of traffic first.
- **Feature flags** to decouple deployment from release.

## Key Takeaways

- Decompose by **business capability**, not by technical layer.
- Prefer **asynchronous, event-driven** communication for inter-service workflows.
- Each service must **own its data** -- no shared databases.
- Invest early in **observability** (distributed tracing, centralized logging, metrics) -- debugging microservices without it is nearly impossible.1f:{"id":"e97ab27c-3e44-47c5-bd74-a56756b3fe68","articleId":"b14e32aa-3d77-4c3e-b894-637e1c44d356","languageCode":"en","title":"Designing Scalable Microservices Architecture","description":"Learn how to decompose monoliths into microservices, choose the right communication patterns, manage data effectively, and deploy services at scale.","content":"$20","coverImageAlt":"Designing Scalable Microservices Architecture","readingTime":"14 min read"}
1e:["$1f"]
23:{"id":"d294b147-3140-4025-ba9d-b1c485beecf3","categoryId":"b816b58b-8cb5-41df-b257-cdf4e672b248","languageCode":"en","name":"System Design","description":"Architecture patterns, scalability strategies, and distributed systems design for large-scale applications."}
22:["$23"]
21:{"id":"b816b58b-8cb5-41df-b257-cdf4e672b248","slug":"system-design","createdAt":"$D2026-05-29T13:15:55.714Z","updatedAt":"$D2026-05-29T13:15:55.714Z","translations":"$22"}
26:{"id":"5f788196-f996-4fbc-9a1f-24deaf6e9956","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","languageCode":"en","role":"Software Engineer","bio":"Software Engineer passionate about building scalable web applications and sharing knowledge about modern web development, system design, and emerging technologies."}
25:["$26"]
24:{"id":"e69c2918-f7d4-46e4-9335-d61b267a676e","name":"Abiyyu Abidiffatir Al Majid","avatar":"/images/author-avatar.jpg","url":"https://a2mdev.site","createdAt":"$D2026-05-29T13:15:55.248Z","updatedAt":"$D2026-05-29T15:02:35.676Z","translations":"$25"}
1d:{"id":"b14e32aa-3d77-4c3e-b894-637e1c44d356","slug":"designing-scalable-microservices","coverImage":"/uploads/1780242667777-s6nlaq.png","featured":false,"datePublished":"$D2024-05-10T00:00:00.000Z","dateModified":"$D2026-05-31T15:51:11.258Z","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","categoryId":"b816b58b-8cb5-41df-b257-cdf4e672b248","translations":"$1e","category":"$21","author":"$24"}
2a:T109f,GitHub Actions has become one of the most popular CI/CD platforms thanks to its tight integration with GitHub, generous free tier, and a massive marketplace of reusable actions. But a poorly configured pipeline can be slow, flaky, and hard to maintain. Here is how to build one that is fast and reliable.

## Workflow Structure

A well-organized workflow separates concerns into distinct jobs. Here is a typical Node.js CI pipeline:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test -- --coverage
      - uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
```

Notice the `concurrency` block -- it cancels in-progress runs when a new commit is pushed to the same branch, saving CI minutes.

## Caching Dependencies

Caching is the single biggest performance win. The `setup-node` action supports caching for npm, yarn, and pnpm out of the box:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: 'pnpm'  # automatically caches ~/.pnpm-store
```

For more granular control, use `actions/cache`:

```yaml
- uses: actions/cache@v4
  with:
    path: |
      ~/.pnpm-store
      node_modules/.cache
    key: deps-${{ runner.os }}-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      deps-${{ runner.os }}-
```

## Secrets Management

Never hardcode secrets. Use GitHub encrypted secrets and pass them as environment variables:

```yaml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  API_KEY: ${{ secrets.API_KEY }}

steps:
  - run: pnpm test
    env:
      # Only expose secrets to steps that need them
      TEST_DB_URL: ${{ secrets.TEST_DATABASE_URL }}
```

Best practices:
- Use **Environment-scoped secrets** for production credentials (requires approval gates).
- Rotate secrets regularly.
- Use `GITHUB_TOKEN` for GitHub API operations -- it is automatically provided and scoped to the repository.

## Matrix Builds

Test across multiple versions or platforms in parallel:

```yaml
test:
  runs-on: ubuntu-latest
  strategy:
    matrix:
      node-version: [18, 20, 22]
      database: [postgres, mysql]
    fail-fast: false  # don't cancel other jobs if one fails
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'pnpm'
    - run: pnpm install --frozen-lockfile
    - run: pnpm test
      env:
        DB_TYPE: ${{ matrix.database }}
```

## Deployment Strategies

For deployments, use GitHub Environments to add approval gates and protection rules:

```yaml
deploy-production:
  needs: [build]
  runs-on: ubuntu-latest
  environment:
    name: production
    url: https://example.com
  steps:
    - uses: actions/checkout@v4
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-args: '--prod'
```

## Key Takeaways

- Use `concurrency` to cancel redundant runs and save CI minutes.
- Always cache dependencies -- it can cut install times from minutes to seconds.
- Scope secrets tightly: prefer environment-scoped secrets for production credentials.
- Use `matrix` for cross-platform/cross-version testing, but keep the matrix reasonable to avoid combinatorial explosion.
- Leverage GitHub Environments for deployment approval gates.29:{"id":"be64f7cd-f7e6-43f9-a64c-4d5c43976861","articleId":"ed316692-68a6-4f63-8c3c-c1de78d8b7da","languageCode":"en","title":"CI/CD Pipeline Best Practices with GitHub Actions","description":"A practical guide to building robust CI/CD pipelines with GitHub Actions -- covering workflow design, caching, secrets management, matrix builds, and deployment strategies.","content":"$2a","coverImageAlt":"CI/CD Pipeline Best Practices with GitHub Actions","readingTime":"11 min read"}
28:["$29"]
2d:{"id":"933c4655-5611-43b6-8c45-df1acaa26306","categoryId":"6757b2b9-4b5a-4290-b2f1-d819528643f9","languageCode":"en","name":"DevOps","description":"CI/CD pipelines, containerization, cloud infrastructure, and deployment automation for modern engineering teams."}
2c:["$2d"]
2b:{"id":"6757b2b9-4b5a-4290-b2f1-d819528643f9","slug":"devops","createdAt":"$D2026-05-29T13:15:55.961Z","updatedAt":"$D2026-05-29T13:15:55.961Z","translations":"$2c"}
30:{"id":"5f788196-f996-4fbc-9a1f-24deaf6e9956","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","languageCode":"en","role":"Software Engineer","bio":"Software Engineer passionate about building scalable web applications and sharing knowledge about modern web development, system design, and emerging technologies."}
2f:["$30"]
2e:{"id":"e69c2918-f7d4-46e4-9335-d61b267a676e","name":"Abiyyu Abidiffatir Al Majid","avatar":"/images/author-avatar.jpg","url":"https://a2mdev.site","createdAt":"$D2026-05-29T13:15:55.248Z","updatedAt":"$D2026-05-29T15:02:35.676Z","translations":"$2f"}
27:{"id":"ed316692-68a6-4f63-8c3c-c1de78d8b7da","slug":"cicd-github-actions-best-practices","coverImage":"/uploads/1780242886090-on3z6z.png","featured":false,"datePublished":"$D2024-04-22T00:00:00.000Z","dateModified":"$D2026-05-31T15:54:51.398Z","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","categoryId":"6757b2b9-4b5a-4290-b2f1-d819528643f9","translations":"$28","category":"$2b","author":"$2e"}
34:T1501,Large Language Models (LLMs) are powerful, but they have a critical limitation: their knowledge is frozen at training time. Retrieval-Augmented Generation (RAG) solves this by grounding LLM responses in your own data. In this article, we will build a complete RAG pipeline from scratch.

## What Is RAG?

RAG is a pattern where you:

1. **Retrieve** relevant documents from a knowledge base based on the user's query.
2. **Augment** the LLM prompt with those retrieved documents as context.
3. **Generate** a response that is grounded in the retrieved information.

This eliminates hallucination for domain-specific questions and keeps your AI up to date without retraining.

## Architecture Overview

A typical RAG pipeline has two phases:

```
Indexing Phase (offline):
  Documents → Chunking → Embedding → Vector Store

Query Phase (online):
  User Query → Embedding → Similarity Search → Context Assembly → LLM → Response
```

## Document Ingestion and Chunking

First, load your documents and split them into manageable chunks. LangChain provides document loaders for PDFs, websites, Notion, and more:

```typescript
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'

// Load a PDF document
const loader = new PDFLoader('./knowledge-base/product-docs.pdf')
const docs = await loader.load()

// Split into chunks of ~1000 characters with 200 character overlap
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ['\n\n', '\n', '. ', ' ', ''],
})
const chunks = await splitter.splitDocuments(docs)

console.log(`Split ${docs.length} document(s) into ${chunks.length} chunks`)
```

The `chunkOverlap` parameter is critical -- it prevents context from being lost at chunk boundaries.

## Embedding and Vector Storage

Next, convert each chunk into a vector embedding and store it in a vector database. Here we use Pinecone, but the pattern is similar for Weaviate, Qdrant, or Chroma:

```typescript
import { OpenAIEmbeddings } from '@langchain/openai'
import { PineconeStore } from '@langchain/pinecone'
import { Pinecone } from '@pinecone-database/pinecone'

const pinecone = new Pinecone()
const index = pinecone.Index('abyte-knowledge-base')

const embeddings = new OpenAIEmbeddings({
  modelName: 'text-embedding-3-small',
  dimensions: 1536,
})

// Store chunks in Pinecone
const vectorStore = await PineconeStore.fromDocuments(chunks, embeddings, {
  pineconeIndex: index,
  namespace: 'product-docs',
})
```

Each chunk is converted into a 1536-dimensional vector. When a query comes in, we embed the query and find the most similar vectors using cosine similarity.

## Retrieval

At query time, embed the user's question and retrieve the top-K most relevant chunks:

```typescript
const retriever = vectorStore.asRetriever({
  k: 4,           // return top 4 chunks
  filter: {       // optional metadata filter
    source: 'product-docs',
  },
})

const relevantDocs = await retriever.invoke('How do I configure rate limiting?')

console.log(relevantDocs.map((doc) => doc.pageContent))
```

## Generation with Context

Finally, assemble the retrieved context into a prompt and call the LLM:

```typescript
import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'

const model = new ChatOpenAI({ modelName: 'gpt-4o', temperature: 0 })

const prompt = PromptTemplate.fromTemplate(`
You are a technical support assistant for abyte.
Answer the question based ONLY on the following context.
If the context doesn't contain the answer, say "I don't have enough information to answer that."

Context:
{context}

Question: {question}

Answer:`)

const chain = prompt.pipe(model).pipe(new StringOutputParser())

const response = await chain.invoke({
  context: relevantDocs.map((d) => d.pageContent).join('\n\n---\n\n'),
  question: 'How do I configure rate limiting?',
})

console.log(response)
```

## Improving Retrieval Quality

Raw similarity search is a starting point. To improve results:

- **Hybrid search** -- combine vector similarity with keyword (BM25) search. Pinecone and Weaviate support this natively.
- **Re-ranking** -- use a cross-encoder model (e.g., Cohere Rerank) to re-score retrieved chunks before passing them to the LLM.
- **Metadata filtering** -- filter by document type, date, or category before doing similarity search.
- **Query transformation** -- use the LLM to rewrite ambiguous queries into clearer search queries.

```typescript
// Example: Multi-query retrieval
import { MultiQueryRetriever } from 'langchain/retrievers/multi_query'

const multiRetriever = MultiQueryRetriever.fromLLM({
  llm: model,
  retriever: vectorStore.asRetriever({ k: 4 }),
  queryCount: 3, // generate 3 variations of the query
})
```

## Key Takeaways

- RAG grounds LLM responses in your own data, reducing hallucination and keeping answers current.
- **Chunk size and overlap** matter enormously -- experiment with different values for your domain.
- Use **hybrid search** and **re-ranking** to improve retrieval quality beyond basic vector similarity.
- Always include a **"I don't know"** fallback in your prompt to handle cases where the context does not contain the answer.33:{"id":"586b40d6-0788-43e1-b812-73484444272f","articleId":"13e17d8a-c7d5-48fa-8d6c-bcc118543bb1","languageCode":"en","title":"Building RAG Pipelines with LangChain and Vector Databases","description":"Learn how to build Retrieval-Augmented Generation (RAG) pipelines using LangChain and vector databases -- from document ingestion and embedding to retrieval and generation.","content":"$34","coverImageAlt":"Building RAG Pipelines with LangChain and Vector Databases","readingTime":"15 min read"}
32:["$33"]
37:{"id":"bf5c14f8-6bdb-4ceb-ad43-3a37506abd3b","categoryId":"b0caefc2-3e4b-4f8e-87b2-b063e787802f","languageCode":"en","name":"AI & Machine Learning","description":"Artificial intelligence, machine learning pipelines, and practical applications of AI in software engineering."}
36:["$37"]
35:{"id":"b0caefc2-3e4b-4f8e-87b2-b063e787802f","slug":"ai-ml","createdAt":"$D2026-05-29T13:15:56.269Z","updatedAt":"$D2026-05-29T13:15:56.269Z","translations":"$36"}
3a:{"id":"5f788196-f996-4fbc-9a1f-24deaf6e9956","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","languageCode":"en","role":"Software Engineer","bio":"Software Engineer passionate about building scalable web applications and sharing knowledge about modern web development, system design, and emerging technologies."}
39:["$3a"]
38:{"id":"e69c2918-f7d4-46e4-9335-d61b267a676e","name":"Abiyyu Abidiffatir Al Majid","avatar":"/images/author-avatar.jpg","url":"https://a2mdev.site","createdAt":"$D2026-05-29T13:15:55.248Z","updatedAt":"$D2026-05-29T15:02:35.676Z","translations":"$39"}
31:{"id":"13e17d8a-c7d5-48fa-8d6c-bcc118543bb1","slug":"building-rag-pipelines-langchain","coverImage":"/uploads/1780243069775-8cnpg5.png","featured":false,"datePublished":"$D2024-03-18T00:00:00.000Z","dateModified":"$D2026-05-31T15:57:57.019Z","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","categoryId":"b0caefc2-3e4b-4f8e-87b2-b063e787802f","translations":"$32","category":"$35","author":"$38"}
3e:T10de,Most engineers think code review is about finding bugs. While that is one benefit, the real value of code review lies elsewhere: knowledge transfer, design consistency, and team growth. After years of reviewing thousands of pull requests, here is what I have learned about doing it well.

## The Purpose of Code Review

Code review serves multiple purposes, in order of importance:

1. **Knowledge sharing** -- the reviewer learns about changes they did not write, and the author learns from feedback.
2. **Design consistency** -- ensures the codebase follows agreed-upon patterns.
3. **Catching issues early** -- bugs, edge cases, and performance problems.
4. **Mentoring** -- a place for more experienced engineers to guide less experienced ones.

If your reviews are only focused on finding bugs, you are missing most of the value.

## What to Look For

When reviewing code, I use a layered approach:

### Layer 1: Intent and Design
- Does the PR description clearly explain **why** this change is needed?
- Is the approach sound? Would a different pattern be simpler or more maintainable?
- Does it fit the existing architecture, or does it introduce inconsistency?

### Layer 2: Correctness
- Are edge cases handled (null values, empty arrays, concurrent access)?
- Are error paths handled gracefully?
- Are there race conditions or potential deadlocks?

### Layer 3: Readability and Maintainability
- Are variable and function names descriptive?
- Is the code self-documenting, or does it need more comments?
- Are there any clever tricks that should be replaced with clearer code?

### Layer 4: Performance and Security
- Are there N+1 queries, unnecessary allocations, or missing indexes?
- Is user input validated and sanitized?
- Are secrets or credentials exposed?

## How to Give Good Feedback

The way you phrase feedback matters as much as the feedback itself.

**Bad:** "This is wrong."

**Good:** "This could fail when the array is empty. Consider adding a guard clause: `if (!items.length) return []`"

Principles for effective feedback:

- **Ask questions instead of making demands.** "What happens if this is null?" is more effective than "Add a null check here."
- **Explain the why.** Don't just say what to change -- explain the reasoning.
- **Distinguish severity.** Use prefixes to make your intent clear:
  - **"Nit:"** -- style preference, optional to address.
  - **"Suggestion:"** -- would improve the code but is not blocking.
  - **"Issue:"** -- something that should be fixed before merging.
  - **"Blocker:"** -- critical problem that must be addressed.
- **Praise good code.** When you see a clever solution or clean refactor, say so. Positive reinforcement matters.

## Automate the Boring Stuff

A great code review process automates everything that does not require human judgment:

```yaml
# .github/workflows/pr-check.yml
- name: Lint
  run: pnpm lint

- name: Type Check
  run: pnpm tsc --noEmit

- name: Test
  run: pnpm test

- name: Format Check
  run: pnpm prettier --check .
```

Use tools like:
- **ESLint/Prettier** for style and formatting.
- **TypeScript** strict mode for type safety.
- **Danger.js** for automated PR checks (missing tests, large PRs, changelog updates).
- **SonarQube** or **Codecov** for code coverage thresholds.

This way, human reviewers can focus on design, logic, and architecture -- the things that actually require judgment.

## For the Author: Make Reviews Easy

If you want fast, thorough reviews, make the reviewer's job easy:

- **Keep PRs small** -- under 400 lines of changes. Large PRs get rubber-stamped.
- **Write a clear PR description** -- explain the problem, the approach, and any trade-offs.
- **Self-review first** -- read your own diff before requesting reviews. You will catch obvious issues.
- **Respond to every comment** -- even if just to say "Done" or explain your reasoning.

## Key Takeaways

- Code review is primarily about **knowledge sharing and design**, not just bug hunting.
- Use **layered review** -- start with intent/design, then correctness, then readability.
- **Phrase feedback as questions** and explain the reasoning behind suggestions.
- **Automate** formatting, linting, and type checking so human reviewers focus on what matters.
- As a PR author, keep your changes small and your descriptions clear.3d:{"id":"3874ae1a-ba25-4ae5-883c-3a42ca3d0a5f","articleId":"d37ea8c7-413e-414e-8ad6-3c3335a7369a","languageCode":"en","title":"The Art of Code Review: Beyond Finding Bugs","description":"Code review is not just about catching bugs -- it is a powerful tool for knowledge sharing, mentoring, and building a strong engineering culture. Here is how to do it well.","content":"$3e","coverImageAlt":"The Art of Code Review: Beyond Finding Bugs","readingTime":"10 min read"}
3c:["$3d"]
41:{"id":"0c41b129-9337-463f-aa55-099d9eb1e001","categoryId":"22ee5179-c3c8-43b2-abd8-f1921cfab857","languageCode":"en","name":"Career & Growth","description":"Professional development, soft skills, engineering culture, and career advice for software engineers."}
40:["$41"]
3f:{"id":"22ee5179-c3c8-43b2-abd8-f1921cfab857","slug":"career-growth","createdAt":"$D2026-05-29T13:15:56.503Z","updatedAt":"$D2026-05-29T13:15:56.503Z","translations":"$40"}
44:{"id":"5f788196-f996-4fbc-9a1f-24deaf6e9956","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","languageCode":"en","role":"Software Engineer","bio":"Software Engineer passionate about building scalable web applications and sharing knowledge about modern web development, system design, and emerging technologies."}
43:["$44"]
42:{"id":"e69c2918-f7d4-46e4-9335-d61b267a676e","name":"Abiyyu Abidiffatir Al Majid","avatar":"/images/author-avatar.jpg","url":"https://a2mdev.site","createdAt":"$D2026-05-29T13:15:55.248Z","updatedAt":"$D2026-05-29T15:02:35.676Z","translations":"$43"}
3b:{"id":"d37ea8c7-413e-414e-8ad6-3c3335a7369a","slug":"art-of-code-review","coverImage":"/uploads/1780244668140-5iirvp.webp","featured":false,"datePublished":"$D2024-02-14T00:00:00.000Z","dateModified":"$D2026-05-31T16:24:38.060Z","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","categoryId":"22ee5179-c3c8-43b2-abd8-f1921cfab857","translations":"$3c","category":"$3f","author":"$42"}
48:T1444,TypeScript's type system is remarkably powerful, but most codebases barely scratch the surface. In this article, we will explore advanced patterns that make production TypeScript code safer, more expressive, and easier to refactor.

## Discriminated Unions

Discriminated unions are the single most useful TypeScript pattern for modeling state. Instead of using optional fields or type assertions, you give each variant a literal discriminant:

```typescript
// Instead of this (fragile):
type ApiResponse<T> = {
  data?: T
  error?: string
  loading?: boolean
}

// Do this (type-safe):
type ApiResponse<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

function handleResponse<T>(response: ApiResponse<T>) {
  switch (response.status) {
    case 'loading':
      return <Spinner />
    case 'success':
      return <DataView data={response.data} />
    case 'error':
      return <ErrorMessage message={response.error} />
  }
}
```

The compiler ensures you handle every case. Add a new variant? You get a compile error if you forget to handle it. No more `undefined is not a function` at runtime.

## Template Literal Types

Template literal types let you build string types from other types, which is incredibly useful for APIs, CSS, and event systems:

```typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type ApiVersion = 'v1' | 'v2'

// Generates: '/api/v1/users' | '/api/v2/users' | '/api/v1/posts' | ...
type ApiEndpoint = `/api/${ApiVersion}/${'users' | 'posts' | 'comments'}`

// Event handler naming convention
type EventName = 'click' | 'hover' | 'focus'
type EventHandler = `on${Capitalize<EventName>}`
// Result: 'onClick' | 'onHover' | 'onFocus'

// Type-safe CSS units
type CSSUnit = 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw'
type CSSValue = `${number}${CSSUnit}`

const width: CSSValue = '100px'  // valid
const bad: CSSValue = '100'      // error: missing unit
```

## Conditional Types

Conditional types let you create types that depend on other types. They are the foundation of many built-in utility types:

```typescript
// Basic conditional type
type IsString<T> = T extends string ? true : false

type A = IsString<'hello'> // true
type B = IsString<42>      // false

// Extract the return type of async functions
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

type Result = UnwrapPromise<Promise<string>> // string
type Plain = UnwrapPromise<number>            // number

// Practical example: extract props from a React component
type PropsOf<C> = C extends React.ComponentType<infer P> ? P : never

type ButtonProps = PropsOf<typeof Button> // extracts Button's prop type
```

## Practical Utility Types

Here are utility types I use constantly in production code:

```typescript
// Make specific keys required (opposite of Partial)
type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

type User = {
  id?: string
  name?: string
  email?: string
}

// CreateUser requires 'name' and 'email', but 'id' stays optional
type CreateUser = RequireKeys<User, 'name' | 'email'>

// Deep readonly -- prevents mutation at any nesting level
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

type Config = DeepReadonly<{
  database: {
    host: string
    port: number
    credentials: { user: string; pass: string }
  }
}>

// This errors: cannot mutate nested objects
// config.database.port = 3000

// Exhaustive switch helper
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`)
}

// Use with discriminated unions
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'rectangle':
      return shape.width * shape.height
    default:
      return assertNever(shape) // compile error if a case is missing
  }
}
```

## Branded Types

TypeScript uses structural typing, which means `string` and `string` are interchangeable. Branded types let you create nominally-distinct types:

```typescript
type Brand<T, B extends string> = T & { readonly __brand: B }

type UserId = Brand<string, 'UserId'>
type OrderId = Brand<string, 'OrderId'>

function getUser(id: UserId) { /* ... */ }
function getOrder(id: OrderId) { /* ... */ }

const userId = 'user-123' as UserId
const orderId = 'order-456' as OrderId

getUser(userId)   // valid
getUser(orderId)  // error: OrderId is not assignable to UserId
```

This prevents accidentally passing an order ID where a user ID is expected -- a bug that structural typing alone cannot catch.

## Key Takeaways

- **Discriminated unions** replace optional fields and type assertions for modeling state.
- **Template literal types** give you type-safe strings for APIs, CSS, and naming conventions.
- **Conditional types** unlock powerful type transformations and inference.
- **Branded types** add nominal typing on top of TypeScript's structural system, preventing ID mix-ups.
- These patterns pay for themselves in reduced runtime bugs and safer refactoring.47:{"id":"0a607b0a-4ee5-4e1c-a345-77fe5cc776df","articleId":"c4630aa8-9a7e-41ce-86f6-e2ef88c18c49","languageCode":"en","title":"Advanced TypeScript Patterns for Production Applications","description":"Go beyond the basics of TypeScript with advanced patterns like discriminated unions, template literal types, conditional types, and practical utility types for production code.","content":"$48","coverImageAlt":"Advanced TypeScript Patterns for Production Applications","readingTime":"13 min read"}
46:["$47"]
4b:{"id":"306f6aee-d3db-4aca-a9e3-094a5ddb421d","categoryId":"7929b15f-8f31-4f83-ac48-a7798d93d649","languageCode":"en","name":"Web Development","description":"Modern web development techniques, frameworks, and best practices for building fast, accessible applications."}
4a:["$4b"]
49:{"id":"7929b15f-8f31-4f83-ac48-a7798d93d649","slug":"web-development","createdAt":"$D2026-05-29T13:15:55.476Z","updatedAt":"$D2026-05-29T13:15:55.476Z","translations":"$4a"}
4e:{"id":"5f788196-f996-4fbc-9a1f-24deaf6e9956","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","languageCode":"en","role":"Software Engineer","bio":"Software Engineer passionate about building scalable web applications and sharing knowledge about modern web development, system design, and emerging technologies."}
4d:["$4e"]
4c:{"id":"e69c2918-f7d4-46e4-9335-d61b267a676e","name":"Abiyyu Abidiffatir Al Majid","avatar":"/images/author-avatar.jpg","url":"https://a2mdev.site","createdAt":"$D2026-05-29T13:15:55.248Z","updatedAt":"$D2026-05-29T15:02:35.676Z","translations":"$4d"}
45:{"id":"c4630aa8-9a7e-41ce-86f6-e2ef88c18c49","slug":"advanced-typescript-patterns","coverImage":"/uploads/1780245097071-2ezo5d.webp","featured":false,"datePublished":"$D2024-01-20T00:00:00.000Z","dateModified":"$D2026-05-31T16:31:39.627Z","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","categoryId":"7929b15f-8f31-4f83-ac48-a7798d93d649","translations":"$46","category":"$49","author":"$4c"}
2:["$","div",null,{"children":[["$","div",null,{"className":"flex items-center justify-between mb-6","children":[["$","div",null,{"children":[["$","h2",null,{"className":"text-xl md:text-2xl font-display font-bold text-gray-900","children":"Artikel"}],["$","p",null,{"className":"text-sm text-gray-500 mt-1","children":[6," artikel ditemukan"]}]]}],["$","$La",null,{"href":"/admin/articles/new","className":"px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center gap-2","children":[["$","svg",null,{"className":"w-4 h-4","fill":"none","viewBox":"0 0 24 24","strokeWidth":2,"stroke":"currentColor","children":["$","path",null,{"strokeLinecap":"round","strokeLinejoin":"round","d":"M12 4.5v15m7.5-7.5h-15"}]}],["$","span",null,{"className":"hidden sm:inline","children":"Artikel Baru"}],["$","span",null,{"className":"sm:hidden","children":"Baru"}]]}]]}],[["$","div",null,{"className":"hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden","children":["$","table",null,{"className":"w-full","children":[["$","thead",null,{"children":["$","tr",null,{"className":"border-b border-gray-100 bg-gray-50","children":[["$","th",null,{"className":"text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider","children":"Judul"}],["$","th",null,{"className":"text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider","children":"Kategori"}],["$","th",null,{"className":"text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider","children":"Status"}],["$","th",null,{"className":"text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider","children":"Tanggal"}],["$","th",null,{"className":"text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider","children":"Aksi"}]]}]}],["$","tbody",null,{"className":"divide-y divide-gray-100","children":[["$","tr","7b102660-7fc5-4de2-b84e-388ecaee3bf6",{"className":"hover:bg-gray-50 transition-colors","children":[["$","td",null,{"className":"px-5 py-3.5","children":[["$","p",null,{"className":"text-sm font-medium text-gray-900 truncate max-w-xs","children":"Mastering React Server Components in Next.js 14"}],["$","p",null,{"className":"text-xs text-gray-500 mt-0.5","children":["/","mastering-server-components-nextjs-14"]}]]}],["$","td",null,{"className":"px-5 py-3.5","children":["$","span",null,{"className":"inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700","children":"Web Development"}]}],["$","td",null,{"className":"px-5 py-3.5","children":["$","span",null,{"className":"inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-primary-50 text-primary-700","children":"Featured"}]}],["$","td",null,{"className":"px-5 py-3.5 text-sm text-gray-500","children":"15/6/2024"}],["$","td",null,{"className":"px-5 py-3.5 text-right","children":["$","div",null,{"className":"flex items-center justify-end gap-2","children":[["$","$Lb",null,{"article":{"id":"7b102660-7fc5-4de2-b84e-388ecaee3bf6","slug":"mastering-server-components-nextjs-14","coverImage":"/uploads/1780240471315-mzhf5c.png","featured":true,"datePublished":"$D2024-06-15T00:00:00.000Z","dateModified":"$D2026-05-31T15:14:36.916Z","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","categoryId":"7929b15f-8f31-4f83-ac48-a7798d93d649","translations":[{"id":"ca61dbb4-629c-4043-8ba0-6e5c944b5695","articleId":"7b102660-7fc5-4de2-b84e-388ecaee3bf6","languageCode":"en","title":"Mastering React Server Components in Next.js 14","description":"A deep dive into React Server Components in Next.js 14 -- understand how they work, when to use them, and how to combine server and client components for maximum performance.","content":"$c","coverImageAlt":"Mastering React Server Components in Next.js 14","readingTime":"12 min read"}],"category":{"id":"7929b15f-8f31-4f83-ac48-a7798d93d649","slug":"web-development","createdAt":"$D2026-05-29T13:15:55.476Z","updatedAt":"$D2026-05-29T13:15:55.476Z","translations":[{"id":"306f6aee-d3db-4aca-a9e3-094a5ddb421d","categoryId":"7929b15f-8f31-4f83-ac48-a7798d93d649","languageCode":"en","name":"Web Development","description":"Modern web development techniques, frameworks, and best practices for building fast, accessible applications."}]},"author":{"id":"e69c2918-f7d4-46e4-9335-d61b267a676e","name":"Abiyyu Abidiffatir Al Majid","avatar":"/images/author-avatar.jpg","url":"https://a2mdev.site","createdAt":"$D2026-05-29T13:15:55.248Z","updatedAt":"$D2026-05-29T15:02:35.676Z","translations":[{"id":"5f788196-f996-4fbc-9a1f-24deaf6e9956","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","languageCode":"en","role":"Software Engineer","bio":"Software Engineer passionate about building scalable web applications and sharing knowledge about modern web development, system design, and emerging technologies."}]}}}],["$","$La",null,{"href":"/admin/articles/7b102660-7fc5-4de2-b84e-388ecaee3bf6","className":"px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors","children":"Edit"}],["$","$Ld",null,{"articleId":"7b102660-7fc5-4de2-b84e-388ecaee3bf6"}]]}]}]]}],["$","tr","b14e32aa-3d77-4c3e-b894-637e1c44d356",{"className":"hover:bg-gray-50 transition-colors","children":[["$","td",null,{"className":"px-5 py-3.5","children":[["$","p",null,{"className":"text-sm font-medium text-gray-900 truncate max-w-xs","children":"Designing Scalable Microservices Architecture"}],["$","p",null,{"className":"text-xs text-gray-500 mt-0.5","children":["/","designing-scalable-microservices"]}]]}],["$","td",null,{"className":"px-5 py-3.5","children":["$","span",null,{"className":"inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700","children":"System Design"}]}],["$","td",null,{"className":"px-5 py-3.5","children":["$","span",null,{"className":"inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600","children":"Normal"}]}],["$","td",null,{"className":"px-5 py-3.5 text-sm text-gray-500","children":"10/5/2024"}],["$","td",null,{"className":"px-5 py-3.5 text-right","children":["$","div",null,{"className":"flex items-center justify-end gap-2","children":[["$","$Lb",null,{"article":{"id":"b14e32aa-3d77-4c3e-b894-637e1c44d356","slug":"designing-scalable-microservices","coverImage":"/uploads/1780242667777-s6nlaq.png","featured":false,"datePublished":"$D2024-05-10T00:00:00.000Z","dateModified":"$D2026-05-31T15:51:11.258Z","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","categoryId":"b816b58b-8cb5-41df-b257-cdf4e672b248","translations":[{"id":"e97ab27c-3e44-47c5-bd74-a56756b3fe68","articleId":"b14e32aa-3d77-4c3e-b894-637e1c44d356","languageCode":"en","title":"Designing Scalable Microservices Architecture","description":"Learn how to decompose monoliths into microservices, choose the right communication patterns, manage data effectively, and deploy services at scale.","content":"$e","coverImageAlt":"Designing Scalable Microservices Architecture","readingTime":"14 min read"}],"category":{"id":"b816b58b-8cb5-41df-b257-cdf4e672b248","slug":"system-design","createdAt":"$D2026-05-29T13:15:55.714Z","updatedAt":"$D2026-05-29T13:15:55.714Z","translations":[{"id":"d294b147-3140-4025-ba9d-b1c485beecf3","categoryId":"b816b58b-8cb5-41df-b257-cdf4e672b248","languageCode":"en","name":"System Design","description":"Architecture patterns, scalability strategies, and distributed systems design for large-scale applications."}]},"author":{"id":"e69c2918-f7d4-46e4-9335-d61b267a676e","name":"Abiyyu Abidiffatir Al Majid","avatar":"/images/author-avatar.jpg","url":"https://a2mdev.site","createdAt":"$D2026-05-29T13:15:55.248Z","updatedAt":"$D2026-05-29T15:02:35.676Z","translations":[{"id":"5f788196-f996-4fbc-9a1f-24deaf6e9956","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","languageCode":"en","role":"Software Engineer","bio":"Software Engineer passionate about building scalable web applications and sharing knowledge about modern web development, system design, and emerging technologies."}]}}}],["$","$La",null,{"href":"/admin/articles/b14e32aa-3d77-4c3e-b894-637e1c44d356","className":"px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors","children":"Edit"}],["$","$Ld",null,{"articleId":"b14e32aa-3d77-4c3e-b894-637e1c44d356"}]]}]}]]}],["$","tr","ed316692-68a6-4f63-8c3c-c1de78d8b7da",{"className":"hover:bg-gray-50 transition-colors","children":[["$","td",null,{"className":"px-5 py-3.5","children":[["$","p",null,{"className":"text-sm font-medium text-gray-900 truncate max-w-xs","children":"CI/CD Pipeline Best Practices with GitHub Actions"}],["$","p",null,{"className":"text-xs text-gray-500 mt-0.5","children":["/","cicd-github-actions-best-practices"]}]]}],["$","td",null,{"className":"px-5 py-3.5","children":["$","span",null,{"className":"inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700","children":"DevOps"}]}],["$","td",null,{"className":"px-5 py-3.5","children":["$","span",null,{"className":"inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600","children":"Normal"}]}],["$","td",null,{"className":"px-5 py-3.5 text-sm text-gray-500","children":"22/4/2024"}],["$","td",null,{"className":"px-5 py-3.5 text-right","children":["$","div",null,{"className":"flex items-center justify-end gap-2","children":[["$","$Lb",null,{"article":{"id":"ed316692-68a6-4f63-8c3c-c1de78d8b7da","slug":"cicd-github-actions-best-practices","coverImage":"/uploads/1780242886090-on3z6z.png","featured":false,"datePublished":"$D2024-04-22T00:00:00.000Z","dateModified":"$D2026-05-31T15:54:51.398Z","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","categoryId":"6757b2b9-4b5a-4290-b2f1-d819528643f9","translations":[{"id":"be64f7cd-f7e6-43f9-a64c-4d5c43976861","articleId":"ed316692-68a6-4f63-8c3c-c1de78d8b7da","languageCode":"en","title":"CI/CD Pipeline Best Practices with GitHub Actions","description":"A practical guide to building robust CI/CD pipelines with GitHub Actions -- covering workflow design, caching, secrets management, matrix builds, and deployment strategies.","content":"$f","coverImageAlt":"CI/CD Pipeline Best Practices with GitHub Actions","readingTime":"11 min read"}],"category":{"id":"6757b2b9-4b5a-4290-b2f1-d819528643f9","slug":"devops","createdAt":"$D2026-05-29T13:15:55.961Z","updatedAt":"$D2026-05-29T13:15:55.961Z","translations":[{"id":"933c4655-5611-43b6-8c45-df1acaa26306","categoryId":"6757b2b9-4b5a-4290-b2f1-d819528643f9","languageCode":"en","name":"DevOps","description":"CI/CD pipelines, containerization, cloud infrastructure, and deployment automation for modern engineering teams."}]},"author":{"id":"e69c2918-f7d4-46e4-9335-d61b267a676e","name":"Abiyyu Abidiffatir Al Majid","avatar":"/images/author-avatar.jpg","url":"https://a2mdev.site","createdAt":"$D2026-05-29T13:15:55.248Z","updatedAt":"$D2026-05-29T15:02:35.676Z","translations":[{"id":"5f788196-f996-4fbc-9a1f-24deaf6e9956","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","languageCode":"en","role":"Software Engineer","bio":"Software Engineer passionate about building scalable web applications and sharing knowledge about modern web development, system design, and emerging technologies."}]}}}],["$","$La",null,{"href":"/admin/articles/ed316692-68a6-4f63-8c3c-c1de78d8b7da","className":"px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors","children":"Edit"}],["$","$Ld",null,{"articleId":"ed316692-68a6-4f63-8c3c-c1de78d8b7da"}]]}]}]]}],["$","tr","13e17d8a-c7d5-48fa-8d6c-bcc118543bb1",{"className":"hover:bg-gray-50 transition-colors","children":[["$","td",null,{"className":"px-5 py-3.5","children":[["$","p",null,{"className":"text-sm font-medium text-gray-900 truncate max-w-xs","children":"Building RAG Pipelines with LangChain and Vector Databases"}],["$","p",null,{"className":"text-xs text-gray-500 mt-0.5","children":["/","building-rag-pipelines-langchain"]}]]}],["$","td",null,{"className":"px-5 py-3.5","children":["$","span",null,{"className":"inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700","children":"AI & Machine Learning"}]}],["$","td",null,{"className":"px-5 py-3.5","children":["$","span",null,{"className":"inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600","children":"Normal"}]}],["$","td",null,{"className":"px-5 py-3.5 text-sm text-gray-500","children":"18/3/2024"}],["$","td",null,{"className":"px-5 py-3.5 text-right","children":["$","div",null,{"className":"flex items-center justify-end gap-2","children":[["$","$Lb",null,{"article":{"id":"13e17d8a-c7d5-48fa-8d6c-bcc118543bb1","slug":"building-rag-pipelines-langchain","coverImage":"/uploads/1780243069775-8cnpg5.png","featured":false,"datePublished":"$D2024-03-18T00:00:00.000Z","dateModified":"$D2026-05-31T15:57:57.019Z","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","categoryId":"b0caefc2-3e4b-4f8e-87b2-b063e787802f","translations":[{"id":"586b40d6-0788-43e1-b812-73484444272f","articleId":"13e17d8a-c7d5-48fa-8d6c-bcc118543bb1","languageCode":"en","title":"Building RAG Pipelines with LangChain and Vector Databases","description":"Learn how to build Retrieval-Augmented Generation (RAG) pipelines using LangChain and vector databases -- from document ingestion and embedding to retrieval and generation.","content":"$10","coverImageAlt":"Building RAG Pipelines with LangChain and Vector Databases","readingTime":"15 min read"}],"category":{"id":"b0caefc2-3e4b-4f8e-87b2-b063e787802f","slug":"ai-ml","createdAt":"$D2026-05-29T13:15:56.269Z","updatedAt":"$D2026-05-29T13:15:56.269Z","translations":[{"id":"bf5c14f8-6bdb-4ceb-ad43-3a37506abd3b","categoryId":"b0caefc2-3e4b-4f8e-87b2-b063e787802f","languageCode":"en","name":"AI & Machine Learning","description":"Artificial intelligence, machine learning pipelines, and practical applications of AI in software engineering."}]},"author":{"id":"e69c2918-f7d4-46e4-9335-d61b267a676e","name":"Abiyyu Abidiffatir Al Majid","avatar":"/images/author-avatar.jpg","url":"https://a2mdev.site","createdAt":"$D2026-05-29T13:15:55.248Z","updatedAt":"$D2026-05-29T15:02:35.676Z","translations":[{"id":"5f788196-f996-4fbc-9a1f-24deaf6e9956","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","languageCode":"en","role":"Software Engineer","bio":"Software Engineer passionate about building scalable web applications and sharing knowledge about modern web development, system design, and emerging technologies."}]}}}],["$","$La",null,{"href":"/admin/articles/13e17d8a-c7d5-48fa-8d6c-bcc118543bb1","className":"px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors","children":"Edit"}],["$","$Ld",null,{"articleId":"13e17d8a-c7d5-48fa-8d6c-bcc118543bb1"}]]}]}]]}],["$","tr","d37ea8c7-413e-414e-8ad6-3c3335a7369a",{"className":"hover:bg-gray-50 transition-colors","children":[["$","td",null,{"className":"px-5 py-3.5","children":[["$","p",null,{"className":"text-sm font-medium text-gray-900 truncate max-w-xs","children":"The Art of Code Review: Beyond Finding Bugs"}],["$","p",null,{"className":"text-xs text-gray-500 mt-0.5","children":["/","art-of-code-review"]}]]}],["$","td",null,{"className":"px-5 py-3.5","children":["$","span",null,{"className":"inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700","children":"Career & Growth"}]}],["$","td",null,{"className":"px-5 py-3.5","children":["$","span",null,{"className":"inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600","children":"Normal"}]}],["$","td",null,{"className":"px-5 py-3.5 text-sm text-gray-500","children":"14/2/2024"}],["$","td",null,{"className":"px-5 py-3.5 text-right","children":["$","div",null,{"className":"flex items-center justify-end gap-2","children":[["$","$Lb",null,{"article":{"id":"d37ea8c7-413e-414e-8ad6-3c3335a7369a","slug":"art-of-code-review","coverImage":"/uploads/1780244668140-5iirvp.webp","featured":false,"datePublished":"$D2024-02-14T00:00:00.000Z","dateModified":"$D2026-05-31T16:24:38.060Z","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","categoryId":"22ee5179-c3c8-43b2-abd8-f1921cfab857","translations":[{"id":"3874ae1a-ba25-4ae5-883c-3a42ca3d0a5f","articleId":"d37ea8c7-413e-414e-8ad6-3c3335a7369a","languageCode":"en","title":"The Art of Code Review: Beyond Finding Bugs","description":"Code review is not just about catching bugs -- it is a powerful tool for knowledge sharing, mentoring, and building a strong engineering culture. Here is how to do it well.","content":"$11","coverImageAlt":"The Art of Code Review: Beyond Finding Bugs","readingTime":"10 min read"}],"category":{"id":"22ee5179-c3c8-43b2-abd8-f1921cfab857","slug":"career-growth","createdAt":"$D2026-05-29T13:15:56.503Z","updatedAt":"$D2026-05-29T13:15:56.503Z","translations":[{"id":"0c41b129-9337-463f-aa55-099d9eb1e001","categoryId":"22ee5179-c3c8-43b2-abd8-f1921cfab857","languageCode":"en","name":"Career & Growth","description":"Professional development, soft skills, engineering culture, and career advice for software engineers."}]},"author":{"id":"e69c2918-f7d4-46e4-9335-d61b267a676e","name":"Abiyyu Abidiffatir Al Majid","avatar":"/images/author-avatar.jpg","url":"https://a2mdev.site","createdAt":"$D2026-05-29T13:15:55.248Z","updatedAt":"$D2026-05-29T15:02:35.676Z","translations":[{"id":"5f788196-f996-4fbc-9a1f-24deaf6e9956","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","languageCode":"en","role":"Software Engineer","bio":"Software Engineer passionate about building scalable web applications and sharing knowledge about modern web development, system design, and emerging technologies."}]}}}],["$","$La",null,{"href":"/admin/articles/d37ea8c7-413e-414e-8ad6-3c3335a7369a","className":"px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors","children":"Edit"}],["$","$Ld",null,{"articleId":"d37ea8c7-413e-414e-8ad6-3c3335a7369a"}]]}]}]]}],["$","tr","c4630aa8-9a7e-41ce-86f6-e2ef88c18c49",{"className":"hover:bg-gray-50 transition-colors","children":[["$","td",null,{"className":"px-5 py-3.5","children":[["$","p",null,{"className":"text-sm font-medium text-gray-900 truncate max-w-xs","children":"Advanced TypeScript Patterns for Production Applications"}],["$","p",null,{"className":"text-xs text-gray-500 mt-0.5","children":["/","advanced-typescript-patterns"]}]]}],["$","td",null,{"className":"px-5 py-3.5","children":["$","span",null,{"className":"inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700","children":"Web Development"}]}],["$","td",null,{"className":"px-5 py-3.5","children":["$","span",null,{"className":"inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600","children":"Normal"}]}],["$","td",null,{"className":"px-5 py-3.5 text-sm text-gray-500","children":"20/1/2024"}],["$","td",null,{"className":"px-5 py-3.5 text-right","children":["$","div",null,{"className":"flex items-center justify-end gap-2","children":[["$","$Lb",null,{"article":{"id":"c4630aa8-9a7e-41ce-86f6-e2ef88c18c49","slug":"advanced-typescript-patterns","coverImage":"/uploads/1780245097071-2ezo5d.webp","featured":false,"datePublished":"$D2024-01-20T00:00:00.000Z","dateModified":"$D2026-05-31T16:31:39.627Z","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","categoryId":"7929b15f-8f31-4f83-ac48-a7798d93d649","translations":[{"id":"0a607b0a-4ee5-4e1c-a345-77fe5cc776df","articleId":"c4630aa8-9a7e-41ce-86f6-e2ef88c18c49","languageCode":"en","title":"Advanced TypeScript Patterns for Production Applications","description":"Go beyond the basics of TypeScript with advanced patterns like discriminated unions, template literal types, conditional types, and practical utility types for production code.","content":"$12","coverImageAlt":"Advanced TypeScript Patterns for Production Applications","readingTime":"13 min read"}],"category":{"id":"7929b15f-8f31-4f83-ac48-a7798d93d649","slug":"web-development","createdAt":"$D2026-05-29T13:15:55.476Z","updatedAt":"$D2026-05-29T13:15:55.476Z","translations":[{"id":"306f6aee-d3db-4aca-a9e3-094a5ddb421d","categoryId":"7929b15f-8f31-4f83-ac48-a7798d93d649","languageCode":"en","name":"Web Development","description":"Modern web development techniques, frameworks, and best practices for building fast, accessible applications."}]},"author":{"id":"e69c2918-f7d4-46e4-9335-d61b267a676e","name":"Abiyyu Abidiffatir Al Majid","avatar":"/images/author-avatar.jpg","url":"https://a2mdev.site","createdAt":"$D2026-05-29T13:15:55.248Z","updatedAt":"$D2026-05-29T15:02:35.676Z","translations":[{"id":"5f788196-f996-4fbc-9a1f-24deaf6e9956","authorId":"e69c2918-f7d4-46e4-9335-d61b267a676e","languageCode":"en","role":"Software Engineer","bio":"Software Engineer passionate about building scalable web applications and sharing knowledge about modern web development, system design, and emerging technologies."}]}}}],["$","$La",null,{"href":"/admin/articles/c4630aa8-9a7e-41ce-86f6-e2ef88c18c49","className":"px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors","children":"Edit"}],["$","$Ld",null,{"articleId":"c4630aa8-9a7e-41ce-86f6-e2ef88c18c49"}]]}]}]]}]]}]]}]}],["$","div",null,{"className":"md:hidden space-y-3","children":[["$","div","7b102660-7fc5-4de2-b84e-388ecaee3bf6",{"className":"bg-white rounded-xl border border-gray-200 p-4","children":[["$","div",null,{"className":"flex items-start justify-between gap-3","children":[["$","div",null,{"className":"min-w-0 flex-1","children":[["$","p",null,{"className":"text-sm font-medium text-gray-900 truncate","children":"Mastering React Server Components in Next.js 14"}],["$","p",null,{"className":"text-xs text-gray-500 mt-0.5","children":["/","mastering-server-components-nextjs-14"]}]]}],["$","span",null,{"className":"flex-shrink-0 inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-primary-50 text-primary-700","children":"Featured"}]]}],["$","div",null,{"className":"flex items-center gap-3 mt-3","children":[["$","span",null,{"className":"inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700","children":"Web Development"}],["$","span",null,{"className":"text-xs text-gray-400","children":"15/6/2024"}]]}],["$","div",null,{"className":"flex items-center gap-2 mt-3 pt-3 border-t border-gray-100","children":[["$","$Lb",null,{"article":"$13"}],["$","$La",null,{"href":"/admin/articles/7b102660-7fc5-4de2-b84e-388ecaee3bf6","className":"flex-1 text-center px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors","children":"Edit"}],["$","$Ld",null,{"articleId":"7b102660-7fc5-4de2-b84e-388ecaee3bf6"}]]}]]}],["$","div","b14e32aa-3d77-4c3e-b894-637e1c44d356",{"className":"bg-white rounded-xl border border-gray-200 p-4","children":[["$","div",null,{"className":"flex items-start justify-between gap-3","children":[["$","div",null,{"className":"min-w-0 flex-1","children":[["$","p",null,{"className":"text-sm font-medium text-gray-900 truncate","children":"Designing Scalable Microservices Architecture"}],["$","p",null,{"className":"text-xs text-gray-500 mt-0.5","children":["/","designing-scalable-microservices"]}]]}],false]}],["$","div",null,{"className":"flex items-center gap-3 mt-3","children":[["$","span",null,{"className":"inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700","children":"System Design"}],["$","span",null,{"className":"text-xs text-gray-400","children":"10/5/2024"}]]}],["$","div",null,{"className":"flex items-center gap-2 mt-3 pt-3 border-t border-gray-100","children":[["$","$Lb",null,{"article":"$1d"}],["$","$La",null,{"href":"/admin/articles/b14e32aa-3d77-4c3e-b894-637e1c44d356","className":"flex-1 text-center px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors","children":"Edit"}],["$","$Ld",null,{"articleId":"b14e32aa-3d77-4c3e-b894-637e1c44d356"}]]}]]}],["$","div","ed316692-68a6-4f63-8c3c-c1de78d8b7da",{"className":"bg-white rounded-xl border border-gray-200 p-4","children":[["$","div",null,{"className":"flex items-start justify-between gap-3","children":[["$","div",null,{"className":"min-w-0 flex-1","children":[["$","p",null,{"className":"text-sm font-medium text-gray-900 truncate","children":"CI/CD Pipeline Best Practices with GitHub Actions"}],["$","p",null,{"className":"text-xs text-gray-500 mt-0.5","children":["/","cicd-github-actions-best-practices"]}]]}],false]}],["$","div",null,{"className":"flex items-center gap-3 mt-3","children":[["$","span",null,{"className":"inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700","children":"DevOps"}],["$","span",null,{"className":"text-xs text-gray-400","children":"22/4/2024"}]]}],["$","div",null,{"className":"flex items-center gap-2 mt-3 pt-3 border-t border-gray-100","children":[["$","$Lb",null,{"article":"$27"}],["$","$La",null,{"href":"/admin/articles/ed316692-68a6-4f63-8c3c-c1de78d8b7da","className":"flex-1 text-center px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors","children":"Edit"}],["$","$Ld",null,{"articleId":"ed316692-68a6-4f63-8c3c-c1de78d8b7da"}]]}]]}],["$","div","13e17d8a-c7d5-48fa-8d6c-bcc118543bb1",{"className":"bg-white rounded-xl border border-gray-200 p-4","children":[["$","div",null,{"className":"flex items-start justify-between gap-3","children":[["$","div",null,{"className":"min-w-0 flex-1","children":[["$","p",null,{"className":"text-sm font-medium text-gray-900 truncate","children":"Building RAG Pipelines with LangChain and Vector Databases"}],["$","p",null,{"className":"text-xs text-gray-500 mt-0.5","children":["/","building-rag-pipelines-langchain"]}]]}],false]}],["$","div",null,{"className":"flex items-center gap-3 mt-3","children":[["$","span",null,{"className":"inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700","children":"AI & Machine Learning"}],["$","span",null,{"className":"text-xs text-gray-400","children":"18/3/2024"}]]}],["$","div",null,{"className":"flex items-center gap-2 mt-3 pt-3 border-t border-gray-100","children":[["$","$Lb",null,{"article":"$31"}],["$","$La",null,{"href":"/admin/articles/13e17d8a-c7d5-48fa-8d6c-bcc118543bb1","className":"flex-1 text-center px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors","children":"Edit"}],["$","$Ld",null,{"articleId":"13e17d8a-c7d5-48fa-8d6c-bcc118543bb1"}]]}]]}],["$","div","d37ea8c7-413e-414e-8ad6-3c3335a7369a",{"className":"bg-white rounded-xl border border-gray-200 p-4","children":[["$","div",null,{"className":"flex items-start justify-between gap-3","children":[["$","div",null,{"className":"min-w-0 flex-1","children":[["$","p",null,{"className":"text-sm font-medium text-gray-900 truncate","children":"The Art of Code Review: Beyond Finding Bugs"}],["$","p",null,{"className":"text-xs text-gray-500 mt-0.5","children":["/","art-of-code-review"]}]]}],false]}],["$","div",null,{"className":"flex items-center gap-3 mt-3","children":[["$","span",null,{"className":"inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700","children":"Career & Growth"}],["$","span",null,{"className":"text-xs text-gray-400","children":"14/2/2024"}]]}],["$","div",null,{"className":"flex items-center gap-2 mt-3 pt-3 border-t border-gray-100","children":[["$","$Lb",null,{"article":"$3b"}],["$","$La",null,{"href":"/admin/articles/d37ea8c7-413e-414e-8ad6-3c3335a7369a","className":"flex-1 text-center px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors","children":"Edit"}],["$","$Ld",null,{"articleId":"d37ea8c7-413e-414e-8ad6-3c3335a7369a"}]]}]]}],["$","div","c4630aa8-9a7e-41ce-86f6-e2ef88c18c49",{"className":"bg-white rounded-xl border border-gray-200 p-4","children":[["$","div",null,{"className":"flex items-start justify-between gap-3","children":[["$","div",null,{"className":"min-w-0 flex-1","children":[["$","p",null,{"className":"text-sm font-medium text-gray-900 truncate","children":"Advanced TypeScript Patterns for Production Applications"}],["$","p",null,{"className":"text-xs text-gray-500 mt-0.5","children":["/","advanced-typescript-patterns"]}]]}],false]}],["$","div",null,{"className":"flex items-center gap-3 mt-3","children":[["$","span",null,{"className":"inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700","children":"Web Development"}],["$","span",null,{"className":"text-xs text-gray-400","children":"20/1/2024"}]]}],["$","div",null,{"className":"flex items-center gap-2 mt-3 pt-3 border-t border-gray-100","children":[["$","$Lb",null,{"article":"$45"}],["$","$La",null,{"href":"/admin/articles/c4630aa8-9a7e-41ce-86f6-e2ef88c18c49","className":"flex-1 text-center px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors","children":"Edit"}],["$","$Ld",null,{"articleId":"c4630aa8-9a7e-41ce-86f6-e2ef88c18c49"}]]}]]}]]}]]]}]
