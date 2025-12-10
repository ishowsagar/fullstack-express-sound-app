# Fullstack Express Sound App - Project Notes

**Project Name:** fullstack-express-sound-app  
**Author:** Denver.jr  
**Date Started:** December 9, 2025  
**Repository:** Local Git repository (not pushed to GitHub)

---

## 📋 Project Overview

A vinyl record e-commerce web application called "Spiral Sounds" built with Express.js backend and vanilla JavaScript frontend. The app displays vinyl albums, allows filtering by genre, and includes search functionality.

---

## 🛠️ Technology Stack

### Backend

- **Node.js** with **Express.js v5.2.1**
- **SQLite** database (`sqlite v5.1.1` & `sqlite3 v5.1.7`)
- **MVC Architecture**: Routes → Controllers pattern
- ES6 Modules (`"type": "module"` in package.json)
- Listening on port **8000**

### Frontend

- **HTML5** with semantic markup
- **CSS3** with CSS custom properties (variables)
- **Vanilla JavaScript** (ES6 modules)
- **Google Fonts**: Plaster & Poppins

---

## 📁 Project Structure

```
fullstack-express-sound-app/
├── server.js                        # Express server configuration & middleware
├── server copy.js                   # Backup of server file
├── package.json                     # Project dependencies & scripts
├── package-lock.json                # Locked dependency versions
├── PROJECT_NOTES.md                 # This documentation file
├── controllers/                     # Business logic layer
│   └── productControllers.js        # Product-related controller functions
├── routes/                          # Route definitions
│   └── product.js                   # Product API routes using Express Router
├── node_modules/                    # Installed dependencies
└── public/                          # Static files served by Express
    ├── index.html                   # Main HTML page
    ├── index.css                    # Stylesheet with CSS variables
    ├── index.js                     # Client-side JavaScript
    └── images/                      # Image assets (10 vinyl covers + logo)
        ├── spiral_logo.png
        ├── vinyl1.png
        ├── vinyl2.png
        ├── vinyl3.png
        ├── vinyl4.png
        ├── vinyl5.png
        ├── vinyl6.png
        ├── vinyl7.png
        ├── vinyl8.png
        ├── vinyl9.png
        └── vinyl10.png
```

---

## 🔧 Server Configuration (server.js)

### Key Features:

- **Static File Serving**: Express middleware serves content from `public/` directory
- **Route Order**: Code executes top-to-bottom
  1. `app.use(express.static("public"))` - serves static files first
  2. `app.get("/")` - handles root route (but static HTML takes precedence)
  3. `app.use("/api/products", productsRouter)` - mounts product API routes
- **Port**: 8000
- **Comments**: Detailed explanations about middleware execution order
- **MVC Pattern**: Routes imported from separate router module

### Code Structure:

```javascript
import express from "express";
import { productsRouter } from "./routes/product.js";

const app = express();

// Static files middleware
app.use(express.static("public"));

// Root route
app.get("/", (req, res) => {
  res.send("<!doctype html><html><body>Hello Express!</body></html>");
});

// API routes - mounted at /api/products
app.use("/api/products", productsRouter);

app.listen(8000, () => console.log("listening 8000"));
```

---

## 🛣️ Routes (routes/product.js)

### Express Router Implementation:

- **Base Path**: `/api/products` (defined in server.js)
- **Router Pattern**: Creates a mini-app for product-related routes
- **Exports**: `productsRouter` using named export

### Mounted Routes:

1. **GET `/api/products`** → `getProducts()` controller
   - Fetches all products with optional filtering
2. **GET `/api/products/genres`** → `getGenres()` controller
   - Returns list of unique genres

### Code:

```javascript
import express from "express";
import { getGenres, getProducts } from "../controllers/productControllers.js";

export const productsRouter = express.Router();

// Relative routes (base is /api/products)
productsRouter.get("/", getProducts); // /api/products
productsRouter.get("/genres", getGenres); // /api/products/genres
```

### Key Concept:

