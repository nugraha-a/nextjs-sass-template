# ERP Template v0

> Next.js 16 + Tailwind CSS 4 + Radix UI — starter template untuk sistem ERP (Enterprise Resource Planning).

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](/LICENSE)

---

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Prasyarat](#-prasyarat)
- [Instalasi](#-instalasi)
- [Environment Variables](#-environment-variables)
- [Menjalankan Development Server](#️-menjalankan-development-server)
- [Build Production](#️-build-production)
- [Docker](#-docker)
- [Kubernetes](#-kubernetes)
- [Struktur Folder](#-struktur-folder)
- [Tech Stack](#️-tech-stack)
- [Scripts](#-scripts)
- [Lisensi](#-lisensi)

---

## ✨ Fitur

- 🔐 **Autentikasi** — Login, forgot password, reset password, invite, verifikasi, & Google OAuth
- 📊 **Dashboard** — Executive dashboard, charts (Recharts), dan ringkasan data
- 🏢 **Modul ERP** — IAM, HCM/SDM, Keuangan, Akuntansi, Kesekretariatan, SCM, Workflow, dll.
- 🎨 **UI Components** — Radix UI + shadcn/ui (Accordion, Dialog, Toast, Tabs, dll.)
- 🌙 **Dark Mode** — Support tema terang & gelap via `next-themes`
- 📱 **Responsive** — Layout responsif untuk desktop & mobile
- 🔒 **Security Headers** — X-Content-Type-Options, X-Frame-Options, Referrer-Policy, dll.

---

## 🎯 Pilih Metode Instalasi

Ada **3 cara** untuk menjalankan project ini. Pilih sesuai kebutuhan:

| Metode           | Cocok Untuk                     | Yang Dibutuhkan         | Link                            |
| ---------------- | ------------------------------- | ----------------------- | ------------------------------- |
| 💻 **Local**      | Development, daily coding       | Node.js + pnpm/npm/yarn | [→ Lihat langkah](#-instalasi)  |
| 🐳 **Docker**     | Testing, staging, simple deploy | Docker + Docker Compose | [→ Lihat langkah](#-docker)     |
| ☸️ **Kubernetes** | Production, scalable deploy     | kubectl + K8s cluster   | [→ Lihat langkah](#️-kubernetes) |

> **💡 Baru pertama kali?** Mulai dari metode **Local** untuk development, atau **Docker** jika hanya ingin menjalankan tanpa setup Node.js.

---

## 📦 Prasyarat (Local)

Pastikan tools berikut sudah terinstall di komputer kamu:

| Tool        | Versi Minimum | Cek Versi       |
| ----------- | ------------- | --------------- |
| **Node.js** | v18.18+       | `node -v`       |
| **Git**     | any           | `git --version` |

Dan **salah satu** package manager berikut:

| Package Manager | Install                  | Cek Versi |
| --------------- | ------------------------ | --------- |
| **pnpm** ✅      | `npm install -g pnpm`    | `pnpm -v` |
| **npm**         | Sudah include di Node.js | `npm -v`  |
| **yarn**        | `npm install -g yarn`    | `yarn -v` |

> **💡 Rekomendasi:** Project ini menggunakan `pnpm` sebagai default. Jika menggunakan npm/yarn, hapus file `pnpm-lock.yaml` terlebih dahulu untuk menghindari conflict.

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/nugraha-a/nextjs-sass-template.git
cd nextjs-sass-template/implementation
```

### 2. Install Dependencies

Pilih salah satu sesuai package manager yang kamu gunakan:

```bash
# Menggunakan pnpm (rekomendasi)
pnpm install

# Menggunakan npm
npm install

# Menggunakan yarn
yarn install
```

### 3. Setup Environment Variables

Buat file `.env.local` di root folder `implementation/`:

```bash
cp .env.example .env.local
```

Atau buat manual, lalu isi dengan konfigurasi berikut:

```env
# ─── Backend API ───
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# ─── Demo Mode (server-side only, safe for production) ───
# Set to "true" to enable demo mode with controlled mock data
# SECURITY: This is NOT a NEXT_PUBLIC_ var — it stays server-side only
DEMO_MODE=true

# ─── Google OAuth ───
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ─── Cookie Secrets ───
AUTH_COOKIE_SECRET=your-random-secret-key
```

> **⚠️ Penting:** Jangan pernah commit file `.env.local` ke repository. File ini sudah ada di `.gitignore`.

#### Cara Generate `AUTH_COOKIE_SECRET`

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Cara Mendapatkan Google OAuth Credentials

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang ada
3. Navigasi ke **APIs & Services** → **Credentials**
4. Klik **Create Credentials** → **OAuth 2.0 Client IDs**
5. Set **Authorized redirect URIs** ke: `http://localhost:3000/api/auth/google/callback`
6. Copy **Client ID** dan **Client Secret** ke `.env.local`

---

## 🖥️ Menjalankan Development Server

```bash
# pnpm
pnpm dev

# npm
npm run dev

# yarn
yarn dev
```

Buka browser dan akses: [http://localhost:3000](http://localhost:3000)

> **💡 Tip:** Gunakan `DEMO_MODE=true` di `.env.local` untuk menjalankan aplikasi dengan mock data tanpa perlu backend.

---

## 🏗️ Build Production

```bash
# pnpm
pnpm build && pnpm start

# npm
npm run build && npm start

# yarn
yarn build && yarn start
```

---

## 🐳 Docker

### Prasyarat Docker

| Tool               | Versi Minimum | Cek Versi                |
| ------------------ | ------------- | ------------------------ |
| **Docker**         | v20+          | `docker --version`       |
| **Docker Compose** | v2+           | `docker compose version` |

### Menjalankan dengan Docker Compose (Rekomendasi)

```bash
# 1. Clone repository
git clone https://github.com/nugraha-a/nextjs-sass-template.git
cd nextjs-sass-template/implementation

# 2. Setup environment variables
cp .env.example .env.local
# Edit .env.local sesuai kebutuhan

# 3. Build dan jalankan
docker compose up -d

# 4. Cek status
docker compose ps

# 5. Lihat logs
docker compose logs -f app
```

Aplikasi berjalan di: [http://localhost:3000](http://localhost:3000)

### Menjalankan dengan Docker Manual

```bash
# Build image
docker build -t erp-template .

# Jalankan container
docker run -d \
  --name erp-template \
  -p 3000:3000 \
  --env-file .env.local \
  erp-template
```

### Docker Commands Lainnya

```bash
# Stop
docker compose down

# Rebuild (setelah ada perubahan kode)
docker compose up -d --build

# Masuk ke dalam container
docker compose exec app sh
```

---

## ☸️ Kubernetes

Semua manifest Kubernetes tersedia di folder `k8s/`.

### Prasyarat Kubernetes

| Tool        | Versi Minimum | Cek Versi              |
| ----------- | ------------- | ---------------------- |
| **kubectl** | v1.25+        | `kubectl version`      |
| **Docker**  | v20+          | `docker --version`     |
| K8s cluster | v1.25+        | `kubectl cluster-info` |

### Step 1: Build & Push Docker Image

```bash
# Build image
docker build -t your-registry/erp-template:latest .

# Push ke container registry
docker push your-registry/erp-template:latest
```

> **💡 Tip:** Ganti `your-registry` dengan registry kamu (Docker Hub, GCR, ECR, ACR, dll.)

### Step 2: Update Konfigurasi

Sebelum deploy, edit file-file berikut:

1. **`k8s/secret.yaml`** — Isi credentials yang sebenarnya:
   ```yaml
   stringData:
     GOOGLE_CLIENT_ID: "your-actual-client-id"
     GOOGLE_CLIENT_SECRET: "your-actual-client-secret"
     AUTH_COOKIE_SECRET: "your-actual-secret-key"
   ```

2. **`k8s/configmap.yaml`** — Sesuaikan `NEXT_PUBLIC_API_URL` dan `DEMO_MODE`

3. **`k8s/deployment.yaml`** — Ganti `image: your-registry/erp-template:latest`

4. **`k8s/ingress.yaml`** — Ganti `host: erp.example.com` dengan domain kamu

### Step 3: Deploy ke Kubernetes

```bash
# Apply semua manifest sekaligus
kubectl apply -f k8s/

# Atau satu per satu (urutan penting)
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

### Step 4: Verifikasi

```bash
# Cek status pods
kubectl get pods -n erp-template

# Cek services
kubectl get svc -n erp-template

# Cek ingress
kubectl get ingress -n erp-template

# Lihat logs
kubectl logs -f deployment/erp-template -n erp-template
```

### Kubernetes Commands Lainnya

```bash
# Scale replicas
kubectl scale deployment erp-template -n erp-template --replicas=3

# Rolling update (setelah push image baru)
kubectl rollout restart deployment/erp-template -n erp-template

# Hapus semua resources
kubectl delete -f k8s/
```

---

## 📂 Struktur Folder

```
implementation/
├── actions/            # Server actions
├── app/
│   ├── (auth)/         # Halaman autentikasi (login, register, dll.)
│   ├── (dashboard)/    # Halaman dashboard & modul ERP
│   ├── api/            # API routes
│   ├── globals.css     # Global styles (Tailwind CSS)
│   └── layout.tsx      # Root layout
├── components/         # Reusable UI components (shadcn/ui + custom)
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── k8s/                # Kubernetes manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
├── lib/                # Utility functions & helpers
├── public/             # Static assets (images, icons, dll.)
├── scripts/            # Build/dev scripts
├── styles/             # Additional style files
├── .dockerignore       # Docker ignore rules
├── .env.local          # Environment variables (not committed)
├── docker-compose.yml  # Docker Compose configuration
├── Dockerfile          # Multi-stage Docker build
├── next.config.mjs     # Next.js configuration
├── package.json        # Dependencies & scripts
├── tsconfig.json       # TypeScript configuration
└── vercel.json         # Vercel deployment config
```

---

## 🛠️ Tech Stack

| Kategori        | Teknologi                                                                 |
| --------------- | ------------------------------------------------------------------------- |
| **Framework**   | [Next.js 16](https://nextjs.org/)                                         |
| **UI Library**  | [React 19](https://react.dev/)                                            |
| **Styling**     | [Tailwind CSS 4](https://tailwindcss.com/)                                |
| **Components**  | [Radix UI](https://radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)   |
| **Charts**      | [Recharts](https://recharts.org/)                                         |
| **Forms**       | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Theming**     | [next-themes](https://github.com/pacocoursey/next-themes)                 |
| **Icons**       | [Lucide React](https://lucide.dev/)                                       |
| **Package Mgr** | [pnpm](https://pnpm.io/)                                                  |
| **Language**    | [TypeScript 5](https://www.typescriptlang.org/)                           |
| **Deployment**  | [Vercel](https://vercel.com/)                                             |

---

## 📝 Scripts

| Perintah  | pnpm         | npm             | yarn         | Deskripsi                  |
| --------- | ------------ | --------------- | ------------ | -------------------------- |
| **Dev**   | `pnpm dev`   | `npm run dev`   | `yarn dev`   | Jalankan dev server        |
| **Build** | `pnpm build` | `npm run build` | `yarn build` | Build untuk production     |
| **Start** | `pnpm start` | `npm start`     | `yarn start` | Jalankan production server |
| **Lint**  | `pnpm lint`  | `npm run lint`  | `yarn lint`  | Jalankan ESLint            |

---

## 📄 Lisensi

Project ini menggunakan lisensi [MIT](./LICENSE). © 2026 Nugraha A.