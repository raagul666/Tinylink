# 🔗 TinyLink - Modern URL Shortener

<div align="center">

![TinyLink Logo](https://img.shields.io/badge/TinyLink-URL%20Shortener-7c3aed?style=for-the-badge&logo=link&logoColor=white)

**A modern, full-stack URL shortening service built with Next.js 15, TypeScript, Prisma ORM, and PostgreSQL**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)

[Live Demo](#) • [Features](#-features) • [Installation](#-installation) • [API Docs](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running Locally](#-running-locally)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Features Breakdown](#-features-breakdown)
- [Testing](#-testing)
- [Assignment Requirements](#-assignment-requirements)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🎯 Overview

**TinyLink** is a modern URL shortening service similar to bit.ly, built as part of a take-home assignment for **Accolite**. It allows users to:

- Shorten long URLs with optional custom codes
- Track click statistics and analytics
- Manage all shortened links from a dashboard
- View detailed stats for individual links
- Soft-delete and permanently remove links

The application emphasizes **clean code**, **modern UI/UX**, **type safety**, and **production-ready architecture**.

---

## ✨ Features

### Core Functionality
✅ **URL Shortening** - Convert long URLs into short, shareable links  
✅ **Custom Short Codes** - Choose your own memorable 6-8 character codes  
✅ **Click Tracking** - Real-time analytics with click count and timestamps  
✅ **Link Management** - View, search, filter, and manage all your links  
✅ **Active/Inactive Toggle** - Soft-delete links without losing data  
✅ **Permanent Deletion** - Remove inactive links from the database  
✅ **Stats Dashboard** - Detailed statistics for each shortened link  
✅ **Auto-refresh** - Table updates automatically after every action  
✅ **Copy to Clipboard** - One-click copying of shortened URLs  
✅ **Health Check** - `/api/healthz` endpoint for monitoring  

### UI/UX Features
🎨 **Modern Design** - Clean gradient theme with purple and gold accents  
🎨 **Responsive Layout** - Mobile-friendly interface that adapts to all screens  
🎨 **Loading States** - Smooth animations and feedback for all actions  
🎨 **Error Handling** - User-friendly error messages with inline validation  
🎨 **Empty States** - Helpful prompts when no data is available  
🎨 **Modal Statistics** - Quick view of link stats in a popup  
🎨 **Toast Notifications** - Success/error alerts after actions  

### Technical Features
⚡ **Server-Side Rendering** - Fast initial page loads with Next.js 15  
⚡ **Type Safety** - Full TypeScript coverage for reliability  
⚡ **Database ORM** - Prisma for type-safe database queries  
⚡ **API Routes** - RESTful API with Next.js App Router  
⚡ **302 Redirects** - Proper HTTP redirects with click tracking  
⚡ **Input Validation** - Both client and server-side validation  
⚡ **Code Uniqueness** - Global unique constraint on short codes (409 on duplicates)  
⚡ **Soft Deletes** - Links can be deactivated and restored  

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 |
| **Database** | PostgreSQL (Neon) |
| **ORM** | Prisma |
| **Styling** | Inline Styles, Custom CSS |
| **Icons** | Lucide React |
| **Deployment** | Vercel |
| **Package Manager** | npm |

---

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)

### URL Shortener (Hero Section)
![Hero Section](https://via.placeholder.com/800x400?text=Hero+Section+Screenshot)

### Link Statistics Modal
![Stats Modal](https://via.placeholder.com/600x400?text=Stats+Modal+Screenshot)

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **PostgreSQL** database (local or hosted on [Neon](https://neon.tech/), [Railway](https://railway.app/), etc.)
- **Git** ([Download](https://git-scm.com/))

### Step 1: Clone the Repository

git clone https://github.com/raagul666/Tinylink.git
cd Tinylink


### Step 2: Install Dependencies

npm install


### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory:

touch .env


Add the following variables (see [Environment Variables](#-environment-variables) section):

DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"


### Step 4: Set Up the Database

Run Prisma migrations to create the database schema:

npx prisma generate
npx prisma db push


*(Optional)* Open Prisma Studio to view/edit data:

npx prisma studio


### Step 5: Run the Development Server

npm run dev

Open [http://localhost:3000](http://localhost:3000) in your browser.


## 🔐 Environment Variables

Create a `.env` file with the following variables:

Database Connection String
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"

Optional: Base URL for production
NEXT_PUBLIC_BASE_URL="https://your-domain.vercel.app"

text

### Example for Neon PostgreSQL:

DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-cool-name-a1b2c3d4.us-east-1.aws.neon.tech/neondb?sslmode=require"

**Important:** 
- Never commit `.env` to Git (already in `.gitignore`)
- Use `.env.example` as a template for collaborators

---

## 🗄️ Database Setup

### Schema Overview

The application uses a single `Link` table:

model Link {
id String @id @default(cuid())
code String @unique
url String
clicks Int @default(0)
isActive Boolean @default(true)
createdAt DateTime @default(now())
lastClickedAt DateTime?
}


### Prisma Commands

Generate Prisma Client
npx prisma generate

Push schema to database (for development)
npx prisma db push

Create a migration (for production)
npx prisma migrate dev --name init

Open Prisma Studio (database GUI)
npx prisma studio

Reset database (caution: deletes all data)
npx prisma migrate reset


---

## 🚀 Running Locally

### Development Mode

npm run dev

Visit [http://localhost:3000](http://localhost:3000)

### Production Build

npm run build
npm start

### Linting

npm run lint

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

git add .
git commit -m "Initial commit"
git push origin main

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variable: `DATABASE_URL`

3. **Deploy!**
   - Vercel will auto-deploy on every push to `main`

### Deploy to Railway

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Add PostgreSQL: `railway add`
5. Deploy: `railway up`
## 📁 Project Structure

Tinylink/
├── prisma/
│ └── schema.prisma # Database schema
├── public/
│ └── ... # Static assets
├── src/
│ ├── app/
│ │ ├── [code]/
│ │ │ └── route.ts # Redirect handler (/:code)
│ │ ├── api/
│ │ │ ├── healthz/
│ │ │ │ └── route.ts # Health check endpoint
│ │ │ └── links/
│ │ │ ├── route.ts # List/Create links
│ │ │ └── [code]/
│ │ │ ├── route.ts # Get/Delete/Patch link
│ │ │ └── permanent/
│ │ │ └── route.ts # Hard delete
│ │ ├── code/
│ │ │ └── [code]/
│ │ │ └── page.tsx # Stats page (/code/:code)
│ │ ├── globals.css # Global styles
│ │ ├── layout.tsx # Root layout
│ │ └── page.tsx # Dashboard page (/)
│ ├── components/
│ │ ├── Footer.tsx
│ │ ├── Header.tsx
│ │ ├── Hero.tsx
│ │ └── LinksTable.tsx
│ ├── lib/
│ │ ├── db.ts # Prisma client
│ │ └── prisma.ts
│ └── types/
│ └── index.ts # TypeScript types
├── .env # Environment variables (not in Git)
├── .env.example # Template for .env
├── .gitignore
├── next.config.ts
├── package.json
├── README.md
├── tailwind.config.ts
└── tsconfig.json


## 📚 API Documentation

### Base URL
http://localhost:3000/api

### Endpoints

#### 1. Health Check
GET /api/healthz


**Response (200 OK):**
{
"ok": true,
"version": "1.0",
"timestamp": "2025-11-21T03:00:00.000Z",
"status": "healthy"
}


#### 2. Create Short Link
POST /api/links
Content-Type: application/json

{
"url": "https://example.com/very/long/url",
"code": "mycode" // optional, 6-8 alphanumeric chars
}


**Response (201 Created):**
{
"id": "clx...",
"code": "mycode",
"url": "https://example.com/very/long/url",
"clicks": 0,
"isActive": true,
"createdAt": "2025-11-21T03:00:00.000Z",
"lastClickedAt": null
}

**Error (409 Conflict):**
{
"error": "Code already exists"
}


**Error (400 Bad Request):**
{
"error": "Invalid URL format"
}

---

#### 3. List All Links
GET /api/links


**Response (200 OK):**
[
{
"id": "clx...",
"code": "sample1",
"url": "https://example.com",
"clicks": 42,
"isActive": true,
"createdAt": "2025-11-21T03:00:00.000Z",
"lastClickedAt": "2025-11-21T04:30:00.000Z"
}
]

---

#### 4. Get Link Stats
GET /api/links/:code

**Response (200 OK):**
{
"id": "clx...",
"code": "sample1",
"url": "https://example.com",
"clicks": 42,
"isActive": true,
"createdAt": "2025-11-21T03:00:00.000Z",
"lastClickedAt": "2025-11-21T04:30:00.000Z"
}

text

**Error (404 Not Found):**
{
"error": "Link not found"
}

#### 5. Toggle Link Status
PATCH /api/links/:code
Content-Type: application/json

{
"isActive": false
}
**Response (200 OK):**
{
"id": "clx...",
"code": "sample1",
"url": "https://example.com",
"clicks": 42,
"isActive": false,
"createdAt": "2025-11-21T03:00:00.000Z",
"lastClickedAt": "2025-11-21T04:30:00.000Z"
}
---

#### 6. Soft Delete Link
DELETE /api/links/:code

**Response (200 OK):**
{
"message": "Link deleted successfully",
"code": "sample1"
}

---

#### 7. Permanently Delete Link
DELETE /api/links/:code/permanent

**Response (200 OK):**
{
"message": "Link permanently deleted",
"code": "sample1"
}
---

#### 8. Redirect to Original URL
GET /:code

**Response (302 Found):**
Location: https://example.com


**Updates:**
- Increments `clicks` count
- Updates `lastClickedAt` timestamp

**Error (404 Not Found):**
{
"error": "Link not found"
}


## 🎨 Features Breakdown

### Dashboard (`/`)

The main dashboard provides:

- **Hero Section** - URL shortener form with validation
- **Links Table** - All shortened links with: