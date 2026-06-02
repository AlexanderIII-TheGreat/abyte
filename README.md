# 🌐 abyte - Tech Blog & Article Platform

[![Next.js Version](https://img.shields.io/badge/Next.js-14.2%2B-blue?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma ORM](https://img.shields.io/badge/Prisma-7.8.0-indigo?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)

Selamat datang di **abyte**, sebuah platform penerbitan artikel teknologi dan blog modern yang didesain secara khusus untuk performa maksimal, skalabilitas tinggi, dukungan dwibahasa (Bilingual i18n), dan optimalisasi penuh untuk mesin pencari (SEO) serta kecerdasan buatan (LLM Optimization / LLMO).

Platform ini dibangun menggunakan fondasi modern **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, dan **Prisma ORM** yang diintegrasikan dengan database **PostgreSQL**.

---

## 🚀 Fitur Utama

### 1. 🌐 Dukungan Dwibahasa (Bilingual i18n)
Platform ini mendukung bahasa **Indonesia (id)** dan **Inggris (en)** secara native. Deteksi bahasa dilakukan secara otomatis melalui `Accept-Language` header pengguna maupun penyimpanan cookie `NEXT_LOCALE` demi pengalaman penjelajahan yang mulus.

### 2. ⚡ Performa Luar Biasa & Zero-Latency Hydration
Menggunakan arsitektur Server Components secara default. Untuk halaman artikel, diimplementasikan **Static Site Generation (SSG)** dikombinasikan dengan **Incremental Static Regeneration (ISR)** melalui API `generateStaticParams` untuk menjamin kecepatan pemuatan instan.

### 3. 🤖 Maksimalisasi SEO & LLMO (AI-Ready)
Platform dirancang agar mudah dibaca oleh perayap pencari tradisional (Googlebot) serta kecerdasan buatan (Gemini, ChatGPT, Perplexity):
*   **Struktur Data Rich Snippet (JSON-LD):** Injeksi skema Schema.org seperti `TechArticle`, `WebSite`, dan `Person` secara dinamis.
*   **HTML Semantik Ketat:** Menggunakan struktur hierarki judul yang teratur (hanya satu `<h1>` per halaman) serta elemen penanda seperti `<main>`, `<article>`, `<nav>`, dan format S-Q-A (Specific Question-Answer).
*   **Metadata Dinamis:** Menghasilkan metadata penelusuran secara dinamis (termasuk OpenGraph dan Twitter Card) berdasarkan data artikel aktif.

### 4. 📊 Pelacakan Kinerja & Dasbor Analitik (PageViews)
Sistem perekaman analitik internal yang tangguh tanpa bergantung pada skrip pihak ketiga yang lambat:
*   Mencatat metrik **Core Web Vitals** secara real-time seperti **TTFB (Time to First Byte)**, **FCP (First Contentful Paint)**, **LCP (Largest Contentful Paint)**, **DCL (DOM Content Loaded)**, dan **Load Time**.
*   Identifikasi detail perangkat (Device Type), peramban (Browser), sistem operasi, referer, dan intensitas kunjungan.

### 5. 🔐 Dasbor Admin yang Aman & Fungsional
Area administratif tangguh (`/admin`) yang dilindungi oleh otentikasi berbasis token JWT (`jose`) dan middleware server Next.js:
*   Manajemen artikel (tambah, edit, hapus) dalam format multibahasa.
*   Manajemen kategori dan tag artikel.
*   Visualisasi analitik interaktif menggunakan grafis Chart.js.

---

## 🛠️ Desain Basis Data (Prisma Schema)

Sistem basis data dirancang untuk mendukung penerjemahan teks secara dinamis tanpa duplikasi entitas utama.

```mermaid
erDiagram
    Admin {
        String id PK
        String email UK
        String passwordHash
        String name
        DateTime createdAt
        DateTime updatedAt
    }
    
    Author {
        String id PK
        String name
        String avatar
        String url
        DateTime createdAt
        DateTime updatedAt
    }
    
    AuthorTranslation {
        String id PK
        String authorId FK
        String languageCode
        String role
        String bio
    }
    
    Category {
        String id PK
        String slug UK
        DateTime createdAt
        DateTime updatedAt
    }
    
    CategoryTranslation {
        String id PK
        String categoryId FK
        String languageCode
        String name
        String description
    }
    
    Article {
        String id PK
        String slug UK
        String coverImage
        Boolean featured
        DateTime datePublished
        DateTime dateModified
        String authorId FK
        String categoryId FK
    }
    
    ArticleTranslation {
        String id PK
        String articleId FK
        String languageCode
        String title
        String description
        String content
        String coverImageAlt
        String readingTime
    }
    
    Tag {
        String id PK
        String slug UK
    }
    
    TagTranslation {
        String id PK
        String tagId FK
        String languageCode
        String name
    }
    
    ArticleTag {
        String articleId PK, FK
        String tagId PK, FK
    }
    
    PageView {
        String id PK
        String url
        String path
        String referrer
        String visitorId
        String userAgent
        String deviceType
        String browser
        Int ttfb
        Int fcp
        Int lcp
        Int dcl
        Int loadTime
        DateTime createdAt
    }

    Author ||--o{ AuthorTranslation : "has"
    Category ||--o{ CategoryTranslation : "has"
    Article ||--o{ ArticleTranslation : "has"
    Tag ||--o{ TagTranslation : "has"
    Author ||--o{ Article : "writes"
    Category ||--o{ Article : "categorizes"
    Article ||--o{ ArticleTag : "tagged with"
    Tag ||--o{ ArticleTag : "tag belongs to"
```

---

## 📂 Struktur Folder Proyek

```text
abyte-article/
├── prisma/
│   ├── schema.prisma      # Struktur database relasional PostgreSQL
│   ├── seed.ts            # Skrip otomatisasi data awal (Bilingual & Admin)
├── src/
│   ├── app/
│   │   ├── [locale]/      # Halaman utama multibahasa (App Router)
│   │   ├── admin/         # Area admin (login, dashboard, artikel, kategori, analitik)
│   │   ├── api/           # Endpoint API internal untuk analitik & CRUD
│   │   ├── globals.css    # Pengaturan global Tailwind CSS
│   │   ├── layout.tsx     # Layout utama website
│   │   └── middleware.ts  # Middleware otentikasi JWT & routing bahasa otomatis
│   ├── components/        # Komponen UI modular
│   │   ├── admin/         # UI Khusus admin dashboard
│   │   ├── analytics/     # UI Khusus visualisasi analitik & perekaman data
│   │   ├── articles/      # Kartu artikel & detail konten
│   │   └── ui/            # Komponen dasar (Newsletter, Buttons, Form)
│   ├── hooks/             # Kumpulan React hooks kustom
│   ├── i18n/              # File konfigurasi kamus terjemahan bahasa (en & id)
│   ├── lib/               # Utility fungsi eksternal & konektor Prisma
│   └── types/             # Deklarasi tipe TypeScript global
```

---

## 🚀 Cara Pemasangan & Menjalankan Proyek

### 1. Prasyarat Sistem
Pastikan Anda telah memasang:
*   [Node.js](https://nodejs.org/) v18.x atau yang lebih baru
*   [PostgreSQL](https://www.postgresql.org/) v15.x atau yang lebih baru

### 2. Kloning Repositori & Instalasi Dependensi
```bash
# Masuk ke direktori project
cd AbyteArticle

# Pasang semua library dependensi
npm install
```

### 3. Konfigurasi Environment Variables (`.env`)
Buat berkas `.env` di direktori utama proyek dan tambahkan baris berikut (sesuaikan konfigurasi PostgreSQL Anda):

```env
# Koneksi Database PostgreSQL utama
DATABASE_URL="postgresql://username:password@localhost:5432/abyte_db?schema=public"

# Koneksi langsung (opsional untuk server serverless seperti Supabase)
DIRECT_URL="postgresql://username:password@localhost:5432/abyte_db?schema=public"

# Kunci rahasia JWT untuk otentikasi administrator
ADMIN_JWT_SECRET="ganti-dengan-kunci-rahasia-yang-sangat-kuat-dan-aman"
```

### 4. Setup Database & Seeding Data Awal
Gunakan Prisma untuk membuat tabel-tabel di basis data dan menjalankan proses seeding:

```bash
# Jalankan migrasi Prisma untuk menyiapkan skema database
npx prisma db push

# Lakukan seeding data awal (membuat admin default, artikel, kategori, & tag bilingual)
npx prisma db seed
```

> 💡 **Informasi Kredensial Default Admin (Hasil Seeding):**
> *   **Email:** `admin@abyte.id`
> *   **Password:** `abyte132109#`

### 5. Jalankan Server Pengembangan
```bash
npm run dev
```
Akses server lokal Anda di [http://localhost:3000](http://localhost:3000).

---

## 📈 Panduan Penulisan Kode (AI & Dev Directives)

Untuk memelihara performa dan tingkat keterbacaan mesin pencari (SEO & LLMO) yang tinggi, ikuti arahan dari file `schema.md`:

1.  **Identitas Merek Ketat (E-E-A-T):**
    *   **Nama Lengkap Penulis:** `Abiyyu Abidiffatir Al Majid`
    *   **Peran:** `Software Engineer`
    *   **Publikasi/Merek:** `abyte`
    *   **Situs Resmi:** `https://a2mdev.site`
    *   Setiap kali memuat metadata penulisan atau skema JSON-LD, wajib menggunakan nama lengkap dan tautan tersebut.

2.  **HTML Semantik:**
    *   Gunakan hanya **satu** `<h1>` per halaman.
    *   Gunakan elemen `<main>`, `<article>`, `<nav>` di tempat yang semestinya.
    *   Bungkus baris jawaban dari pertanyaan teknis dalam tag `<p>` tepat setelah judul pertanyaan `<h3>` (Format S-Q-A).

3.  **Metrik Performa Web:**
    *   Gunakan `next/image` untuk gambar dengan mengaktifkan parameter `priority={true}` untuk elemen LCP (seperti sampul artikel utama).
    *   Gunakan `generateStaticParams` untuk merender artikel secara statis sebelum dikirimkan ke pengguna.

---

## 📝 Lisensi
Proyek ini dilisensikan di bawah kepemilikan pribadi oleh **Abiyyu Abidiffatir Al Majid**. Hak Cipta dilindungi undang-undang.
