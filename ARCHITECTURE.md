# U-Nav Project Architecture

## Overview

U-Nav is a university campus navigation app built by 1st-year Software Engineering students. It helps students find their way around campus, discover dining locations, and stay updated on campus events.

---

## High-Level Architecture

```mermaid
flowchart LR
    subgraph Client["User's Device"]
        Phone["Phone or Computer"]
        Browser["Web Browser"]
    end

    subgraph U_Nav
        Web["React Frontend<br/>(WebDev/)"]
        Server["Express API<br/>(Backend/)"]
        DB["PostgreSQL<br/>(Supabase)"]
    end

    Phone --> Browser
    Browser --> Web
    Web --> Server
    Server --> DB
    DB --> Server
    Server --> Web
    Web --> Browser
```

**Data Flow:**

1. User opens U-Nav in browser
2. React frontend renders UI
3. API client sends request to Express backend
4. Backend verifies JWT, queries database
5. PostgreSQL returns data
6. Frontend displays result

---

## U-Nav Architecture (Detailed)

```mermaid
flowchart TB
    subgraph Users
        Student["Students"]
        Admin["Administrators"]
    end

    subgraph Frontend["React Frontend (WebDev)"]
        LoginPage["Login Screen"]
        SignupPage["Sign Up Screen"]
        MapPage["Map View"]
        DiningPage["Dining View"]
        EventsPage["Events View"]
        AdminPage["Admin Panel"]
        Auth["Authentication"]
        API["API Connection"]
        Pathfinding["Pathfinding (Simple)"]
        Geo["Geolocation Sync"]
    end

    subgraph Backend["Express Backend (Backend)"]
        direction TB
        Express["Express Server"]
        subgraph Routing
            direction LR
            AuthRoutes["Auth Routes"]
            UsersRoutes["Users Routes"]
            DiningRoutes["Dining Routes"]
            EventsRoutes["Events Routes"]
        end
        Middleware["Security Check / JWT"]
    end

    subgraph Database["PostgreSQL Database"]
        UsersDB["Users Table"]
        UnivDB["Universities Table"]
        DiningDB["Dining Locations Table"]
        EventsDB["Events Table"]
    end

    Users --> Frontend

    LoginPage --> Auth
    SignupPage --> Auth
    MapPage --> Auth
    DiningPage --> Auth
    EventsPage --> Auth
    AdminPage --> Auth

    Auth --> API
    DiningPage --> API
    EventsPage --> API
    AdminPage --> API

    API --> Express
    Express --> Routing
    Routing --> Middleware

    Middleware --> UsersDB
    Middleware --> UnivDB
    Middleware --> DiningDB
    Middleware --> EventsDB
```

---

## U-Nav Features

```mermaid
flowchart TB
    subgraph Authentication
        A1[Login]
        A2[Sign Up]
        A3[Guest Access]
    end

    subgraph Navigation
        N1[2D Map]
        N2[3D Map]
        N3[Floor Selection]
        N4[Simple Pathfinding]
        N5[Smart Camera Sync]
    end

    subgraph Information
        I1[Dining Locations]
        I2[Campus Events]
        I3[About Page]
    end

    subgraph Admin_Management
        AM1[User Management]
        AM2[Dining Management]
        AM3[Events Management]
        AM4[University Management]
    end
```

---

## Data Flow (Step by Step)

