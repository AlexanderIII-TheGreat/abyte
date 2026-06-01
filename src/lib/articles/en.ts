import type { Article, Category } from '@/types'
import { AUTHOR } from '../constants'

const enCategories = {
  webDevelopment: {
    name: 'Web Development',
    slug: 'web-development',
    description:
      'Modern web development techniques, frameworks, and best practices for building fast, accessible applications.',
  },
  systemDesign: {
    name: 'System Design',
    slug: 'system-design',
    description:
      'Architecture patterns, scalability strategies, and distributed systems design for large-scale applications.',
  },
  devops: {
    name: 'DevOps',
    slug: 'devops',
    description:
      'CI/CD pipelines, containerization, cloud infrastructure, and deployment automation for modern engineering teams.',
  },
  aiMl: {
    name: 'AI & Machine Learning',
    slug: 'ai-ml',
    description:
      'Artificial intelligence, machine learning pipelines, and practical applications of AI in software engineering.',
  },
  careerGrowth: {
    name: 'Career & Growth',
    slug: 'career-growth',
    description:
      'Professional development, soft skills, engineering culture, and career advice for software engineers.',
  },
} satisfies Record<string, Category>

export const enArticles: Article[] = [
  // ─── Article 1 ────────────────────────────────────────────────────
  {
    id: '1',
    slug: 'mastering-server-components-nextjs-14',
    title: 'Mastering React Server Components in Next.js 14',
    description:
      'A deep dive into React Server Components in Next.js 14 -- understand how they work, when to use them, and how to combine server and client components for maximum performance.',
    coverImage: '/images/articles/server-components.jpg',
    coverImageAlt: 'React Server Components architecture diagram',
    datePublished: '2024-06-15',
    dateModified: '2024-06-20',
    readingTime: '12 min read',
    category: enCategories.webDevelopment,
    tags: ['Next.js', 'React', 'Server Components', 'Performance'],
    author: AUTHOR,
    featured: true,
    content: `
React Server Components (RSC) represent one of the most significant shifts in how we think about rendering in React applications. Introduced as the default rendering model in Next.js 13+ and refined in Next.js 14, Server Components let you move rendering work to the server while keeping the interactive parts on the client.

## What Are React Server Components?

A Server Component runs exclusively on the server. It never ships JavaScript to the browser, which means:

- **Zero client-side bundle cost** -- the component logic, dependencies, and data fetching stay on the server.
- **Direct access to backend resources** -- you can query databases, read files, or call internal APIs without exposing them to the client.
- **Automatic code splitting** -- client components imported inside a server component are automatically split into their own bundles.

\`\`\`tsx
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
\`\`\`

## Server vs. Client Components

In Next.js 14, every component inside the \`app/\` directory is a **Server Component by default**. You opt into client rendering with the \`"use client"\` directive at the top of a file:

\`\`\`tsx
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
\`\`\`

A good mental model: **keep as much as possible on the server**, and only push interactivity to the client when you need hooks like \`useState\`, \`useEffect\`, or browser APIs.

## The Composition Pattern

The real power of RSC comes from composition. A server component can import and render a client component, passing serializable props:

\`\`\`tsx
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
\`\`\`

Here, \`ArticlePage\` runs on the server and renders the article content. The \`LikeButton\` is a client component that handles the interactive "like" logic. The boundary is clean: data fetching and static content on the server, interactivity on the client.

## When to Use Which?

| Use Case | Component Type |
|---|---|
| Fetching data from a database or API | Server |
| Displaying static or read-only content | Server |
| Using \`useState\`, \`useReducer\`, \`useEffect\` | Client |
| Using browser-only APIs (localStorage, geolocation) | Client |
| Handling user events (clicks, form inputs) | Client |
| Passing non-serializable props (functions, class instances) | Client |

## Performance Benefits

Switching to Server Components in a typical Next.js app can reduce the client-side JavaScript bundle by **30-50%**. The main wins come from:

1. **Smaller bundles** -- heavy libraries like \`marked\`, \`prisma\`, or date formatters stay on the server.
2. **Faster initial load** -- the server sends rendered HTML, not a JavaScript framework that then renders HTML.
3. **Reduced waterfall** -- data fetching happens server-side in a single round trip, eliminating client-side loading spinners.

## Key Takeaways

- Server Components are the **default** in the Next.js 14 App Router. You only add \`"use client"\` when you need client interactivity.
- Use the **composition pattern**: let server components own data fetching and layout, and delegate interactive leaves to client components.
- Always measure the impact -- use the Next.js build output (\`next build\`) to verify your bundle sizes after migrating components.
`.trim(),
  },

  // ─── Article 2 ────────────────────────────────────────────────────
  {
    id: '2',
    slug: 'designing-scalable-microservices',
    title: 'Designing Scalable Microservices Architecture',
    description:
      'Learn how to decompose monoliths into microservices, choose the right communication patterns, manage data effectively, and deploy services at scale.',
    coverImage: '/images/articles/microservices.jpg',
    coverImageAlt: 'Microservices architecture diagram',
    datePublished: '2024-05-10',
    dateModified: '2024-05-15',
    readingTime: '14 min read',
    category: enCategories.systemDesign,
    tags: ['Microservices', 'Architecture', 'Scalability', 'System Design'],
    author: AUTHOR,
    featured: false,
    content: `
Microservices architecture has become the go-to approach for building large-scale, independently deployable services. But moving from a monolith to microservices is not just a technical migration -- it is a fundamental shift in how teams own, build, and operate software.

## Service Decomposition

The hardest part of microservices is deciding where to draw the boundaries. A common mistake is splitting services by technical layer (e.g., "database service", "API service") rather than by business capability.

**Use Domain-Driven Design (DDD)** to identify bounded contexts. Each microservice should map to a single business domain:

\`\`\`
E-commerce example:
├── Order Service        → handles order lifecycle
├── Inventory Service    → manages stock levels
├── Payment Service      → processes transactions
├── User Service         → authentication and profiles
└── Notification Service → emails, push, SMS
\`\`\`

Each service owns its data. There is no shared database -- if Order Service needs inventory data, it calls the Inventory Service API or subscribes to its events.

## Communication Patterns

Microservices communicate through two primary patterns:

### Synchronous (Request/Response)
Best for queries where you need an immediate answer.

\`\`\`typescript
// Order Service calling Inventory Service
async function checkStock(productId: string): Promise<boolean> {
  const response = await fetch('http://inventory-svc/api/stock/' + productId)
  const data = await response.json()
  return data.available > 0
}
\`\`\`

**Pros:** Simple, familiar, real-time.
**Cons:** Creates coupling, cascading failures if the downstream service is slow or down.

### Asynchronous (Event-Driven)
Best for commands and workflows where eventual consistency is acceptable.

\`\`\`typescript
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
\`\`\`

**Pros:** Loose coupling, resilient to failures, enables replay.
**Cons:** More complex, harder to debug, eventual consistency.

## Data Management

Each service must own its data store. This is non-negotiable -- sharing a database creates tight coupling that defeats the purpose of microservices.

Common patterns for cross-service data needs:

1. **API Composition** -- a gateway or orchestrator queries multiple services and aggregates results.
2. **CQRS (Command Query Responsibility Segregation)** -- separate write and read models, with the read model built from events.
3. **Event Sourcing** -- store state as a sequence of events rather than current state, enabling full reconstruction.

\`\`\`
Order Service (PostgreSQL)       → owns order data
Inventory Service (MongoDB)      → owns stock data
Payment Service (PostgreSQL)     → owns transaction data
Search Service (Elasticsearch)   → builds search index from events
\`\`\`

## Deployment Strategies

Each service should be independently deployable. Containerization with Docker and orchestration with Kubernetes is the industry standard:

\`\`\`yaml
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
\`\`\`

Key practices:
- **Blue/Green deployments** for zero-downtime releases.
- **Canary releases** to roll out changes to a small percentage of traffic first.
- **Feature flags** to decouple deployment from release.

## Key Takeaways

- Decompose by **business capability**, not by technical layer.
- Prefer **asynchronous, event-driven** communication for inter-service workflows.
- Each service must **own its data** -- no shared databases.
- Invest early in **observability** (distributed tracing, centralized logging, metrics) -- debugging microservices without it is nearly impossible.
`.trim(),
  },

  // ─── Article 3 ────────────────────────────────────────────────────
  {
    id: '3',
    slug: 'cicd-github-actions-best-practices',
    title: 'CI/CD Pipeline Best Practices with GitHub Actions',
    description:
      'A practical guide to building robust CI/CD pipelines with GitHub Actions -- covering workflow design, caching, secrets management, matrix builds, and deployment strategies.',
    coverImage: '/images/articles/github-actions.jpg',
    coverImageAlt: 'GitHub Actions CI/CD pipeline workflow',
    datePublished: '2024-04-22',
    dateModified: '2024-04-28',
    readingTime: '11 min read',
    category: enCategories.devops,
    tags: ['CI/CD', 'GitHub Actions', 'DevOps', 'Automation'],
    author: AUTHOR,
    featured: false,
    content: `
GitHub Actions has become one of the most popular CI/CD platforms thanks to its tight integration with GitHub, generous free tier, and a massive marketplace of reusable actions. But a poorly configured pipeline can be slow, flaky, and hard to maintain. Here is how to build one that is fast and reliable.

## Workflow Structure

A well-organized workflow separates concerns into distinct jobs. Here is a typical Node.js CI pipeline:

\`\`\`yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
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
\`\`\`

Notice the \`concurrency\` block -- it cancels in-progress runs when a new commit is pushed to the same branch, saving CI minutes.

## Caching Dependencies

Caching is the single biggest performance win. The \`setup-node\` action supports caching for npm, yarn, and pnpm out of the box:

\`\`\`yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: 'pnpm'  # automatically caches ~/.pnpm-store
\`\`\`

For more granular control, use \`actions/cache\`:

\`\`\`yaml
- uses: actions/cache@v4
  with:
    path: |
      ~/.pnpm-store
      node_modules/.cache
    key: deps-\${{ runner.os }}-\${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      deps-\${{ runner.os }}-
\`\`\`

## Secrets Management

Never hardcode secrets. Use GitHub encrypted secrets and pass them as environment variables:

\`\`\`yaml
env:
  DATABASE_URL: \${{ secrets.DATABASE_URL }}
  API_KEY: \${{ secrets.API_KEY }}

steps:
  - run: pnpm test
    env:
      # Only expose secrets to steps that need them
      TEST_DB_URL: \${{ secrets.TEST_DATABASE_URL }}
\`\`\`

Best practices:
- Use **Environment-scoped secrets** for production credentials (requires approval gates).
- Rotate secrets regularly.
- Use \`GITHUB_TOKEN\` for GitHub API operations -- it is automatically provided and scoped to the repository.

## Matrix Builds

Test across multiple versions or platforms in parallel:

\`\`\`yaml
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
        node-version: \${{ matrix.node-version }}
        cache: 'pnpm'
    - run: pnpm install --frozen-lockfile
    - run: pnpm test
      env:
        DB_TYPE: \${{ matrix.database }}
\`\`\`

## Deployment Strategies

For deployments, use GitHub Environments to add approval gates and protection rules:

\`\`\`yaml
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
        vercel-token: \${{ secrets.VERCEL_TOKEN }}
        vercel-args: '--prod'
\`\`\`

## Key Takeaways

- Use \`concurrency\` to cancel redundant runs and save CI minutes.
- Always cache dependencies -- it can cut install times from minutes to seconds.
- Scope secrets tightly: prefer environment-scoped secrets for production credentials.
- Use \`matrix\` for cross-platform/cross-version testing, but keep the matrix reasonable to avoid combinatorial explosion.
- Leverage GitHub Environments for deployment approval gates.
`.trim(),
  },

  // ─── Article 4 ────────────────────────────────────────────────────
  {
    id: '4',
    slug: 'building-rag-pipelines-langchain',
    title: 'Building RAG Pipelines with LangChain and Vector Databases',
    description:
      'Learn how to build Retrieval-Augmented Generation (RAG) pipelines using LangChain and vector databases -- from document ingestion and embedding to retrieval and generation.',
    coverImage: '/images/articles/rag-pipeline.jpg',
    coverImageAlt: 'RAG pipeline architecture diagram',
    datePublished: '2024-03-18',
    dateModified: '2024-03-25',
    readingTime: '15 min read',
    category: enCategories.aiMl,
    tags: ['RAG', 'LangChain', 'AI', 'Vector Database'],
    author: AUTHOR,
    featured: false,
    content: `
Large Language Models (LLMs) are powerful, but they have a critical limitation: their knowledge is frozen at training time. Retrieval-Augmented Generation (RAG) solves this by grounding LLM responses in your own data. In this article, we will build a complete RAG pipeline from scratch.

## What Is RAG?

RAG is a pattern where you:

1. **Retrieve** relevant documents from a knowledge base based on the user's query.
2. **Augment** the LLM prompt with those retrieved documents as context.
3. **Generate** a response that is grounded in the retrieved information.

This eliminates hallucination for domain-specific questions and keeps your AI up to date without retraining.

## Architecture Overview

A typical RAG pipeline has two phases:

\`\`\`
Indexing Phase (offline):
  Documents → Chunking → Embedding → Vector Store

Query Phase (online):
  User Query → Embedding → Similarity Search → Context Assembly → LLM → Response
\`\`\`

## Document Ingestion and Chunking

First, load your documents and split them into manageable chunks. LangChain provides document loaders for PDFs, websites, Notion, and more:

\`\`\`typescript
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'

// Load a PDF document
const loader = new PDFLoader('./knowledge-base/product-docs.pdf')
const docs = await loader.load()

// Split into chunks of ~1000 characters with 200 character overlap
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ['\\n\\n', '\\n', '. ', ' ', ''],
})
const chunks = await splitter.splitDocuments(docs)

console.log(\`Split \${docs.length} document(s) into \${chunks.length} chunks\`)
\`\`\`

The \`chunkOverlap\` parameter is critical -- it prevents context from being lost at chunk boundaries.

## Embedding and Vector Storage

Next, convert each chunk into a vector embedding and store it in a vector database. Here we use Pinecone, but the pattern is similar for Weaviate, Qdrant, or Chroma:

\`\`\`typescript
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
\`\`\`

Each chunk is converted into a 1536-dimensional vector. When a query comes in, we embed the query and find the most similar vectors using cosine similarity.

## Retrieval

At query time, embed the user's question and retrieve the top-K most relevant chunks:

\`\`\`typescript
const retriever = vectorStore.asRetriever({
  k: 4,           // return top 4 chunks
  filter: {       // optional metadata filter
    source: 'product-docs',
  },
})

const relevantDocs = await retriever.invoke('How do I configure rate limiting?')

console.log(relevantDocs.map((doc) => doc.pageContent))
\`\`\`

## Generation with Context

Finally, assemble the retrieved context into a prompt and call the LLM:

\`\`\`typescript
import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'

const model = new ChatOpenAI({ modelName: 'gpt-4o', temperature: 0 })

const prompt = PromptTemplate.fromTemplate(\`
You are a technical support assistant for abyte.
Answer the question based ONLY on the following context.
If the context doesn't contain the answer, say "I don't have enough information to answer that."

Context:
{context}

Question: {question}

Answer:\`)

const chain = prompt.pipe(model).pipe(new StringOutputParser())

const response = await chain.invoke({
  context: relevantDocs.map((d) => d.pageContent).join('\\n\\n---\\n\\n'),
  question: 'How do I configure rate limiting?',
})

console.log(response)
\`\`\`

## Improving Retrieval Quality

Raw similarity search is a starting point. To improve results:

- **Hybrid search** -- combine vector similarity with keyword (BM25) search. Pinecone and Weaviate support this natively.
- **Re-ranking** -- use a cross-encoder model (e.g., Cohere Rerank) to re-score retrieved chunks before passing them to the LLM.
- **Metadata filtering** -- filter by document type, date, or category before doing similarity search.
- **Query transformation** -- use the LLM to rewrite ambiguous queries into clearer search queries.

\`\`\`typescript
// Example: Multi-query retrieval
import { MultiQueryRetriever } from 'langchain/retrievers/multi_query'

const multiRetriever = MultiQueryRetriever.fromLLM({
  llm: model,
  retriever: vectorStore.asRetriever({ k: 4 }),
  queryCount: 3, // generate 3 variations of the query
})
\`\`\`

## Key Takeaways

- RAG grounds LLM responses in your own data, reducing hallucination and keeping answers current.
- **Chunk size and overlap** matter enormously -- experiment with different values for your domain.
- Use **hybrid search** and **re-ranking** to improve retrieval quality beyond basic vector similarity.
- Always include a **"I don't know"** fallback in your prompt to handle cases where the context does not contain the answer.
`.trim(),
  },

  // ─── Article 5 ────────────────────────────────────────────────────
  {
    id: '5',
    slug: 'art-of-code-review',
    title: 'The Art of Code Review: Beyond Finding Bugs',
    description:
      'Code review is not just about catching bugs -- it is a powerful tool for knowledge sharing, mentoring, and building a strong engineering culture. Here is how to do it well.',
    coverImage: '/images/articles/code-review.jpg',
    coverImageAlt: 'Team conducting a code review session',
    datePublished: '2024-02-14',
    dateModified: '2024-02-20',
    readingTime: '10 min read',
    category: enCategories.careerGrowth,
    tags: ['Code Review', 'Best Practices', 'Team Collaboration', 'Career'],
    author: AUTHOR,
    featured: false,
    content: `
Most engineers think code review is about finding bugs. While that is one benefit, the real value of code review lies elsewhere: knowledge transfer, design consistency, and team growth. After years of reviewing thousands of pull requests, here is what I have learned about doing it well.

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

**Good:** "This could fail when the array is empty. Consider adding a guard clause: \`if (!items.length) return []\`"

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

\`\`\`yaml
# .github/workflows/pr-check.yml
- name: Lint
  run: pnpm lint

- name: Type Check
  run: pnpm tsc --noEmit

- name: Test
  run: pnpm test

- name: Format Check
  run: pnpm prettier --check .
\`\`\`

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
- As a PR author, keep your changes small and your descriptions clear.
`.trim(),
  },

  // ─── Article 6 ────────────────────────────────────────────────────
  {
    id: '6',
    slug: 'advanced-typescript-patterns',
    title: 'Advanced TypeScript Patterns for Production Applications',
    description:
      'Go beyond the basics of TypeScript with advanced patterns like discriminated unions, template literal types, conditional types, and practical utility types for production code.',
    coverImage: '/images/articles/typescript-patterns.jpg',
    coverImageAlt: 'TypeScript code editor with advanced type patterns',
    datePublished: '2024-01-20',
    dateModified: '2024-01-28',
    readingTime: '13 min read',
    category: enCategories.webDevelopment,
    tags: ['TypeScript', 'Design Patterns', 'Type Safety', 'Web Development'],
    author: AUTHOR,
    featured: false,
    content: `
TypeScript's type system is remarkably powerful, but most codebases barely scratch the surface. In this article, we will explore advanced patterns that make production TypeScript code safer, more expressive, and easier to refactor.

## Discriminated Unions

Discriminated unions are the single most useful TypeScript pattern for modeling state. Instead of using optional fields or type assertions, you give each variant a literal discriminant:

\`\`\`typescript
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
\`\`\`

The compiler ensures you handle every case. Add a new variant? You get a compile error if you forget to handle it. No more \`undefined is not a function\` at runtime.

## Template Literal Types

Template literal types let you build string types from other types, which is incredibly useful for APIs, CSS, and event systems:

\`\`\`typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type ApiVersion = 'v1' | 'v2'

// Generates: '/api/v1/users' | '/api/v2/users' | '/api/v1/posts' | ...
type ApiEndpoint = \`/api/\${ApiVersion}/\${'users' | 'posts' | 'comments'}\`

// Event handler naming convention
type EventName = 'click' | 'hover' | 'focus'
type EventHandler = \`on\${Capitalize<EventName>}\`
// Result: 'onClick' | 'onHover' | 'onFocus'

// Type-safe CSS units
type CSSUnit = 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw'
type CSSValue = \`\${number}\${CSSUnit}\`

const width: CSSValue = '100px'  // valid
const bad: CSSValue = '100'      // error: missing unit
\`\`\`

## Conditional Types

Conditional types let you create types that depend on other types. They are the foundation of many built-in utility types:

\`\`\`typescript
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
\`\`\`

## Practical Utility Types

Here are utility types I use constantly in production code:

\`\`\`typescript
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
  throw new Error(\`Unexpected value: \${value}\`)
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
\`\`\`

## Branded Types

TypeScript uses structural typing, which means \`string\` and \`string\` are interchangeable. Branded types let you create nominally-distinct types:

\`\`\`typescript
type Brand<T, B extends string> = T & { readonly __brand: B }

type UserId = Brand<string, 'UserId'>
type OrderId = Brand<string, 'OrderId'>

function getUser(id: UserId) { /* ... */ }
function getOrder(id: OrderId) { /* ... */ }

const userId = 'user-123' as UserId
const orderId = 'order-456' as OrderId

getUser(userId)   // valid
getUser(orderId)  // error: OrderId is not assignable to UserId
\`\`\`

This prevents accidentally passing an order ID where a user ID is expected -- a bug that structural typing alone cannot catch.

## Key Takeaways

- **Discriminated unions** replace optional fields and type assertions for modeling state.
- **Template literal types** give you type-safe strings for APIs, CSS, and naming conventions.
- **Conditional types** unlock powerful type transformations and inference.
- **Branded types** add nominal typing on top of TypeScript's structural system, preventing ID mix-ups.
- These patterns pay for themselves in reduced runtime bugs and safer refactoring.
`.trim(),
  },
]
