# U-Nav Web Application - Documentation

A comprehensive campus navigation system built with React, TypeScript, and Vite.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Folder Details](#folder-details)

---

## Features

- **Interactive 2D & 3D Maps**: Navigate campus buildings with detailed floor plans
- **Dining Guide**: Explore campus dining options with menus and hours
- **About Section**: Information about the university and navigation system
- **User Authentication**: Secure login and signup system
- **Guest Mode**: Limited view-only access without authentication
- **Responsive Design**: Works on desktop and mobile devices

---

## Project Structure

```
WebDev/
├── src/
│   ├── api/              # API service calls and types
│   ├── common/           # Shared components, hooks, context
│   ├── components/       # Reusable UI components
│   ├── map/              # Map view wrapper and events data
│   ├── map3d/            # 3D campus scene, building/floor views
│   ├── dining/           # Dining guide features
│   ├── about/            # About page
│   ├── login-signup/     # Authentication pages and validation
│   ├── css/              # Stylesheets organized by feature
│   ├── assets/           # Static assets (SVG, images)
│   ├── App.tsx           # Main application routes
│   └── main.tsx          # Application entry point
├── public/
│   └── models/           # 3D GLB models for campus rendering
├── dist/                 # Production build output
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies and scripts
```

---

## Architecture

### Authentication Flow
- Authentication state managed via React Context (`AuthContext`)
- Supports login with university credentials and guest mode
- Protected routes redirect unauthenticated users to `/login`
- Backend authentication via REST API (`/api/auth/*`)

### Routing
| Route | Component | Access |
|-------|-----------|--------|
| `/` | Redirects to `/login` | Public |
| `/login` | `LoginView` | Public |
| `/signup` | `SignupView` | Public |
| `/map` | `MapView` (3D/2D) | Protected |
| `/dining` | `DiningView` | Protected |
| `/about` | `AboutView` | Protected |

### 3D Rendering
- Three.js via `@react-three/fiber` and `@react-three/drei`
- Campus scene loaded from GLB model (`public/models/CPU-3d_map.glb`)
- Clickable building zones with HTML labels overlay
- Floor-by-floor room detail view with occupancy indicators

---

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | React | 19.2 |
| Language | TypeScript | 5.9 |
| Build Tool | Vite | 7.3 |
| Routing | React Router DOM | 7.13 |
| 3D Graphics | Three.js + @react-three/fiber + @react-three/drei | 0.183 / 9.5 / 10.7 |
| Styling | CSS3 (custom properties) | -- |
| Linting | ESLint | 9.39 |

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the WebDev directory:
   ```bash
   cd WebDev
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Start the development server with hot module replacement:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Create an optimized production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Linting

Run ESLint to check for code issues:
```bash
npm run lint
```

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start development server |
| `build` | `tsc -b && vite build` | TypeScript compilation + production build |
| `preview` | `vite preview` | Preview production build locally |
| `lint` | `eslint .` | Run ESLint |

---

## Environment Variables

The API base URL is currently hardcoded in `src/api/config.ts`. For deployment flexibility, configure it via environment variable:

```bash
# .env
VITE_API_BASE_URL=http://localhost:3000/api
```

Create a `.env` file in the root directory and update `src/api/config.ts` to use:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
```

---

## API Reference

The frontend communicates with a separate backend server.

**Base URL:** `http://localhost:3000/api`

### Endpoints

#### Authentication

| Method | Endpoint | Request Body | Response |
|--------|----------|--------------|----------|
| POST | `/api/auth/login` | `{ username: string, password: string }` | `{ message: string, user?: User }` |
| POST | `/api/auth/signup` | `{ university_id: number, username: string, password: string }` | `{ message: string, user?: User }` |
| GET | `/api/auth/universities` | -- | `{ universities: University[] }` |

#### Types

```typescript
interface User {
  id: number;
  username: string;
  university_id: number;
}

interface University {
  id: number;
  name: string;
}

interface ApiError {
  error: string;
}
```

#### Response Pattern

All API methods return a `ResponseResult<T>` discriminated union:

```typescript
type ResponseResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

---

## Folder Details

### `src/api/`
Backend API integration layer. Contains endpoint constants, TypeScript types for API requests/responses, and API client methods for authentication and university data.

### `src/common/`
Shared utilities including:
- `AuthContext` - Authentication state provider
- `ProtectedRoute` - Route guard component
- `TopNav` / `BottomNav` - Navigation components
- `Button` / `InputField` - Reusable form components
- `Result` - Generic discriminated union type for error handling
- `useUniversities` - Hook for fetching university data

### `src/map3d/`
3D visualization module:
- `CampusScene` - Main Three.js canvas with ground plane, GLB model, building zones
- `BuildingFloorView` - Floor-by-floor room detail with occupancy indicators
- `MapView3D` - Top-level component switching between campus view and floor detail
- `universities.ts` - University map configurations with building/floor/room data

### `src/dining/`
Dining guide with search and filter functionality (All, Restaurant, Cafe, Mess Hall, Snacks & Drinks). Contains hardcoded dining location data for CPU campus.

### `src/login-signup/`
Authentication views with form validation, university dropdown selection, and password requirements display.

### `src/css/`
Stylesheets organized by feature:
- `common/variables.css` - CSS custom properties
- `common/components.css` - Shared component styles
- `Map/`, `Dining/`, `Login-Signup/`, `About/` - Feature-specific styles

### `public/models/`
Contains 3D GLB model files for campus rendering (`CPU-3d_map.glb`).
