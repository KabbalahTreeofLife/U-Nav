# U-Nav Project Architecture

## Overview

U-Nav is a university navigation app that helps students find their way around campus, discover dining locations, and stay updated on campus events.

---

## How U-Nav Works (Simple View)

```mermaid
flowchart LR
    subgraph User
        Phone["Phone or Computer"]
    end

    subgraph U_Nav
        Web["Website"]
        Server["Server"]
        DB["Data Storage"]
    end

    Phone --> Web
    Web --> Server
    Server --> DB
    DB --> Server
    Server --> Phone
```

**Simple Explanation:**

1. Student opens U-Nav on their phone or computer
2. U-Nav website sends a request to the server
3. Server checks the database for information
4. Database sends back the requested information
5. U-Nav shows it to the student

---

## U-Nav Architecture (Detailed)

```mermaid
flowchart TB
    subgraph Users
        Student["Students"]
        Admin["Administrators"]
    end

    subgraph Frontend
        LoginPage["Login Screen"]
        SignupPage["Sign Up Screen"]
        MapPage["Map View"]
        DiningPage["Dining View"]
        EventsPage["Events View"]
        AdminPage["Admin Panel"]
        Auth["Authentication"]
        API["API Connection"]
        Pathfinding["Pathfinding Engine (Simple)"]
        Geo["Geolocation Sync"]
    end

    subgraph Backend
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

    subgraph Database
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

| Component   | Technology            | Purpose           |
| ----------- | --------------------- | ----------------- |
| Frontend    | React + TypeScript    | Website interface |
| Build Tool  | Vite                  | Fast development  |
| Backend     | Node.js + Express     | Server logic      |
| Database    | Supabase (PostgreSQL) | Data storage      |
| Security    | JWT + bcrypt          | Authentication    |
| Routing     | React Router          | Page navigation   |
| 3D Graphics | React Three Fiber    | 3D map rendering  |
| Pathfinding | Simple Implementation | Route calculation |
| Geolocation | Browser API / Custom | Position tracking |

---

## User Types & Access

```mermaid
flowchart LR
    Users[User Types]
    Regular[Regular Users]
    Admins[Admin Users]

    Student[Students]
    Guest[Guest Users]
    UnivAdmin[University Admin]
    GlobalAdmin[Global Admin]

    Features[Access To]
    Map[Map View]
    Dining[Dining]
    Events[Events]

    Users --> Regular
    Users --> Admins

    Regular --> Student
    Regular --> Guest

    Admins --> UnivAdmin
    Admins --> GlobalAdmin

    Student --> Features
    Guest --> Features
    UnivAdmin --> Features
    GlobalAdmin --> Features

    Features --> Map
    Features --> Dining
    Features --> Events
```

---

## Summary

**U-Nav has three main parts:**

1. **Website (Frontend)** - What students see and interact with
2. **Server (Backend)** - Handles all the logic and processing
3. **Database (Data Storage)** - Stores all the information

**Key Features:**

- 🗺️ **Maps** - 2D and 3D campus maps
- 🍔 **Dining** - Find restaurants, cafes, and food spots
- 📅 **Events** - Stay updated on campus events
- 👥 **Admin** - Manage all content easily
- 🔒 **Security** - Safe and secure authentication
