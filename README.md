# 🧭 U-Nav — University Navigate

_Campus navigation, reimagined._

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)

---

## 📖 Introduction

**U-Nav** (University Navigate) is a campus navigation app for Central Philippine University students featuring an interactive map, live area traffic system, and dining guide.

---

## ✨ Features

- 🗺️ **Interactive 3D Map** — Full three-dimensional map of the university campus
- 🔥 **Live Area Traffic System** — Real-time crowd tracking (heat map)
- 🍽️ **Campus Dining Guide** — Discover food spots on campus
- 👥 **User Roles** — Global Admin and University-level Admin support
- 🏛️ **Multi-University Support** — Manage multiple universities from one platform

---

## 🛠️ Tech Stack

| Layer    | Technology                   |
| -------- | ---------------------------- |
| Frontend | React 19 + TypeScript + Vite |
| Backend  | Express.js + TypeScript      |
| Database | PostgreSQL (Supabase)        |

---

## 📋 Prerequisites

Before running this project, ensure you have:

1. **Node.js** (v18 or higher)
   - Download from https://nodejs.org/

2. **Supabase Account** (optional - uses cloud database by default)
   - Sign up at https://supabase.com

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
# At U-Nav root directory
npm run install-all
```

This installs dependencies for both Backend and WebDev.

---

### 2. Database Setup (Supabase - Already Configured)

The project is pre-configured to use Supabase. The `.env` file in the Backend folder contains:

```
DB_HOST=your-pooler-host.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.your-project-ref
DB_PASSWORD=your_password
DB_SSL=true
```

> **⚠️ Security Note:** Never commit your `.env` file to Git. It's already in `.gitignore`.

**Note:** The database is already set up with sample data (6 universities, dining locations, and events).

#### To use your own Supabase database:

1. Create a project at https://supabase.com
2. Get your connection string from **Settings → Database**
3. Update `Backend/.env` with your credentials

#### To use local PostgreSQL instead:

1. Install PostgreSQL from https://www.postgresql.org/download/windows/
2. Create a database named `unav_db`
3. Update `Backend/.env`:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=unav_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_SSL=false
   ```
4. Run the migration script:
   ```bash
   cd Backend
   npx ts-node src/scripts/runMigrations.ts
   ```

---

### 3. Run the Project

```bash
# At U-Nav root directory
npm run dev
```

This starts both frontend and backend concurrently:

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000

---

### 4. Verify Setup

1. Open http://localhost:5173 in your browser
2. You should see the login page
3. Universities should be loaded from the database
4. Sign up and login should work

---

## 📖 Step-by-Step Setup Guide

### Prerequisites

1. **Node.js** (v18 or higher) - https://nodejs.org/
2. **Git** (optional) - https://git-scm.com/
3. **Supabase Account** (optional) - https://supabase.com/

---

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd U-Nav
```

Or if you already have the project, skip to Step 2.

---

### Step 2: Install Dependencies

```bash
npm run install-all
```

This installs all packages for both Backend and WebDev.

---

### Step 3: Configure Database

The project is pre-configured to use Supabase. The connection details are already in `Backend/.env`:

```
DB_HOST=aws-1-ap-south-1.pooler.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.ycqwwflpdrotnvtsdyws
DB_PASSWORD=********
DB_SSL=true
```

**To use your own Supabase instead:**
1. Create a project at https://supabase.com
2. Go to **Settings → Database**
3. Copy the connection string (Pooler mode)
4. Update `Backend/.env` with your credentials

**To use local PostgreSQL:**
1. Install PostgreSQL from https://www.postgresql.org/download/
2. Create a database: `CREATE DATABASE unav_db;`
3. Update `Backend/.env`:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=unav_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_SSL=false
   ```
4. Run migrations:
   ```bash
   cd Backend
   npx ts-node src/scripts/runMigrations.ts
   ```

---

### Step 4: Start the Application

```bash
npm run dev
```

Keep this terminal window open. The app runs on:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

---

### Step 5: Verify It Works

