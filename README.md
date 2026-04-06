# 🧭 U-Nav — University Navigate

_Campus navigation for universities._

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)

---

## 📖 Introduction

**U-Nav** is a campus navigation app for universities featuring an interactive map, heat map, and dining guide.

---

## ✨ Features

- 🗺️ **Campus Map** — Interactive 3D/2D map view with building navigation
- 🔥 **Heat Map** — Toggle heat map overlay for crowd density
- 📅 **Events** — View university events with room, time, and details
- 🍽️ **Dining Guide** — Discover food spots on campus
- 🔐 **User Authentication** — Secure login/signup with university email validation
- 👥 **User Roles** — Registered users and guest access

---

## 🛠️ Tech Stack

| Layer    | Technology                   |
| -------- | ---------------------------- |
| Frontend | React 19 + TypeScript + Vite |
| Backend  | Express.js + TypeScript      |
| Database | Supabase (PostgreSQL)        |

---

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Supabase Account** - https://supabase.com

---

## 🚀 Setup

### 1. Install Dependencies

```bash
# From root directory
npm install

# Install backend dependencies
cd Backend && npm install

# Install frontend dependencies  
cd ../WebDev && npm install
```

### 2. Database Setup (Supabase)

1. Create a project at https://supabase.com
2. Get your connection string from **Settings → Database**
3. Update `Backend/.env` with your Supabase credentials:
   ```
   DB_HOST=your-host.supabase.co
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres.your-project-ref
   DB_PASSWORD=your_password
   DB_SSL=true
   ```
4. Run the schema:
   ```bash
   psql -U postgres -d postgres -f Database/schema.sql
   ```

---

## ▶️ Run the Project

### Start Backend
```bash
cd Backend
npm run dev
```
Backend runs on: http://localhost:3000

### Start Frontend
```bash
cd WebDev
npm run dev
```
Frontend runs on: http://localhost:5173

---

## 📁 Project Structure

```
U-Nav/
├── Backend/              # Express.js API server
│   ├── src/
│   │   ├── index.ts      # Server entry point
│   │   ├── config/       # Database configuration
│   │   └── routes/       # API routes
│   └── package.json
│
├── WebDev/               # React frontend
│   ├── src/
│   │   ├── api/          # API service layer
│   │   ├── common/       # Shared components & hooks
│   │   ├── login-signup/ # Authentication pages
│   │   ├── map/          # Map view & controls
│   │   ├── dining/       # Dining guide
│   │   ├── about/        # About page
│   │   └── css/          # Stylesheets
│   └── package.json
│
├── Database/             # SQL schema
│   └── schema.sql
│
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint                  | Description              |
| ------ | ------------------------- | ----------------------- |
| POST   | `/api/auth/login`        | User login              |
| POST   | `/api/auth/signup`       | User registration       |
| GET    | `/api/auth/universities`| Get all universities    |

---

## 👥 Team

- Daniel Koen Parcon
- Marc Francis Billiones
- Marco Daniel Castillo
- Xanth Reign Palmes
- Seth Dofeliz

---

## 📝 License

This project is for educational purposes.