```mermaid
sequenceDiagram
    participant Student
    participant Website
    participant Server
    participant Database

    note right of Student: Logging In
    Student->>Website: Enter email & password
    Website->>Server: Send login request
    Server->>Server: Security Check (JWT)
    Server->>Database: Check credentials
    alt Valid credentials
        Database->>Server: User confirmed
        Server->>Website: Login successful
        Website->>Student: Show dashboard
    else Invalid credentials
        Database->>Server: No match found
        Server->>Website: Show error
        Website->>Student: Show error message
    end

    note right of Student: Signing Up
    Student->>Website: Fill registration form
    Website->>Server: Send signup request
    Server->>Server: Security Check (Validate input)
    Server->>Database: Check if email exists
    alt Email not taken
        Database->>Server: No existing user
        Server->>Database: Create new user
        Database->>Server: User created
        Server->>Website: Signup successful
        Website->>Student: Show success message
    else Email already exists
        Database->>Server: Email found
        Server->>Website: Show error
        Website->>Student: Show error message
    end

    note right of Student: Viewing Map & Navigating
    Student->>Website: Click Map tab
    Website->>Server: Request map data
    Server->>Server: Security Check (JWT Verify)
    Server->>Database: Get map information
    Database->>Server: Map data
    Server->>Website: Return map data
    Website->>Website: Calculate Path (Pathfinding Engine)
    Website->>Student: Display 3D campus map with path

    note right of Student: Finding Food
    Student->>Website: Go to Dining
    Website->>Server: Request dining list
    Server->>Server: Security Check (JWT Verify)
    Server->>Database: Get all dining locations
    Database->>Server: Dining data
    Server->>Website: Return restaurants
    Website->>Student: Show dining options

    note right of Student: Admin Managing Data
    Admin->>Website: Access admin panel
    Website->>Server: Security Check (Admin Verify)
    Server->>Admin: Show admin dashboard
    Admin->>Website: Add/Edit/Delete item
    Website->>Server: Send update request
    Server->>Server: Security Check (Admin Verify)
    Server->>Database: Modify data
    Database->>Server: Confirm change
    Server->>Website: Show success
    Website->>Admin: Confirm update
```

---

## Database Structure

```mermaid
erDiagram
    universities ||--o{ users : "has"
    universities ||--o{ dining_locations : "contains"
    universities ||--o{ events : "hosts"

    universities {
        int id PK "Unique number"
        varchar name "University name"
        varchar email_domain "Email ending"
        timestamp created_at "When created"
    }

    users {
        int id PK "Unique number"
        int university_id FK "Which university"
        varchar email "Email address"
        varchar username "Display name"
        varchar password_hash "Encrypted password"
        varchar role "user or admin"
        varchar student_id "Student ID number"
    }

    dining_locations {
        int id PK "Unique number"
        int university_id FK "Which university"
        varchar name "Restaurant name"
        varchar type "Type of place"
        varchar building "Building name"
        int floor "Floor number"
        varchar operating_hours "Open hours"
        varchar price_range "Price level"
        text[] cuisine "Types of food"
        decimal rating "Star rating"
        varchar image_url "Photo"
        int coordinates_x "Map position X"
        int coordinates_y "Map position Y"
    }

    events {
        int id PK "Unique number"
        int university_id FK "Which university"
        varchar title "Event name"
        text description "Details"
        varchar location "Room/Place"
        date event_date "When"
        varchar event_time "Time"
        varchar organizer "Who organized"
        varchar category "Type of event"
    }
```

---

## API Endpoints (What the Server Does)

```mermaid
flowchart LR
    subgraph AuthRoutes
        LR1["POST /login - Verify user identity"]
        LR2["POST /signup - Create new account"]
        LR3["GET /universities - List universities"]
        LR4["POST /universities - Create university - Admin only"]
        LR5["DELETE /universities/:id - Delete university - Admin only"]
    end

    subgraph UsersRoutes
        UR1["GET /users - List all users - Admin only"]
        UR2["GET /users/:id - Get user details"]
        UR3["PUT /users/:id/role - Update user role - Admin only"]
        UR4["DELETE /users/:id - Remove user - Admin only"]
    end

    subgraph DiningRoutes
        DR1["GET /dining - List restaurants"]
        DR2["GET /dining/:id - Get restaurant"]
        DR3["POST /dining - Add restaurant"]
        DR4["PUT /dining/:id - Update restaurant"]
        DR5["DELETE /dining/:id - Remove restaurant"]
    end

    subgraph EventsRoutes
        ER1["GET /events - List events"]
        ER2["GET /events/:id - Get event details"]
        ER3["POST /events - Create event"]
        ER4["PUT /events/:id - Update event"]
        ER5["DELETE /events/:id - Remove event"]
    end
```