1. Open http://localhost:5173 in your browser
2. You should see the login page
3. Try logging in with the default Global Admin:
   - **Email:** `admin@unav.edu.ph`
   - **Password:** `GlobalAdmin123`

---

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't connect to database | Check `.env` credentials; ensure Supabase project is not paused |
| Frontend shows "Network error" | Make sure backend is running on port 3000 |
| "Something went wrong!" on login | Check backend terminal for error logs |
| Port 3000 or 5173 in use | Stop other services using these ports |

---

### Updating the Code

After making changes:
1. Frontend updates automatically (hot reload)
2. Backend: press `Ctrl+C` and run `npm run dev` again

---

## 📁 Project Structure

```
U-Nav/
├── Backend/              # Express.js API server
│   ├── src/
│   │   ├── index.ts     # Server entry point
│   │   ├── config/      # Database configuration
│   │   ├── routes/     # API routes
│   │   ├── middleware/ # Auth middleware
│   │   ├── utils/      # Utility functions
│   │   └── scripts/    # Migration scripts
│   ├── supabase/       # Supabase CLI config
│   ├── .env            # Environment variables (DO NOT COMMIT)
│   └── .env.example    # Template for .env
│
├── WebDev/              # React frontend
│   ├── src/
│   │   ├── api/        # API service layer
│   │   ├── common/     # Shared components & hooks
│   │   ├── admin/      # Admin dashboard pages
│   │   ├── login-signup/  # Auth pages
│   │   ├── map/        # Map views (2D & 3D)
│   │   ├── dining/     # Dining pages
│   │   └── css/        # Stylesheets
│
├── Database/            # SQL schema
│   └── schema.sql      # Database tables & seed data
│
├── Mobile/              # Mobile app (future)
├── Shared/              # Shared code (future)
└── README.md
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint                     | Description              |
| ------ | ---------------------------- | ----------------------- |
| POST   | `/api/auth/login`            | User login              |
| POST   | `/api/auth/signup`           | User registration       |
| GET    | `/api/auth/universities`    | Get all universities    |
| POST   | `/api/auth/universities`     | Create university (Global Admin) |
| DELETE | `/api/auth/universities/:id`| Delete university (Global Admin) |

### Dining

| Method | Endpoint          | Description              |
| ------ | ----------------- | ----------------------- |
| GET    | `/api/dining`     | Get all dining locations |
| GET    | `/api/dining/:id` | Get dining location     |
| POST   | `/api/dining`     | Create dining location   |
| PUT    | `/api/dining/:id` | Update dining location  |
| DELETE | `/api/dining/:id` | Delete dining location  |

### Events

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| GET    | `/api/events`    | Get all events       |
| GET    | `/api/events/:id`| Get event            |
| POST   | `/api/events`    | Create event         |
| PUT    | `/api/events/:id`| Update event         |
| DELETE | `/api/events/:id`| Delete event         |

### Users (Admin only)

| Method | Endpoint                  | Description         |
| ------ | ------------------------ | ------------------ |
| GET    | `/api/users`             | Get all users      |
| GET    | `/api/users/:id`         | Get user by ID    |
| PUT    | `/api/users/:id/role`    | Update user role   |
| DELETE | `/api/users/:id`         | Delete user        |

---

## 👥 User Roles

### Global Admin
- Can access all universities
- Can create/delete universities
- Can manage all users, dining locations, and events

### University Admin
- Can only manage their own university's data
- Cannot access university management

### Regular User
- Can view map, dining locations, and events
- Cannot access admin features

---

## 🔧 Troubleshooting

### Backend won't connect to database

1. Check your `.env` file in Backend folder
2. Verify DB credentials are correct
3. If using Supabase, ensure project is active (not paused)
4. Try restarting the backend: `npm run dev` in Backend folder

### Frontend shows "Loading..."

1. Make sure backend is running on port 3000
2. Check browser console for errors
3. Verify API endpoints respond at http://localhost:3000/api/health

### Database migration fails

Run the migration script:
```bash
cd Backend
npx ts-node src/scripts/runMigrations.ts
```

---

## 📝 License

This project is for educational purposes.