import type { Article, Category } from '@/types'
import { AUTHOR } from '../constants'

const idCategories = {
  webDevelopment: {
    name: 'Pengembangan Web',
    slug: 'web-development',
    description: 'Teknik pengembangan web modern, framework, dan best practices.',
  },
  systemDesign: {
    name: 'Desain Sistem',
    slug: 'system-design',
    description: 'Pola arsitektur, skalabilitas, dan sistem terdistribusi.',
  },
  devops: {
    name: 'DevOps',
    slug: 'devops',
    description: 'CI/CD, kontainerisasi, infrastruktur cloud, dan strategi deployment.',
  },
  aiMl: {
    name: 'AI & Machine Learning',
    slug: 'ai-ml',
    description: 'Kecerdasan buatan, machine learning, dan wawasan data sains.',
  },
  careerGrowth: {
    name: 'Karir & Pengembangan',
    slug: 'career-growth',
    description: 'Pengembangan profesional, soft skills, dan saran karir untuk engineer.',
  },
} satisfies Record<string, Category>

export const idArticles: Article[] = [
  {
    id: '1',
    slug: 'mastering-server-components-nextjs-14',
    title: 'Menguasai React Server Components di Next.js 14',
    description:
      'Pelajari cara memanfaatkan React Server Components di Next.js 14 untuk membangun aplikasi web yang lebih cepat dan efisien.',
    coverImage: '/images/articles/server-components.jpg',
    coverImageAlt: 'Diagram arsitektur React Server Components',
    datePublished: '2024-02-15',
    dateModified: '2024-02-15',
    readingTime: '8 menit baca',
    category: idCategories.webDevelopment,
    tags: ['Next.js', 'React', 'Server Components', 'Performa'],
    author: AUTHOR,
    featured: true,
    content: `## Apa Itu React Server Components?

React Server Components (RSC) adalah paradigma baru dalam pengembangan aplikasi React yang memungkinkan komponen dirender langsung di server. Berbeda dengan Server-Side Rendering (SSR) tradisional yang mengirim HTML lengkap ke klien, RSC mengirimkan representasi serial dari komponen tanpa mengikutsertakan JavaScript-nya ke browser.

Dengan kata lain, komponen server tidak menambah ukuran bundle JavaScript di sisi klien. Ini adalah lompatan besar dalam hal performa, terutama untuk aplikasi yang banyak menampilkan konten statis.

## Mengapa RSC Penting?

Keunggulan utama RSC meliputi:

- **Bundle size lebih kecil** — kode komponen server tidak pernah sampai ke browser
- **Data fetching langsung** — bisa mengakses database atau API internal tanpa membuat API route terpisah
- **Keamanan lebih baik** — logika sensitif seperti token dan kredensial tetap di server
- **Streaming** — konten bisa dikirim secara bertahap sehingga Time to First Byte (TTFB) lebih cepat

## Server vs Client Components

Di Next.js 14, semua komponen secara default adalah **Server Components**. Untuk membuat Client Component, kamu perlu menambahkan direktif \`'use client'\` di bagian atas file:

\`\`\`tsx
// app/page.tsx — Server Component (default)
import { db } from '@/lib/db'
import { UserCard } from './UserCard'

export default async function HomePage() {
  const users = await db.user.findMany()

  return (
    <main>
      <h1>Daftar Pengguna</h1>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </main>
  )
}
\`\`\`

\`\`\`tsx
// app/UserCard.tsx — Client Component
'use client'

import { useState } from 'react'

interface UserCardProps {
  user: { id: string; name: string; email: string }
}

export function UserCard({ user }: UserCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div onClick={() => setExpanded(!expanded)}>
      <h3>{user.name}</h3>
      {expanded && <p>{user.email}</p>}
    </div>
  )
}
\`\`\`

## Pola Komposisi yang Tepat

Kunci utama menggunakan RSC adalah **mengarahkan \`'use client'\` sedalam mungkin**. Jangan langsung menandai seluruh halaman sebagai client component. Sebagai gantinya, ekstrak hanya bagian interaktif yang membutuhkan state atau event handler.

\`\`\`tsx
// Jangan begini — seluruh halaman jadi client component
'use client'
export default function Dashboard({ data }) {
  const [tab, setTab] = useState('overview')
  // ... seluruh logic di sini
}

// Lakukan begini — pisahkan leaf component interaktif
// DashboardTabs.tsx
'use client'
export function DashboardTabs({ onTabChange }) {
  const [tab, setTab] = useState('overview')
  return <TabBar active={tab} onChange={setTab} onTabChange={onTabChange} />
}

// page.tsx — tetap server component
export default async function DashboardPage() {
  const data = await fetchDashboardData()
  return <DashboardLayout data={data} />
}
\`\`\`

## Data Fetching di Server Component

Salah satu keunggulan terbesar RSC adalah kemampuan melakukan data fetching langsung tanpa useEffect atau library client-side:

\`\`\`tsx
import { notFound } from 'next/navigation'

export default async function ArticlePage({
  params,
}: {
  params: { slug: string }
}) {
  const article = await getArticle(params.slug)

  if (!article) {
    notFound()
  }

  return (
    <article>
      <h1>{article.title}</h1>
      <time>{article.datePublished}</time>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </article>
  )
}
\`\`\`

## Kesimpulan

React Server Components mengubah cara kita memikirkan arsitektur aplikasi React. Dengan Next.js 14, pola ini sudah menjadi default dan sangat direkomendasikan. Kuncinya adalah: **gunakan server component sebisa mungkin, dan hanya beralih ke client component saat kamu benar-benar membutuhkan interaktivitas di sisi klien**.

Mulai sekarang, biasakan untuk bertanya pada diri sendiri setiap kali membuat komponen baru: "Apakah komponen ini benar-benar perlu jadi client component?" Sebagian besar waktu, jawabannya adalah tidak.`,
  },
  {
    id: '2',
    slug: 'designing-scalable-microservices',
    title: 'Mendesain Arsitektur Microservices yang Skalabel',
    description:
      'Panduan lengkap untuk mendesain arsitektur microservices yang dapat berkembang seiring pertumbuhan bisnis.',
    coverImage: '/images/articles/microservices.jpg',
    coverImageAlt: 'Diagram arsitektur microservices',
    datePublished: '2024-03-10',
    dateModified: '2024-03-10',
    readingTime: '10 menit baca',
    category: idCategories.systemDesign,
    tags: ['Microservices', 'Arsitektur', 'Skalabilitas', 'Desain Sistem'],
    author: AUTHOR,
    featured: false,
    content: `## Mengapa Microservices?

Arsitektur microservices memecah aplikasi monolitik menjadi kumpulan layanan kecil yang mandiri, masing-masing bertanggung jawab atas satu bisnis domain tertentu. Pendekatan ini memungkinkan tim untuk mengembangkan, men-deploy, dan menskalakan setiap layanan secara independen.

Namun, microservices bukan solusi ajaib. Tanpa desain yang tepat, kamu bisa berakhir dengan "distributed monolith" — sistem yang lebih kompleks tanpa manfaat skalabilitas yang dijanjikan.

## Prinsip Dekomposisi Layanan

Langkah pertama adalah memecah sistem berdasarkan **Domain-Driven Design (DDD)**. Identifikasi *bounded context* — batasan logis di mana model data dan aturan bisnis tertentu berlaku.

\`\`\`
E-commerce System:
├── Product Catalog Service    (bounded context: katalog produk)
├── Order Service              (bounded context: pemesanan)
├── Payment Service            (bounded context: pembayaran)
├── Inventory Service          (bounded context: stok barang)
├── Notification Service       (bounded context: notifikasi)
└── User Service               (bounded context: autentikasi & profil)
\`\`\`

Setiap layanan memiliki:
- Database sendiri (database per service pattern)
- API yang terdefinisi jelas
- Tim yang bertanggung jawab

## Pola Komunikasi

### Synchronous (Request-Response)

Menggunakan REST atau gRPC untuk komunikasi langsung. Cocok untuk query yang membutuhkan respons segera.

\`\`\`typescript
// API Gateway mengarahkan request ke layanan yang tepat
app.get('/api/orders/:id', async (req, res) => {
  const order = await orderService.getOrder(req.params.id)
  const product = await productService.getProduct(order.productId)
  const user = await userService.getUser(order.userId)

  return res.json({ ...order, product, user })
})
\`\`\`

### Asynchronous (Event-Driven)

Menggunakan message broker seperti RabbitMQ atau Kafka. Cocok untuk proses yang tidak membutuhkan respons langsung.

\`\`\`typescript
// Order Service mempublish event saat order dibuat
class OrderService {
  async createOrder(data: CreateOrderDTO) {
    const order = await this.orderRepo.save(data)

    // Publish event — layanan lain bereaksi secara independen
    await this.eventBus.publish('order.created', {
      orderId: order.id,
      productId: order.productId,
      quantity: order.quantity,
      userId: order.userId,
    })

    return order
  }
}

// Inventory Service mendengarkan event dan mengurangi stok
class InventoryService {
  @OnEvent('order.created')
  async handleOrderCreated(event: OrderCreatedEvent) {
    await this.inventoryRepo.decrementStock(
      event.productId,
      event.quantity
    )
  }
}
\`\`\`

## Strategi Manajemen Data

Dalam microservices, setiap layanan harus memiliki **database mandiri**. Ini dikenal sebagai pola *Database per Service*:

- **Layanan Order** → PostgreSQL (data transaksi relational)
- **Layanan Product Catalog** → MongoDB (dokumen produk fleksibel)
- **Layanan Search** → Elasticsearch (pencarian full-text)
- **Layanan Session** → Redis (cache cepat)

Untuk konsistensi data antar layanan, gunakan **Saga Pattern** — serangkaian transaksi lokal yang diorkestrasi melalui event:

\`\`\`
Order Saga:
1. Order Service → create order (PENDING)
2. Payment Service → process payment
3. Inventory Service → reserve stock
4. Order Service → update order (CONFIRMED)

Jika langkah 3 gagal:
  → Payment Service ← refund
  → Order Service ← cancel order
\`\`\`

## Deployment dan Skalabilitas

Setiap layanan harus dikontainerisasi dan bisa di-deploy secara independen:

\`\`\`yaml
# docker-compose.yml
services:
  order-service:
    build: ./services/order
    replicas: 3
    environment:
      - DB_URL=postgres://db:5432/orders

  inventory-service:
    build: ./services/inventory
    replicas: 2
    environment:
      - DB_URL=mongodb://db:27017/inventory

  api-gateway:
    image: nginx:alpine
    ports:
      - '80:80'
\`\`\`

Gunakan Kubernetes atau Docker Swarm untuk orchestrasi, dan pastikan setiap layanan memiliki:
- Health check endpoint
- Circuit breaker untuk mencegah cascading failure
- Retry mechanism dengan exponential backoff
- Observability (logging, tracing, metrics)

## Kesimpulan

Microservices yang sukses dimulai dari dekomposisi yang tepat berdasarkan domain bisnis, bukan berdasarkan teknologi. Komunikasi antar layanan harus jelas — gunakan synchronous untuk query dan asynchronous untuk command. Yang terpenting, investasikan pada observability sejak awal karena debugging di lingkungan terdistribusi jauh lebih sulit dibanding monolitik.`,
  },
  {
    id: '3',
    slug: 'cicd-github-actions-best-practices',
    title: 'Best Practices Pipeline CI/CD dengan GitHub Actions',
    description:
      'Pelajari cara membangun pipeline CI/CD yang efisien dan andal menggunakan GitHub Actions dengan berbagai best practices.',
    coverImage: '/images/articles/github-actions.jpg',
    coverImageAlt: 'Alur kerja pipeline CI/CD GitHub Actions',
    datePublished: '2024-01-20',
    dateModified: '2024-01-20',
    readingTime: '9 menit baca',
    category: idCategories.devops,
    tags: ['CI/CD', 'GitHub Actions', 'DevOps', 'Otomasi'],
    author: AUTHOR,
    featured: false,
    content: `## Mengapa GitHub Actions?

GitHub Actions adalah platform CI/CD yang terintegrasi langsung dengan GitHub. Karena sebagian besar proyek open-source dan private repository sudah di GitHub, menggunakan GitHub Actions berarti tidak perlu layanan CI/CD pihak ketiga — semuanya ada di satu tempat.

Artikel ini membahas best practices yang saya pelajari dari mengelola pipeline untuk puluhan repository di lingkungan produksi.

## Struktur Workflow yang Rapi

Pisahkan workflow berdasarkan fungsinya:

\`\`\`
.github/workflows/
├── ci.yml          # lint, test, build on PR
├── deploy-staging.yml   # deploy ke staging
├── deploy-prod.yml      # deploy ke production
└── scheduled-tasks.yml  # cron jobs
\`\`\`

Contoh workflow CI yang solid:

\`\`\`yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main, develop]

concurrency:
  group: ci-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Test
        run: npm run test -- --coverage

      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/
\`\`\`

Perhatikan penggunaan \`concurrency\` — ini membatalkan workflow sebelumnya jika ada push baru, menghemat menit billing.

## Caching untuk Kecepatan

Cache dependency dan build artifact untuk mempercepat pipeline secara signifikan:

\`\`\`yaml
- uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      node_modules/.cache
      .next/cache
    key: \${{ runner.os }}-nextjs-\${{ hashFiles('**/package-lock.json') }}-\${{ hashFiles('**/*.tsx') }}
    restore-keys: |
      \${{ runner.os }}-nextjs-\${{ hashFiles('**/package-lock.json') }}-
      \${{ runner.os }}-nextjs-
\`\`\`

Dengan caching yang tepat, waktu build Next.js saya turun dari 3 menit menjadi kurang dari 40 detik.

## Manajemen Secrets

Jangan pernah hardcode secrets. Gunakan GitHub Secrets dan pisahkan berdasarkan environment:

\`\`\`yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy
        env:
          DATABASE_URL: \${{ secrets.DATABASE_URL }}
          API_KEY: \${{ secrets.API_KEY }}
        run: ./deploy.sh

      # Untuk secret yang perlu di-file (misal service account)
      - name: Setup credentials
        uses: google-github-actions/auth@v2
        with:
          credentials_json: \${{ secrets.GCP_SA_KEY }}
\`\`\`

Tips penting:
- Gunakan **Environment Protection Rules** untuk production deployment
- Aktifkan **required reviewers** sebelum deploy ke production
- Rotasi secrets secara berkala

## Matrix Builds

Test di berbagai versi Node.js dan OS secara paralel:

\`\`\`yaml
test:
  runs-on: ubuntu-latest
  strategy:
    fail-fast: false
    matrix:
      node-version: [18, 20, 22]
      database: [postgres, mysql]
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node-version }}
    - run: npm ci
    - run: npm test
      env:
        DB_TYPE: \${{ matrix.database }}
\`\`\`

## Strategi Deployment

Gunakan environment-based deployment dengan approval gates:

\`\`\`yaml
deploy-production:
  needs: [lint-and-test, build]
  if: github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest
  environment:
    name: production
    url: https://myapp.com
  steps:
    - uses: actions/download-artifact@v4
      with:
        name: build
        path: .next

    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: \${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
\`\`\`

## Reusable Actions

Untuk menghindari duplikasi, buat reusable composite action:

\`\`\`yaml
# .github/actions/setup-project/action.yml
name: 'Setup Project'
description: 'Setup Node.js, install deps, restore cache'
runs:
  using: 'composite'
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    - run: npm ci
      shell: bash
\`\`\`

Lalu gunakan di setiap workflow:

\`\`\`yaml
steps:
  - uses: actions/checkout@v4
  - uses: ./.github/actions/setup-project
\`\`\`

## Kesimpulan

Pipeline CI/CD yang baik adalah investasi jangka panjang. Mulai dari yang sederhana — lint, test, build — lalu tambah caching, matrix builds, dan deployment gates seiring kebutuhan. Yang terpenting: pastikan pipeline kamu cepat (di bawah 5 menit untuk CI) agar developer tidak tergoda untuk melewati checks.`,
  },
  {
    id: '4',
    slug: 'building-rag-pipelines-langchain',
    title: 'Membangun Pipeline RAG dengan LangChain dan Vector Database',
    description:
      'Pelajari cara membangun Retrieval-Augmented Generation (RAG) pipeline untuk meningkatkan akurasi respons LLM dengan konteks dari data kamu sendiri.',
    coverImage: '/images/articles/rag-pipeline.jpg',
    coverImageAlt: 'Diagram arsitektur pipeline RAG',
    datePublished: '2024-04-05',
    dateModified: '2024-04-05',
    readingTime: '11 menit baca',
    category: idCategories.aiMl,
    tags: ['RAG', 'LangChain', 'AI', 'Vector Database'],
    author: AUTHOR,
    featured: false,
    content: `## Apa Itu RAG?

Retrieval-Augmented Generation (RAG) adalah teknik yang menggabungkan kemampuan Large Language Model (LLM) dengan basis pengetahuan eksternal. Alih-alih mengandalkan pengetahuan yang sudah ada di dalam model (yang bisa sudah usang atau tidak lengkap), RAG mengambil dokumen relevan terlebih dahulu, lalu memberikannya sebagai konteks saat LLM menghasilkan jawaban.

Ini memecahkan tiga masalah utama LLM:
- **Hallucination** — LLM cenderung mengarang fakta
- **Knowledge cutoff** — pengetahuan model terbatas pada data training
- **Domain specificity** — model tidak tahu data internal perusahaan kamu

## Arsitektur Pipeline RAG

Pipeline RAG memiliki dua fase utama:

### Fase 1: Indexing (Offline)

Dokumen dipecah menjadi chunk, diubah menjadi vector embedding, dan disimpan di vector database.

\`\`\`python
from langchain.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore

# 1. Load dokumen
loader = DirectoryLoader(
    './docs',
    glob='**/*.md',
    loader_cls=TextLoader
)
documents = loader.load()

# 2. Split menjadi chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    separators=["\\n## ", "\\n\\n", "\\n", " "]
)
chunks = text_splitter.split_documents(documents)

# 3. Buat embedding dan simpan ke vector store
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vector_store = PineconeVectorStore.from_documents(
    documents=chunks,
    embedding=embeddings,
    index_name="knowledge-base"
)
\`\`\`

### Fase 2: Retrieval & Generation (Online)

Saat user bertanya, pipeline mengambil dokumen relevan dan mengirimkannya ke LLM sebagai konteks.

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA

# Setup retriever
retriever = vector_store.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 5}
)

# Setup LLM
llm = ChatOpenAI(model="gpt-4o", temperature=0)

# Buat RAG chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True
)

# Query
result = qa_chain.invoke({"query": "Bagaimana cara mengatur CI/CD?"})
print(result["result"])
\`\`\`

## Strategi Chunking yang Efektif

Cara kamu memecah dokumen sangat mempengaruhi kualitas retrieval:

| Strategi | Kapan Digunakan | Ukuran Chunk |
|----------|----------------|--------------|
| Fixed size | Dokumen seragam | 500-1000 token |
| Recursive | Dokumen dengan struktur campuran | 1000 token + overlap 200 |
| Semantic | Dokumen dengan topik bervariasi | Berdasarkan boundary makna |
| Document-level | FAQ atau pasal hukum | 1 dokumen = 1 chunk |

\`\`\`python
# Semantic splitting — pecah berdasarkan makna
from langchain_experimental.text_splitter import SemanticChunker

semantic_splitter = SemanticChunker(
    OpenAIEmbeddings(),
    breakpoint_threshold_type="percentile"
)
semantic_chunks = semantic_splitter.split_documents(documents)
\`\`\`

## Advanced Retrieval Techniques

### Hybrid Search

Gabungkan keyword search (BM25) dengan semantic search untuk hasil lebih baik:

\`\`\`python
from langchain.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever

# BM25 retriever (keyword-based)
bm25_retriever = BM25Retriever.from_documents(chunks)
bm25_retriever.k = 5

# Vector retriever (semantic)
vector_retriever = vector_store.as_retriever(search_kwargs={"k": 5})

# Gabungkan keduanya
ensemble_retriever = EnsembleRetriever(
    retrievers=[bm25_retriever, vector_retriever],
    weights=[0.3, 0.7]
)
\`\`\`

### Re-ranking

Gunakan model re-ranking untuk menyaring hasil retrieval:

\`\`\`python
from langchain.retrievers import ContextualCompressionRetriever
from langchain_cohere import CohereRerank

compressor = CohereRerank(model="rerank-v3.5", top_n=3)
compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=ensemble_retriever
)
\`\`\`

## Tips Produksi

1. **Evaluasi secara rutin** — buat test set dengan pertanyaan dan jawaban yang diharapkan, ukur precision dan recall
2. **Metadata filtering** — tambahkan metadata (tanggal, kategori, penulis) pada setiap chunk untuk filtering yang lebih presisi
3. **Cache** — pertanyaan yang sering muncul bisa di-cache untuk mengurangi latency dan biaya API
4. **Guardrails** — tambahkan validasi agar LLM hanya menjawab berdasarkan konteks yang diberikan, bukan pengetahuan umum

## Kesimpulan

RAG adalah cara paling praktis untuk memberdayakan LLM dengan data spesifik kamu. Mulai dari setup sederhana — chunking dasar dan similarity search — lalu tingkatkan dengan hybrid search dan re-ranking seiring evaluasi hasilnya. Kuncinya ada di kualitas chunking dan relevansi retrieval.`,
  },
  {
    id: '5',
    slug: 'art-of-code-review',
    title: 'Seni Code Review: Lebih dari Sekadar Mencari Bug',
    description:
      'Code review yang efektif bukan hanya tentang menemukan bug, tapi juga tentang berbagi pengetahuan dan menjaga kualitas kode jangka panjang.',
    coverImage: '/images/articles/code-review.jpg',
    coverImageAlt: 'Tim melakukan sesi code review',
    datePublished: '2024-05-12',
    dateModified: '2024-05-12',
    readingTime: '7 menit baca',
    category: idCategories.careerGrowth,
    tags: ['Code Review', 'Best Practices', 'Kolaborasi Tim', 'Karir'],
    author: AUTHOR,
    featured: false,
    content: `## Filosofi Code Review

Banyak engineer menganggap code review sebagai gerbang quality control — tugasnya menemukan bug sebelum code masuk production. Pandangan ini tidak sepenuhnya salah, tapi sangat terbatas.

Code review yang baik sebenarnya punya tiga tujuan:

1. **Berbagi pengetahuan** — reviewer dan author sama-sama belajar
2. **Menjaga konsistensi** — kode harus bisa dipahami oleh seluruh tim, bukan hanya penulisnya
3. **Meningkatkan desain** — mendiskusikan alternatif arsitektur sebelum terlalu terikat pada satu pendekatan

Bug adalah bonus, bukan fokus utama.

## Apa yang Perlu Diperhatikan

Saat melakukan review, saya menggunakan checklist mental berikut (diurutkan dari prioritas tertinggi):

### 1. Apakah Kode Ini Benar?

Ini pertanyaan paling mendasar. Baca logikanya, bukan hanya syntax-nya. Coba temukan edge case:

\`\`\`typescript
// Reviewer: "Bagaimana jika items kosong?"
function getAveragePrice(items: Item[]) {
  const total = items.reduce((sum, item) => sum + item.price, 0)
  return total / items.length // Division by zero!
}

// Seharusnya:
function getAveragePrice(items: Item[]) {
  if (items.length === 0) return 0
  const total = items.reduce((sum, item) => sum + item.price, 0)
  return total / items.length
}
\`\`\`

### 2. Apakah Kode Ini Bisa Dipertahankan?

Kode yang berfungsi hari ini bisa jadi beban teknis besok. Perhatikan:

- **Penamaan** — apakah nama fungsi dan variabel menjelaskan maksudnya?
- **Duplikasi** — apakah ada logika yang bisa di-extract menjadi fungsi reusable?
- **Kompleksitas** — apakah ada cara lebih sederhana untuk mencapai hasil yang sama?

\`\`\`typescript
// Sulit dipahami
const d = u.filter(x => x.a && x.b > 18 && !x.c)

// Lebih jelas
const eligibleUsers = users.filter(
  (user) => user.isActive && user.age > 18 && !user.isBanned
)
\`\`\`

### 3. Apakah Ada Masalah Keamanan?

Perhatikan potensi:
- SQL injection atau XSS
- Secrets yang ter-ekspos di kode
- Data sensitif yang tidak di-sanitize
- Missing authentication/authorization check

### 4. Apakah Cukup Ditest?

Setiap logika bisnis baru harus disertai test. Saat review, cek:
- Apakah happy path di-test?
- Apakah edge case di-cover?
- Apakah test cukup meaningful atau hanya sekadar ada?

## Cara Memberikan Feedback yang Baik

Cara kamu menulis komentar review sama pentingnya dengan isi komentarnya:

\`\`\`markdown
// ❌ Buruk: Menyalahkan
"Kenapa kamu buat begini? Ini jelas salah."

// ✅ Baik: Membantu
"Ada edge case yang perlu ditangani di sini — bagaimana jika
\`items\` kosong? Kita bisa tambah guard clause di awal."

// ❌ Buruk: Terlalu subjektif
"Saya tidak suka cara ini."

// ✅ Baik: Memberi alasan
"Pendekatan ini works, tapi menggunakan Map bisa lebih
efisien karena lookup-nya O(1) dibanding Array.find() yang
O(n). Apakah worth considering?"
\`\`\`

Prinsip komentar code review:

- **Tanyakan, jangan menuduh** — "Have you considered..." bukannya "You forgot..."
- **Beri alasan** — jangan hanya bilang "ubah ini", jelaskan mengapa
- **Beri alternatif** — kalau mengkritik, tawarkan solusi konkret
- **Bedakan severity** — gunakan prefix seperti \`nit:\` untuk minor issues, \`suggestion:\` untuk alternatif, tanpa prefix untuk blocking issues

## Mengotomasi Apa yang Bisa Diotomasi

Jangan buang waktu reviewer untuk hal yang bisa diotomasi:

- **Linter & formatter** (ESLint, Prettier) — handle style secara otomatis
- **Type checker** — pastikan TypeScript build passing sebelum review
- **Automated tests** — CI harus jalan sebelum reviewer melihat PR
- **Danger.js / PR bots** — otomasi checklist (ada perubahan DB? Ada migration? Ada perubahan API contract?)

\`\`\`typescript
// dangerfile.ts
import { danger, warn, fail } from 'danger'

// Peringatkan jika PR terlalu besar
if (danger.github.pr.additions > 500) {
  warn('PR ini cukup besar. Pertimbangkan untuk dipecah.')
}

// Gagal jika tidak ada perubahan test
const hasTestChanges = danger.git.modified_files.some(
  (f) => f.includes('.test.') || f.includes('.spec.')
)
if (!hasTestChanges) {
  fail('PR ini tidak memiliki perubahan test. Tambahkan test untuk perubahan kamu.')
}
\`\`\`

## Tips untuk Author PR

Sebagai author, kamu bisa mempermudah hidup reviewer:

1. **Tulis PR description yang jelas** — jelaskan *mengapa* perubahan ini dibutuhkan, bukan hanya *apa* yang berubah
2. **Buat PR kecil** — di bawah 400 baris idealnya
3. **Self-review dulu** — baca ulang diff kamu sendiri sebelum request review
4. **Tunjukkan area yang perlu perhatian** — kalau ada bagian yang tricky, beri komentar di situ

## Kesimpulan

Code review adalah investasi terbaik untuk kualitas kode tim kamu dalam jangka panjang. Ini bukan tentang mencari kesalahan, tapi tentang membangun budaya kolaborasi dan pembelajaran bersama. Reviewer yang baik adalah mentor, bukan gatekeeper. Dan author yang baik adalah kolaborator, bukan yang defensif.`,
  },
  {
    id: '6',
    slug: 'advanced-typescript-patterns',
    title: 'Pola TypeScript Lanjutan untuk Aplikasi Produksi',
    description:
      'Eksplorasi pola TypeScript tingkat lanjutan yang akan membuat kode kamu lebih aman, fleksibel, dan mudah dipertahankan.',
    coverImage: '/images/articles/typescript-patterns.jpg',
    coverImageAlt: 'Editor kode TypeScript dengan pola tipe lanjutan',
    datePublished: '2024-06-01',
    dateModified: '2024-06-01',
    readingTime: '10 menit baca',
    category: idCategories.webDevelopment,
    tags: ['TypeScript', 'Pola Desain', 'Keamanan Tipe', 'Pengembangan Web'],
    author: AUTHOR,
    featured: false,
    content: `## Mengapa TypeScript Lanjutan?

TypeScript sudah jauh melampaui "JavaScript dengan tipe." Fitur-fitur lanjutan seperti conditional types, template literal types, dan mapped types memungkinkan kamu untuk mengekspresikan invariant bisnis secara langsung di level tipe — artinya kesalahan tertangkap saat compile, bukan saat runtime.

Artikel ini membahas pola-pola yang sering saya gunakan di kodebase produksi.

## Discriminated Unions

Pola paling fundamental untuk memodelkan state yang eksklusif. Alih-alih menggunakan boolean flag yang bisa konflik, gunakan union type dengan tag eksplisit:

\`\`\`typescript
// ❌ Rentan terhadap state tidak valid
interface RequestState {
  isLoading: boolean
  isError: boolean
  data?: User[]
  error?: Error
}
// isLoading: true, isError: true — state ini tidak masuk akal!

// ✅ Discriminated union — setiap state eksklusif
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

function handleState(state: RequestState<User[]>) {
  switch (state.status) {
    case 'idle':
      return 'Silakan mulai pencarian'
    case 'loading':
      return 'Memuat...'
    case 'success':
      return \`\${state.data.length} pengguna ditemukan\`
    case 'error':
      return \`Error: \${state.error.message}\`
  }
}
\`\`\`

Keuntungan: TypeScript tahu bahwa \`data\` pasti ada saat \`status === 'success'\` — tidak perlu optional chaining atau type assertion.

## Template Literal Types

Template literal types memungkinkan kamu membangun tipe string yang kompleks secara deklaratif:

\`\`\`typescript
// Event system yang type-safe
type EventName = 'click' | 'hover' | 'focus'
type EventHandler = \`on\${Capitalize<EventName>}\`

// Hasil: 'onClick' | 'onHover' | 'onFocus'

// Lebih powerful: constraining object keys
type PropEventSource<T> = {
  [K in keyof T as \`on\${Capitalize<string & K>}Change\`]?: (
    newValue: T[K]
  ) => void
}

interface UserForm {
  name: string
  age: number
  email: string
}

// Hasilnya type-safe:
type UserFormEvents = PropEventSource<UserForm>
// {
//   onNameChange?: (newValue: string) => void
//   onAgeChange?: (newValue: number) => void
//   onEmailChange?: (newValue: string) => void
// }

function createUserFormEvents(): UserFormEvents {
  return {
    onNameChange: (name) => console.log(\`Nama berubah: \${name}\`),
    onAgeChange: (age) => console.log(\`Umur berubah: \${age}\`),
  }
}
\`\`\`

## Conditional Types

Conditional types memungkinkan tipe berubah berdasarkan kondisi, sangat berguna untuk utility functions:

\`\`\`typescript
// Tipe return yang adaptif berdasarkan input
type ApiResponse<T extends 'user' | 'product'> =
  T extends 'user'
    ? { id: string; name: string; email: string }
    : T extends 'product'
      ? { id: string; title: string; price: number }
      : never

async function fetchData<T extends 'user' | 'product'>(
  resource: T
): Promise<ApiResponse<T>> {
  const response = await fetch(\`/api/\${resource}\`)
  return response.json()
}

// TypeScript tahu return type-nya!
const user = await fetchData('user')
// user: { id: string; name: string; email: string }
console.log(user.name) // ✅
console.log(user.price) // ❌ Error: Property 'price' does not exist
\`\`\`

## Advanced Utility Types

### DeepPartial

Membuat semua property nested menjadi optional:

\`\`\`typescript
type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T

interface Config {
  database: {
    host: string
    port: number
    credentials: {
      username: string
      password: string
    }
  }
  cache: {
    ttl: number
  }
}

// Semua nested property jadi optional
type PartialConfig = DeepPartial<Config>

const config: PartialConfig = {
  database: {
    credentials: {
      username: 'admin',
      // password bisa di-skip karena optional
    },
  },
}
\`\`\`

### StrictOmit dengan Validasi Key

Membuat Omit yang menolak key yang tidak ada di tipe asal:

\`\`\`typescript
type StrictOmit<T, K extends keyof T> = Omit<T, K>

interface User {
  id: string
  name: string
  email: string
}

// ✅ Ini valid
type CreateUserInput = StrictOmit<User, 'id'>

// ❌ Error: Argument of type '"age"' is not assignable
type Wrong = StrictOmit<User, 'age'>
\`\`\`

### Branded Types

Mencegat tipe primitif yang secara struktural identik tapi secara semantik berbeda:

\`\`\`typescript
type Brand<T, B extends string> = T & { readonly __brand: B }

type UserId = Brand<string, 'UserId'>
type OrderId = Brand<string, 'OrderId'>

function getUser(id: UserId) { /* ... */ }
function getOrder(id: OrderId) { /* ... */ }

const userId = 'abc-123' as UserId
const orderId = 'xyz-789' as OrderId

getUser(userId)   // ✅
getUser(orderId)  // ❌ Error! Type 'OrderId' is not assignable to type 'UserId'
\`\`\`

## Exhaustive Checking

Pastikan switch/case menangani semua kemungkinan:

\`\`\`typescript
function assertNever(value: never): never {
  throw new Error(\`Unexpected value: \${value}\`)
}

type Status = 'pending' | 'active' | 'suspended'

function getStatusColor(status: Status): string {
  switch (status) {
    case 'pending':
      return 'yellow'
    case 'active':
      return 'green'
    case 'suspended':
      return 'red'
    default:
      return assertNever(status)
  }
}
// Jika ada status baru ditambahkan tapi belum di-handle,
// TypeScript akan error di compile time!
\`\`\`

## Kesimpulan

TypeScript yang powerful bukan tentang menggunakan semua fitur yang ada — tapi tentang memilih pola yang tepat untuk mengekspresikan invariant bisnis kamu. Discriminated unions untuk state management, template literal types untuk API yang konsisten, conditional types untuk generic yang adaptif, dan branded types untuk mencegah kesalahan konversi tipe.

Mulai dari yang paling berdampak: konversi boolean flags ke discriminated unions. Perubahan ini saja sudah cukup untuk menghilangkan banyak bug yang biasanya hanya ketahuan di runtime.`,
  },
]
