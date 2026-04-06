# 🧭 U-Nav — University Navigate

_Campus navigation application for universities._

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## 📖 Introduction

**U-Nav** is a campus navigation application that helps students and visitors navigate university campuses efficiently. It features interactive maps, dining guides, event listings, and real-time crowd tracking.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🗺️ **Campus Map** | Interactive 3D/2D map with building navigation |
| 🔥 **Heat Map** | Toggle overlay showing crowd density |
| 📅 **Events** | Browse university events by category, date, and location |
| 🍽️ **Dining Guide** | Discover campus restaurants, cafes, and eateries |
| 🔐 **Authentication** | Secure login/signup with university email validation |
| 👥 **User Roles** | Support for users, guests, and administrators |

---

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **3D Graphics:** React Three Fiber + Three.js
- **Backend:** Express.js + TypeScript
- **Database:** Supabase (PostgreSQL)

---

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Supabase** account (free at [supabase.com](https://supabase.com))
- **npm** or **yarn**

---

## 🚀 Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd U-Nav
```

### 2. Install Dependencies

```bash
# Install all dependencies (root, backend, and frontend)
npm run install-all
```

Or install each part manually:

```bash
# Install backend dependencies
cd Backend && npm install

# Install frontend dependencies  
cd ../WebDev && npm install
```

### 3. Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → Database** to find your connection string
3. Copy the example environment file:
   ```bash
   cp Backend/.env.example Backend/.env
   ```
4. Edit `Backend/.env` with your Supabase credentials:
   ```env
   PORT=3000
   DB_HOST=your-host.supabase.co
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres.your-project-ref
   DB_PASSWORD=your_supabase_password
   DB_SSL=true
   ```

### 4. Initialize the Database

#### Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy and paste the contents of `Database/schema.sql` into the editor
5. Click **Run** to execute the schema

Or use the Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Run the schema
supabase db execute --file Database/schema.sql
```

---

## ▶️ Running the Application

### Option 1: Run Both (Backend + Frontend)

```bash
npm run dev
```

This runs both the backend and frontend concurrently:
- Backend: http://localhost:3000
- Frontend: http://localhost:5173

### Option 2: Run Individually

```bash
# Terminal 1: Backend only
npm run dev:backend

# Terminal 2: Frontend only
npm run dev:frontend
```

---

## 🔑 Default User Roles

After running the schema, you can:

1. **Sign up** with a university email address
2. **Contact an admin** to promote your account to admin role via the admin panel

---

## 📁 Project Structure

```
U-Nav/
├── Backend/              # Express.js API server
│   ├── src/
│   │   ├── index.ts     # Server entry point
│   │   ├── config/      # Database configuration
│   │   └── routes/      # API routes
│   ├── .env.example     # Environment variables template
│   └── package.json
│
├── WebDev/              # React frontend
│   ├── src/
│   │   ├── api/        # API service layer
│   │   ├── common/      # Shared components & hooks
│   │   ├── login-signup/  # Authentication pages
│   │   ├── map/        # Map view & controls
│   │   ├── dining/     # Dining guide
│   │   ├── about/      # About page
│   │   ├── admin/      # Admin dashboard
│   │   └── css/        # Stylesheets
│   └── package.json
│
├── Database/            # SQL schema
│   └── schema.sql
│
└── README.md
```

---

## 👥 Team

- Xanth Reign Palmes — Team Leader
- Daniel Koen Parcon
- Marc Francis Billiones
- Marco Daniel Castillo
- Seth Dofeliz

---

## 📝 License

This project is for educational purposes.