- Routes are **relative** to the base path mounted in server.js
- `productsRouter.get("/", ...)` actually handles `/api/products/`
- Common pitfall: Don't repeat `/api/products` in the router routes!

---

## 🎮 Controllers (controllers/productControllers.js)

### Current Status: **Skeleton Implementation**

Two async controller functions exported:

1. **`getProducts(req, res)`**

   - Currently logs: "products"
   - **TODO**: Query database, apply filters, return JSON response

2. **`getGenres(req, res)`**
   - Currently logs: "genres"
   - **TODO**: Query database for unique genres, return JSON response

### Code:

```javascript
export async function getGenres() {
  console.log("genres");
}

export async function getProducts() {
  console.log("products");
}
```

### Next Steps for Controllers:

- Add database connection (SQLite)
- Implement actual query logic
- Return proper HTTP responses with `res.json()`
- Add error handling

---

## 🗄️ Database Setup

### Installed:

- **sqlite**: v5.1.1 (Node.js SQLite wrapper)
- **sqlite3**: v5.1.7 (Native SQLite3 bindings)

### Status: **Not Yet Implemented**

### Planned Structure:

- Database file (e.g., `database.db`)
- Products table with fields:
  - id, title, artist, price, genre, image

---

## 🎨 Frontend Features

### HTML Structure (index.html)

- **Top Banner**: Menu toggle button + navigation (Login, Cart, Search)
- **Header**: Logo + "Spiral Sounds" branding
- **Genre Filter**: Dropdown to filter products by genre
- **Products Container**: Dynamically populated with vinyl albums
- **Footer**: Copyright notice
- **Accessibility**: ARIA labels, semantic HTML

### CSS Design (index.css)

- **Dark Theme**:
  - Background: `#121212`
  - Accent color: `#ff4c7b` (pink)
  - Text: `#E0E0E0`
- **CSS Variables**: Organized color scheme, spacing, fonts, border radius
- **Responsive**: Uses `clamp()` for fluid typography
- **Custom Fonts**: Plaster (headings), Poppins (body)

### JavaScript Functionality (index.js)

#### 1. **Menu Toggle**

- Hamburger menu for mobile navigation
- Toggles `.open` class on header menu

#### 2. **Product Fetching**

```javascript
async function getProducts(filters = {})
```

- Fetches products from `/api/products` endpoint
- Supports query parameters for filtering

#### 3. **Product Rendering**

```javascript
function renderProducts(products)
```

- Dynamically creates product cards
- Displays: image, title, artist, price, genre label
- "Add to Cart" button

#### 4. **Genre Filtering**

```javascript
async function populateGenreSelect()
```

- Fetches available genres from `/api/products/genres`
- Populates dropdown dynamically
- Filters products when genre selected

#### 5. **Search Functionality**

```javascript
async function applySearchFilter()
```

- Real-time search as user types
- Filters products by search query
- Prevents form submission (Enter key)

#### 6. **Event Listeners**

- Search input change
- Genre select change
- Form submit prevention

---

## 🚀 Running the Application

### Start Command:

```bash
npm start
```

or

```bash
node server.js
```

### Access:

```
http://localhost:8000
```

---

## 📦 Dependencies

```json
{
  "express": "^5.2.1"
}
```

---

## 🔄 Git Status

- **Branch**: main
- **Commits**: 1 commit - "initializing express app"
- **Working Tree**: Clean (no uncommitted changes)
- **Remote**: No remote repository configured (local only)

---

## 📝 Key Learning Points

### Express Middleware Execution:

- Middleware executes **top-to-bottom**
- `express.static()` serves files before route handlers
- `next()` function passes control to next middleware

### MVC Architecture Pattern:

- **Model**: Database layer (SQLite - to be implemented)
- **View**: Frontend (HTML/CSS/JS in public/)
- **Controller**: Business logic (productControllers.js)
- **Router**: Route definitions (product.js)

### Express Router Pattern:

- Creates modular, mountable route handlers
- Routes are relative to mounting point
- Common pitfall: Don't repeat base path in router definitions
- Example: Router path "/" becomes "/api/products/" when mounted at "/api/products"