---

## Technology Stack

| Layer | Technology | Key Files |
|-------|-----------|----------|
| Frontend | React 19 + TypeScript | `WebDev/src/main.tsx`, `App.tsx` |
| Build Tool | Vite 7.3 | `WebDev/vite.config.ts` |
| Backend | Express 5 + Node.js | `Backend/src/index.ts` |
| Database | PostgreSQL (Supabase) | `Backend/src/config/database.ts` |
| Security | JWT + bcryptjs | `Backend/src/routes/auth.ts`, `middleware/auth.ts` |
| Routing | React Router DOM 7 | `WebDev/src/App.tsx` |
| 3D Graphics | React Three Fiber | `src/map/3d/MapView3D.tsx`, `CampusScene.tsx` |
| Pathfinding | Custom simple | `src/map/3d/pathfinder.ts` |
| Geolocation | Browser API | `src/map/3d/geolocation.ts` |

---

## User Roles and Access

```mermaid
flowchart TB
    subgraph Roles["User Roles"]
        Guest["Guest User"]
        Student["Student User"]
        UnivAdmin["University Admin"]
        GlobalAdmin["Global Admin"]
    end

    subgraph Access["Access Permissions"]
        Map["View Map"]
        Dining["View Dining"]
        Events["View Events"]
        AdminPanel["Admin Panel"]
    end

    Guest --> Map
    Guest --> Dining
    Guest --> Events
    
    Student --> Map
    Student --> Dining
    Student --> Events
    
    UnivAdmin --> Map
    UnivAdmin --> Dining
    UnivAdmin --> Events
    UnivAdmin --> AdminPanel
    
    GlobalAdmin --> Map
    GlobalAdmin --> Dining
    GlobalAdmin --> Events
    GlobalAdmin --> AdminPanel
```

| Role | Map | Search Buildings | Dining | Events | Manage Own Univ | Manage All |
|------|-----|----------------|--------|--------|--------------|----------|
| Guest | Yes | Yes | No | No | No | No |
| Student | Yes | Yes | Yes | Yes | No | No |
| University Admin | Yes | Yes | Yes | Yes | Yes | No |
| Global Admin | Yes | Yes | Yes | Yes | Yes | Yes |

---

## Key Files Reference

| Layer | File | Purpose |
|-------|------|---------|
| **Frontend** | `WebDev/src/main.tsx` | React entry point, boots with AuthProvider |
| **Frontend** | `WebDev/src/App.tsx` | Route definitions, all pages |
| **Frontend** | `WebDev/src/api/client.ts` | Centralized fetch wrapper |
| **Frontend** | `WebDev/src/common/AuthContext.tsx` | Global auth state |
| **Frontend** | `WebDev/src/map/3d/MapView3D.tsx` | Main 3D map component |
| **Frontend** | `WebDev/src/map/3d/CampusScene.tsx` | Three.js canvas setup |
| **Frontend** | `WebDev/src/map/3d/pathfinder.ts` | Custom pathfinding |
| **Backend** | `Backend/src/index.ts` | Express server entry |
| **Backend** | `Backend/src/routes/auth.ts` | Login, signup, JWT |
| **Backend** | `Backend/src/middleware/auth.ts` | JWT verification |
| **Backend** | `Backend/src/config/database.ts` | PostgreSQL connection |
| **Database** | `Database/schema.sql` | SQL schema |

---

## Summary

**U-Nav has three layers:**

1. **React Frontend** - What users see and interact with
2. **Express Backend** - Processes requests, handles auth
3. **PostgreSQL Database** - Stores all data

**Core Features:**

- 3D Campus Map (React Three Fiber)
- Custom pathfinding algorithm
- Dining guide with filtering
- Campus events calendar
- Admin dashboard
- JWT authentication

**Built by 1st-year Software Engineering students.**
