# 🧭 U-Nav — University Navigate

_Campus navigation, reimagined._

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)

---

## 📖 Introduction

**U-Nav** (University Navigate) is a campus navigation app for Central Philippine University students featuring an interactive map, live area traffic system, and dining guide.

---

## ✨ Features

- 🗺️ **Interactive 3D Map** — Full three-dimensional map of the university campus
- 🔥 **Live Area Traffic System** — Real-time crowd tracking (heat map)
- 🍽️ **Campus Dining Guide** — Discover food spots on campus

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + TypeScript + Vite |
| Backend | Express.js + TypeScript |
| Database | PostgreSQL 18 |

---

## 📋 Prerequisites

Before running this project, ensure you have:

1. **Node.js** (v18 or higher)
   - Download from https://nodejs.org/

2. **PostgreSQL 18**
   - Download from https://www.postgresql.org/download/windows/
   - During installation, remember your password

---

## 🚀 Setup Instructions

### 1. Database Setup

#### Create Database

1. Open **pgAdmin 4** (installed with PostgreSQL)
2. Right-click on "Databases" → "Create" → "Database..."
3. Fill in:
   - **Database name:** `unav_db`
   - **Owner:** `postgres`
4. Click "Save"

#### Run Schema

1. In pgAdmin, right-click on `unav_db`
2. Click "Query Tool"
3. Open `Database/schema.sql` file
4. Click the **Play button (▶️)** to execute

Or via command line:
```bash
psql -U postgres -d unav_db -f Database/schema.sql
```

---

### 2. Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Edit .env and update DB_PASSWORD if needed

# Start development server
npm run dev
```

Backend runs on: http://localhost:3000

---

### 3. Frontend Setup

```bash
cd WebDev

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: http://localhost:5173

---

### 4. Verify Setup

1. Open http://localhost:5173 in your browser
2. You should see the login page
3. Universities should be loaded from the database
4. Sign up and login should work

---

## 📁 Project Structure

```
U-Nav/
├── Backend/              # Express.js API server
│   ├── src/
│   │   ├── index.ts    # Server entry point
│   │   ├── config/     # Database configuration
│   │   └── routes/     # API routes
│   ├── .env            # Environment variables (DO NOT COMMIT)
│   └── .env.example    # Template for .env
│
├── WebDev/             # React frontend
│   ├── src/
│   │   ├── api/        # API service layer
│   │   ├── common/     # Shared components
│   │   ├── css/        # Stylesheets
│   │   └── login-signup/  # Auth pages
│
├── Database/            # SQL schema
│   └── schema.sql      # Database tables
│
├── Mobile/              # Mobile app (future)
├── Shared/              # Shared code (future)
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/health` | Server status |
| GET | `/api/auth/universities` | Get all universities |
| POST | `/api/auth/signup` | Create new user |
| POST | `/api/auth/login` | Login user |

---

## 👥 Team Development

Each team member needs to:

1. Clone the repository
2. Install PostgreSQL and create the database
3. Run `Database/schema.sql` once
4. Run `npm install` in both Backend and WebDev folders
5. Copy `.env.example` to `.env` and update with their password
6. Run `npm run dev` in both folders

---

## 🔧 Troubleshooting

### "psql is not recognized"

Add PostgreSQL to your system PATH:
1. Press `Win + R`, type `sysdm.cpl`
2. Go to Advanced → Environment Variables
3. Edit System PATH, add: `C:\Program Files\PostgreSQL\18\bin`
4. Restart Command Prompt

### Backend won't connect to database

Check your `.env` file:
- `DB_PASSWORD` should match your PostgreSQL password
- `DB_NAME` should be `unav_db`

### Frontend shows "Loading..."

Make sure the backend is running on port 3000

---

## 📄 License

This project was created for Introduction to Engineering Design (CPU).

**Group 3:** Daniel Koen Parcon, Marc Francis Billiones, Marco Daniel Castillo, Xanth Reign Palmes, Seth Dofeliz