### Static File Serving:

- Files in `public/` are accessible directly
- `index.html` served automatically at root (`/`)

---

## ⚠️ Current Implementation Status

### ✅ Completed:

- [x] Express server setup with middleware
- [x] Static file serving from `public/` directory
- [x] Complete frontend UI (HTML/CSS/JS)
- [x] MVC architecture structure (routes & controllers folders)
- [x] Express Router implementation for `/api/products` routes
- [x] Controller functions fully implemented with filtering logic
- [x] SQLite database setup with products table
- [x] Database seeded with 10 vinyl albums
- [x] Genre filtering API endpoint
- [x] Search filtering API endpoint
- [x] Combined genre + search filtering
- [x] Frontend animations (fade-in product cards)
- [x] 10 vinyl album images added
- [x] Project documentation (PROJECT_NOTES.md + DATABASE_JOURNEY.md)
- [x] **Code pushed to GitHub** ✨

---

## 🗄️ SQL Data Flow & Request Handling

### 📊 Complete Request-Response Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                                 │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
              ┌─────▼─────┐  ┌────▼────┐  ┌─────▼─────┐
              │  Selects  │  │ Searches│  │   Both    │
              │   Genre   │  │  Text   │  │ Genre +   │
              │  Dropdown │  │  Input  │  │  Search   │
              └─────┬─────┘  └────┬────┘  └─────┬─────┘
                    │              │              │
                    └──────────────┼──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │   Frontend (index.js)       │
                    │   Captures event            │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │ Builds query parameters:    │
                    │  ?genre=rock                │
                    │  ?search=cloud              │
                    │  ?genre=rock&search=cloud   │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  fetch('/api/products?...')│
                    │  HTTP GET Request           │
                    └──────────────┬──────────────┘
                                   │
┌─────────────────────────────────▼────────────────────────────────────────┐
│                            BACKEND                                        │
└───────────────────────────────────────────────────────────────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │   Express Server (8000)     │
                    │   routes/product.js         │
                    │   productsRouter.get('/')   │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  controllers/               │
                    │  productControllers.js      │
                    │  getProducts(req, res)      │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  Extract query parameters:  │
                    │  const {genre, search} =    │
                    │         req.query           │
                    └──────────────┬──────────────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           │                       │                       │
    ┌──────▼─────┐         ┌──────▼─────┐         ┌──────▼─────┐
    │  No Filter │         │Genre Only  │         │Search Only │
    │ (Show All) │         │            │         │            │
    └──────┬─────┘         └──────┬─────┘         └──────┬─────┘
           │                      │                       │
           │              ┌───────▼────────┐              │
           │              │  Genre + Search│              │
           │              │   (Combined)   │              │
           │              └───────┬────────┘              │
           │                      │                       │
┌──────────▼──────────────────────▼───────────────────────▼──────────────┐
│                     DATABASE QUERIES (SQLite)                           │
└─────────────────────────────────────────────────────────────────────────┘

📌 CASE 1: No Filters (Show All Products)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Request: GET /api/products
Query: {} (empty)

SQL: SELECT * FROM products
Params: [] (no placeholders)

Returns: All 10 vinyl albums

┌──────────────────────────────────────┐
│ [                                    │
│   {id: 1, title: "Selling Dogma",    │
│    artist: "The Clouds", ...},       │
│   {id: 2, title: "Echoes...", ...},  │
│   ... (10 albums total)              │
│ ]                                    │
└──────────────────────────────────────┘


📌 CASE 2: Genre Filter Only
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Request: GET /api/products?genre=rock
Query: {genre: "rock"}

SQL: SELECT * FROM products WHERE genre = ?
Params: ["rock"]

Executed as:
  SELECT * FROM products WHERE genre = 'rock'

Returns: Only rock albums

