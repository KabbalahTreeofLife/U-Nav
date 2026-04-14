# 🧩 U-Nav Codebase Navigation Guide

This guide provides a step-by-step walkthrough of the U-Nav repository, explaining the purpose of each directory and key file to help you get started quickly.

---

## 📂 Root Directory
The root directory manages the overall project structure and multi-package setup.

- `Backend/`: The Node.js/Express API server.
- `WebDev/`: The React/Vite-based web application.
- `Database/`: Contains SQL schemas and migration scripts for Supabase.
- `Mobile/`: (In-progress) React Native or Flutter mobile implementation.
- `Shared/`: Shared types and utilities used across packages.
- `Architecture.md`: Detailed diagrams explaining the system's design.
- `package.json`: Root scripts for installing and running everything simultaneously.

---

## 🚀 Backend (`/Backend`)
The heart of U-Nav's logic and database interaction.

- **`src/index.ts`**: The entry point. Initializes Express, applies middleware (CORS, Rate Limiting), and registers routes.
- **`src/routes/`**: Handles specific API domains:
  - `auth.ts`: Login, signup, and password hashing logic.
  - `users.ts`: Profile management and admin-only user operations.
  - `dining.ts`: Managing dining locations and menu data.
  - `events.ts`: Managing campus-wide events.
- **`src/middleware/`**: Security and utility logic (e.g., JWT verification).
- **`src/config/`**: Supabase client initialization and environment configuration.

---

## 🌐 WebDev (`/WebDev`)
The immersive frontend experience built with React and Three.js.

### Core Structure
- **`src/App.tsx`**: Manages routing and the top-level application state.
- **`src/main.tsx`**: Bootstraps the React application into the DOM.

### Map & 3D Engine (`src/map/`)
- **`src/map/3d/`**: The most critical part of the application.
  - `CampusScene.tsx`: The 3D canvas setup, lighting, and ground plane.
  - `MapView3D.tsx`: Orchestrates the transition between the campus view and building/floor views.
  - `pathfinder.ts`: Implementation of the **simple pathfinding engine** for campus navigation.
  - `navigation.ts`: Handles camera movements, centering, and world boundary constraints.
  - `userPosition.tsx`: Manages the visual representation of the user in 3D space.
  - `coordinateTransform.ts`: Converts real-world GPS/map units to Three.js world coordinates.
- **`src/map/data.ts`**: Static data for landmarks and map points.

### Features & Components
- **`src/api/`**: The service layer. All `fetch` calls are centralized here.
- **`src/login-signup/`**: Complex forms with validation for student/guest access.
- **`src/dining/`**: Filterable lists and detail views for campus eateries.
- **`src/common/`**:
  - `AuthContext.tsx`: React Context for global authentication state.
  - `ProtectedRoute.tsx`: Guards routes that require a logged-in user.

---

## 🗄️ Database (`/Database`)
- **`schema.sql`**: The single source of truth for the Supabase/PostgreSQL structure. Defines tables for `users`, `universities`, `dining_locations`, and `events`.

---

## 🛠️ How to Navigate a Change
1. **New API endpoint?** Add the route in `Backend/src/routes/` and the client call in `WebDev/src/api/`.
2. **UI tweak on the map?** Most changes happen in `WebDev/src/map/3d/MapView3D.tsx` or its child components.
3. **Adding a building?** Update the GLB model in `WebDev/public/models/` and its metadata in `WebDev/src/map/3d/universities.ts`.
