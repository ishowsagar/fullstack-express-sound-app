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
- [x] Controller functions defined (`getProducts`, `getGenres`)
- [x] SQLite packages installed
- [x] 10 vinyl album images added
- [x] Project documentation (PROJECT_NOTES.md)

### 🚧 In Progress / Not Yet Implemented:

- [ ] Database setup (SQLite connection)
- [ ] Database schema & table creation
- [ ] Product data seeding
- [ ] Actual controller logic implementation:
  - [ ] Query products from database
  - [ ] Filter products by genre
  - [ ] Search products by title/artist
  - [ ] Return JSON responses
- [ ] Error handling middleware
- [ ] Add request/response to controller function signatures

---

## 🎯 Next Steps / To-Do

### Immediate Priority:

1. **Database Implementation**:

   - Create database connection module
   - Design products table schema
   - Create seed data for 10 vinyl records
   - Implement database initialization script

2. **Controller Logic**:

   - Update `getProducts()` to query database & send response
   - Add filtering logic (genre, search query)
   - Update `getGenres()` to return unique genres
   - Fix function signatures to include `req, res` parameters

3. **Testing**:
   - Test API endpoints with Postman or browser
   - Verify frontend can fetch and display products
   - Test search and genre filtering

### Future Enhancements:

4. **Additional Features**:

   - Shopping cart functionality
   - User authentication (Login)
   - Product detail pages
   - Add to cart backend logic

5. **GitHub**:
   - Create GitHub repository
   - Add remote: `git remote add origin <url>`
   - Push code: `git push -u origin main`

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

**Last Updated:** December 9, 2025