┌──────────────────────────────────────┐
│ [                                    │
│   {id: 1, title: "Selling Dogma",    │
│    genre: "rock", ...},              │
│   {id: 4, title: "Paper Skies",      │
│    genre: "rock", ...}               │
│ ]                                    │
└──────────────────────────────────────┘


📌 CASE 3: Search Filter Only
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Request: GET /api/products?search=cloud
Query: {search: "cloud"}

SQL: SELECT * FROM products
     WHERE title LIKE ? OR artist LIKE ? OR genre LIKE ?

Pattern: `%${search}%` → "%cloud%"
Params: ["%cloud%", "%cloud%", "%cloud%"]

Executed as:
  SELECT * FROM products
  WHERE title LIKE '%cloud%'
     OR artist LIKE '%cloud%'
     OR genre LIKE '%cloud%'

Returns: Matches "The Clouds" in artist

┌──────────────────────────────────────┐
│ [                                    │
│   {id: 1, title: "Selling Dogma",    │
│    artist: "The Clouds", ...}        │
│ ]                                    │
└──────────────────────────────────────┘


📌 CASE 4: Genre + Search Combined
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Request: GET /api/products?genre=rock&search=paper
Query: {genre: "rock", search: "paper"}

SQL: SELECT * FROM products
     WHERE genre = ? AND (title LIKE ? OR artist LIKE ?)

Pattern: `%${search}%` → "%paper%"
Params: ["rock", "%paper%", "%paper%"]

Executed as:
  SELECT * FROM products
  WHERE genre = 'rock'
    AND (title LIKE '%paper%' OR artist LIKE '%paper%')

Returns: Rock albums with "paper" in title/artist

┌──────────────────────────────────────┐
│ [                                    │
│   {id: 4, title: "Paper Skies",      │
│    artist: "The Ivory Youth",        │
│    genre: "rock", ...}               │
│ ]                                    │
└──────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                  RESPONSE SENT BACK TO CLIENT                            │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  res.json(products)         │
                    │  HTTP 200 OK                │
                    │  Content-Type:              │
                    │    application/json         │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  Frontend receives JSON     │
                    │  renderProducts(products)   │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  products.map() creates     │
                    │  HTML for each album        │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  albumsContainer.innerHTML  │
                    │  = cards (replaces DOM)     │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  NEW .product-card elements │
                    │  trigger CSS animation:     │
                    │  fadeInUp 0.5s ease-out     │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  🎬 Products smoothly       │
                    │     fade in & slide up!     │
                    └─────────────────────────────┘
