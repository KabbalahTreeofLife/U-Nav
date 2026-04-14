# 🧩 U-Nav Codebase Navigation Guide

This guide provides a step-by-step walkthrough of the U-Nav repository, explaining the purpose of each directory and key file to help you get started quickly.

---

## 📂 Root Directory
The root directory manages the overall project structure and multi-package setup.

| File/Directory | Purpose |
|----------------|---------|
| `Backend/` | Node.js/Express API server |
| `WebDev/` | React/Vite-based web application |
| `Database/` | SQL schemas and migration scripts for Supabase |
| `Mobile/` | (In-progress) React Native mobile implementation |
| `Shared/` | Shared types and utilities for future use |
| `Architecture.md` | Detailed diagrams explaining the system's design |
| `package.json` | Root scripts for installing and running everything simultaneously |

---

## 🚀 Backend (`/Backend`)
The heart of U-Nav's logic and database interaction.

### Entry Point
| File | What It Does |
|------|--------------|
| `src/index.ts` | **START HERE** - Initializes Express server, applies middleware (CORS, rate limiting), registers all API routes, and starts the HTTP server on port 3000. |

### Routes (`src/routes/`)
| File | What It Does |
|------|--------------|
| `src/routes/auth.ts` | Handles login, signup, university CRUD, JWT token generation with bcrypt password hashing. |
| `src/routes/users.ts` | Profile management, user listing, role updates (admin-only operations). |
| `src/routes/dining.ts` | CRUD operations for dining locations (restaurants, cafes, eateries). |
| `src/routes/events.ts` | CRUD operations for campus-wide events. |

### Middleware (`src/middleware/`)
| File | What It Does |
|------|--------------|
| `src/middleware/auth.ts` | JWT verification middleware, role checks (requireAdmin, requireGlobalAdmin). |

### Config & Utilities
| File | What It Does |
|------|--------------|
| `src/config/database.ts` | PostgreSQL connection pool setup using Supabase credentials from .env |
| `src/utils/responseHelpers.ts` | Standardized HTTP response helpers (sendSuccess, sendError, HTTP status codes) |
| `src/utils/mappers.ts` | Database row transformation functions for clean API responses |

---

## 🌐 WebDev (`/WebDev`)
The immersive frontend experience built with React and Three.js.

### Bootstrap Files (Start Here)
| File | What It Does |
|------|--------------|
| **`src/main.tsx`** | **START HERE** - Entry point. Bootstraps React app into DOM with BrowserRouter and AuthProvider. |
| **`src/App.tsx`** | Main routing configuration. Defines all routes (/login, /signup, /map/3d, /dining, /admin, etc.) and applies route guards (ProtectedRoute, ProtectedAdminRoute). |

### API Layer (`src/api/`)
| File | What It Does |
|------|--------------|
| `src/api/client.ts` | Centralized fetch wrapper with automatic token injection, error handling, and response parsing. |
| `src/api/config.ts` | API endpoint URLs. All HTTP calls to backend go through here. |
| `src/api/index.ts` | TypeScript interfaces for API responses (User, University, DiningLocation, Event). |
| `src/api/auth.ts` | Authentication API calls (login, signup, fetchUniversities). |
| `src/api/dining.ts` | Dining locations API calls. |
| `src/api/events.ts` | Events API calls. |

### Authentication (`src/common/`)
| File | What It Does |
|------|--------------|
| `src/common/AuthContext.tsx` | React Context that provides global auth state (user, token, login, logout). Wraps entire app. |
| `src/common/ProtectedRoute.tsx` | Route guard that redirects unauthenticated users to /login. |
| `src/common/ProtectedAdminRoute.tsx` | Route guard that restricts admin-only pages. |

### 3D Map Engine (`src/map/3d/`) - Most Critical
| File | What It Does |
|------|--------------|
| **`src/map/3d/MapView3D.tsx`** | **START HERE for map changes** - Main 3D view (642 lines). Orchestrates campus/building/floor views, handles GPS tracking, search, events modal, pathfinding UI. |
| `src/map/3d/CampusScene.tsx` | Sets up Three.js canvas, lighting, ground plane, loads 3D GLB model. |
| `src/map/3d/pathfinder.ts` | Custom pathfinding algorithm with obstacle avoidance. Calculates routes between buildings. |
| `src/map/3d/navigation.ts` | Camera controls, auto-centering, world boundary constraints. |
| `src/map/3d/geolocation.ts` | GPS position tracking service. Syncs real GPS to 3D scene coordinates. |
| `src/map/3d/coordinateTransform.ts` | Converts GPS coordinates to Three.js world coordinates. |
| `src/map/3d/universities.ts` | University-specific data (which 3D model to load, default map settings). |
| `src/map/3d/buildingData.ts` | Building locations, floors, room data for indoor navigation. |

### 2D Map (`src/map/2d/`)
| File | What It Does |
|------|--------------|
| `src/map/2d/MapView2D.tsx` | Simplified 2D map view with image overlay. |

### Features
| Directory | What It Does |
|-----------|--------------|
| `src/Login-Signup/` | Login, Signup, Guest Login forms with university selection. |
| `src/dining/DiningView.tsx` | Campus dining list with filtering by university, search, detail view. |
| `src/about/AboutView.tsx` | About page with app info. |
| `src/admin/` | Admin dashboard with tabs for managing users, dining, events, universities. |

### Styling (`src/css/`)
| Directory | What It Does |
|-----------|--------------|
| `src/css/common/` | Global styles (variables.css, components.css) |
| `src/css/Map/` | Map-specific styles (Map.css) |

### Public Assets (`public/`)
| Directory | What It Does |
|-----------|--------------|
| `public/models/` | 3D GLB models (CentralMap.glb, etc.) |
| `public/images/` | Static images |
| `public/Unav_Logo.png` | App logo and favicon |

---

## 🗄️ Database (`/Database`)
| File | What It Does |
|------|--------------|
| `schema.sql` | **Single source of truth** - PostgreSQL schema defining tables: users, universities, dining_locations, events. Includes sample data for 6 universities. |

---

## 🛠️ How to Navigate a Change

| Task | Where to Look |
|------|---------------|
| **New API endpoint?** | Add route in `Backend/src/routes/<domain>.ts` + Add client call in `WebDev/src/api/<domain>.ts` |
| **UI tweak on map?** | Most changes in `WebDev/src/map/3d/MapView3D.tsx` or child components |
| **Adding a building?** | Update GLB model in `WebDev/public/models/` + Update metadata in `WebDev/src/map/3d/universities.ts` |
| **Change auth behavior?** | `Backend/src/routes/auth.ts` or `WebDev/src/common/AuthContext.tsx` |
| **Add new route/page?** | Define route in `WebDev/src/App.tsx` + Create component in appropriate feature folder |
| **Database schema change?** | Update `Database/schema.sql` + Update types in `WebDev/src/api/index.ts` |