```

---

## 🔍 SQL Query Breakdown by Scenario

### Scenario Table

| User Action        | Query Params               | SQL WHERE Clause                                | Placeholders Used                   |
| ------------------ | -------------------------- | ----------------------------------------------- | ----------------------------------- |
| **Page Load**      | None                       | None (all products)                             | `[]`                                |
| **Select "rock"**  | `?genre=rock`              | `genre = ?`                                     | `["rock"]`                          |
| **Search "cloud"** | `?search=cloud`            | `title LIKE ? OR artist LIKE ? OR genre LIKE ?` | `["%cloud%", "%cloud%", "%cloud%"]` |
| **Rock + "paper"** | `?genre=rock&search=paper` | `genre = ? AND (title LIKE ? OR artist LIKE ?)` | `["rock", "%paper%", "%paper%"]`    |

---

## 🎯 Controller Logic Flow (productControllers.js)

### Complete if-else-if Chain:

```javascript
export async function getProducts(req, res) {
  try {
    const db = await getDBConnection();
    const { genre, search } = req.query;

    // 🔀 Decision Tree Based on Query Parameters

    if (genre && search) {
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 📍 BOTH FILTERS ACTIVE
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      query = `SELECT * FROM products 
               WHERE genre = ? AND (title LIKE ? OR artist LIKE ?)`;
      const pattern = `%${search}%`;
      const products = await db.all(query, [genre, pattern, pattern]);
      res.json(products);
    } else if (genre) {
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 📍 GENRE FILTER ONLY
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      query = `SELECT * FROM products WHERE genre = ?`;
      const products = await db.all(query, [genre]);
      res.json(products);
    } else if (search) {
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 📍 SEARCH FILTER ONLY
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      query = `SELECT * FROM products 
               WHERE title LIKE ? OR artist LIKE ? OR genre LIKE ?`;
      const pattern = `%${search}%`;
      const products = await db.all(query, [pattern, pattern, pattern]);
      res.json(products);
    } else {
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 📍 NO FILTERS (SHOW ALL)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      query = `SELECT * FROM products`;
      const products = await db.all(query);
      res.json(products);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
}
```

---

## 🛡️ Security: SQL Injection Prevention

### ✅ Correct (Parameterized Queries):

```javascript
// Placeholders (?) keep SQL and data separate
const query = "SELECT * FROM products WHERE genre = ?";
const params = ["rock"]; // User input is safely escaped

// Even malicious input is treated as harmless text:
const malicious = "rock'; DROP TABLE products; --";
// Database sees: WHERE genre = 'rock''; DROP TABLE products; --'
// (Just searches for that weird string, doesn't execute!)
```

### ❌ Dangerous (String Concatenation):

```javascript
// DON'T DO THIS!
const query = `SELECT * FROM products WHERE genre = '${genre}'`;

// Malicious input:
const genre = "rock'; DROP TABLE products; --";
// Executed SQL: SELECT * FROM products WHERE genre = 'rock'; DROP TABLE products; --'
// 💀 Your entire table gets deleted!
```

**Key Rule:** Never put user input directly in SQL strings. Always use `?` placeholders!

---

## 🎨 Frontend Animation Flow

### CSS Animation Mechanism:

```css
.product-card {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0; /* Invisible */
    transform: translateY(20px); /* 20px below */
  }
  to {
    opacity: 1; /* Fully visible */
    transform: translateY(0); /* Normal position */
  }
}
```

### Why It Triggers on Every Filter:

```javascript
// renderProducts() destroys and recreates ALL elements
albumsContainer.innerHTML = cards;

// This creates BRAND NEW <div class="product-card"> elements
// New DOM elements = Animation runs automatically!
```

**Timeline:**

1. User selects filter → `0.0s`
2. Fetch request sent → `0.0s - 0.1s`
3. Database query → `0.1s - 0.15s`
4. Response received → `0.15s`
5. `innerHTML` replaces DOM → `0.15s`
6. New elements created → `0.16s`
7. **CSS animation starts** → `0.16s - 0.66s` ✨
8. Products fully visible → `0.66s`

---

## 📦 Dependencies

```json
{
  "express": "^5.2.1",
  "sqlite": "^5.1.1",
  "sqlite3": "^5.1.7"
}
```

---

## 💡 Design Philosophy

- **Clean Code**: Well-commented, organized structure
- **Modular**: Separation of concerns (HTML/CSS/JS)
- **Accessible**: ARIA labels, semantic HTML
- **Modern**: ES6+ syntax, CSS variables, async/await
- **User-Friendly**: Search, filter, responsive design

---

## 🎨 Brand Identity: "Spiral Sounds"

- **Tagline**: "The best in vinyl"
- **Logo**: Spiral design
- **Theme**: Retro vinyl record aesthetic with modern dark UI
- **Target**: Vinyl enthusiasts and collectors

---

## 🎯 Future Enhancements

### Possible Features:

1. **Shopping Cart**:

   - Add to cart functionality
   - Cart state management
   - Checkout process

2. **User Authentication**:

   - Login/Register system
   - Session management
   - Protected routes

3. **Product Details**:

   - Individual product pages
   - Reviews and ratings
   - Stock management

4. **Advanced Filtering**:

   - Price range filter
   - Year filter
   - Sort by price/popularity

5. **Admin Dashboard**:
   - Add/Edit/Delete products
   - Inventory management
   - Sales analytics

---

**Last Updated:** December 10, 2025  
**Status:** ✅ Fully Functional - Deployed to GitHub  
**Live Features:** Genre filtering, Search, Smooth animations
