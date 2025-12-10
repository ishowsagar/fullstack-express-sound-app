# 🗄️ SQLite Database Journey - Spiral Sounds

**A creative exploration of building a database from scratch**

---

## 🎯 Mission: Vinyl Records Database

Transform a collection of vinyl album data into a fully functional SQLite database that powers our e-commerce API.

---

## 📚 The Story in 3 Acts

### Act 1: **CREATE** - Building the Foundation

### Act 2: **SEED** - Planting the Data Garden

### Act 3: **VERIFY** - Admiring the Results

---

## 🏗️ Act 1: CREATE THE TABLE

**File:** `createTable.js`  
**Purpose:** Architect the database structure

### The Blueprint

```javascript
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "node:path";

async function createTable() {
  // 🔌 Connect to database (creates file if doesn't exist)
  const db = await open({
    filename: path.join("database.db"), // Our treasure chest
    driver: sqlite3.Database, // The engine
  });

  // 🏛️ Design the table structure
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Auto-generates unique IDs
      title TEXT NOT NULL,                    -- Album title (required)
      artist TEXT NOT NULL,                   -- Artist name (required)
      price REAL NOT NULL,                    -- Price with decimals (required)
      image TEXT NOT NULL,                    -- Image filename (required)
      year INTEGER,                           -- Release year (optional)
      genre TEXT,                             -- Music genre (optional)
      stock INTEGER                           -- Inventory count (optional)
    )
  `);

  await db.close();
  console.log("🎉 product-table is created");
}

createTable();
```

### 🧠 Key Concepts Learned

#### SQLite Data Types

| Type      | Purpose         | Example                           |
| --------- | --------------- | --------------------------------- |
| `INTEGER` | Whole numbers   | `2020`, `12`                      |
| `REAL`    | Decimals/floats | `44.99`, `38.59`                  |
| `TEXT`    | Strings         | `"Selling Dogma"`, `"The Clouds"` |

#### Constraints

- **`PRIMARY KEY`** - Unique identifier for each row
- **`AUTOINCREMENT`** - Database generates next ID automatically
- **`NOT NULL`** - Field must have a value
- **`IF NOT EXISTS`** - Only create table if it doesn't exist (safe to run multiple times)

### 🔑 The ID System

```
Auto-increment Magic:
Insert record 1 → id = 1 ✨
Insert record 2 → id = 2 ✨
Insert record 3 → id = 3 ✨
Delete record 2 ❌
Insert record 4 → id = 4 ✨ (never reuses deleted IDs)
```

---

## 🌱 Act 2: SEED THE TABLE

**File:** `seedTable.js`  
**Purpose:** Populate database with vinyl album data

### The Data Source

**File:** `data.js` - Array of 10+ vinyl album objects:

```javascript
export const vinyl = [
  {
    title: "Selling Dogma",
    artist: "The Clouds",
    price: 44.99,
    image: "vinyl1.png",
    year: 2003,
    genre: "rock",
    stock: 12,
  },
  // ... 9 more albums
];
```

### The Seeding Process

```javascript
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "node:path";
import { vinyl } from "./data.js"; // Import the data

async function seedTable() {
  const db = await open({
    filename: path.join("database.db"),
    driver: sqlite3.Database,
  });

  try {
    // 🚦 START TRANSACTION: Group all operations together
    await db.exec("BEGIN TRANSACTION");

    // 🔄 Loop through each vinyl record
    for (const { title, artist, price, image, year, genre, stock } of vinyl) {
      await db.run(
        `INSERT INTO products (
          title, artist, price, image, year, genre, stock
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, artist, price, image, year, genre, stock]
      );
    }

    // ✅ COMMIT: Save everything permanently
    await db.exec("COMMIT");
    console.log("✨ All records inserted successfully.");
  } catch (err) {
    // ⚠️ ROLLBACK: Undo everything if ANY insert fails
    await db.exec("ROLLBACK");
    console.error("❌ Error inserting data:", err.message);
  } finally {
    await db.close();
    console.log("🔒 Database connection closed.");
  }
}

seedTable();
```

### 🛡️ The Transaction Shield

**Transactions = All-or-Nothing Guarantee**

```
┌─────────────────────────────────────┐
│  BEGIN TRANSACTION                  │
├─────────────────────────────────────┤
│  Insert vinyl 1  ✅                 │
│  Insert vinyl 2  ✅                 │
│  Insert vinyl 3  ✅                 │
│  Insert vinyl 4  ❌ ERROR!          │
├─────────────────────────────────────┤
│  ROLLBACK                           │
│  → Database returns to clean state  │
│  → No partial data                  │
└─────────────────────────────────────┘
```

**Without Transactions:**

```
Insert vinyl 1  ✅  (saved)
Insert vinyl 2  ✅  (saved)
Insert vinyl 3  ✅  (saved)
Insert vinyl 4  ❌  ERROR!
Result: 3 records saved, 7 missing = 💥 CORRUPTED DATA
```

### 🔒 SQL Injection Protection

**Parameterized Queries (The `?` placeholders):**

```javascript
// ✅ SAFE - Uses placeholders
db.run("INSERT INTO products (title, price) VALUES (?, ?)", [
  "Album Name",
  19.99,
]);

// ❌ DANGEROUS - String concatenation
db.run(`INSERT INTO products (title, price) VALUES ('${title}', ${price})`);
// ^ Vulnerable to SQL injection attacks!
```

**Why placeholders are safer:**

```javascript
// Malicious input:
const title = "'; DROP TABLE products; --";

// With placeholders: Treated as harmless string ✅
// Without: Executes as SQL command, deletes your table! 💀
```

---

## 👀 Act 3: VERIFY THE DATA

**File:** `logTable.js`  
**Purpose:** Read and display all products in a pretty table

```javascript
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "node:path";

async function viewAllProducts() {
  const db = await open({
    filename: path.join("database.db"),
    driver: sqlite3.Database,
  });

  try {
    // 📖 Read all products from database
    const products = await db.all("SELECT * FROM products");

    // 🎨 Format for display (pick specific columns)
    const displayItems = products.map(({ id, title, artist, year, stock }) => {
      return { id, title, artist, year, stock };
    });

    // 📊 Print as neat table to console
    console.table(displayItems);
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
  } finally {
    await db.close();
  }
}

viewAllProducts();
```

### 📺 The Output

```
┌─────────┬────┬──────────────────────┬──────────────────┬──────┬───────┐
│ (index) │ id │        title         │      artist      │ year │ stock │
├─────────┼────┼──────────────────────┼──────────────────┼──────┼───────┤
│    0    │ 1  │  'Selling Dogma'     │  'The Clouds'    │ 2003 │  12   │
│    1    │ 2  │ 'Echoes in Transit'  │ 'Silver Meadow'  │ 2012 │  12   │
│    2    │ 3  │ 'Midnight Parallels' │  'Neon Grove'    │ 2020 │  12   │
│   ...   │... │        ...           │      ...         │ ...  │  ...  │
└─────────┴────┴──────────────────────┴──────────────────┴──────┴───────┘
```

---

## 🔄 The Complete Workflow

```
1️⃣ npm install sqlite sqlite3
   ↓
2️⃣ node createTable.js     → Creates database.db + products table
   ↓
3️⃣ node seedTable.js        → Inserts 10 vinyl records
   ↓
4️⃣ node logTable.js         → Displays all records in console
   ↓
5️⃣ Ready to query from Express API! 🎉
```

---

## 🎓 Key Database Concepts Mastered

### 1. **Database Connection Pattern**

```javascript
// Open
const db = await open({ filename, driver });

// Do work
await db.exec("SQL here");

// Close
await db.close();
```

### 2. **CRUD Operations**

| Operation  | SQL Command   | db Method              |
| ---------- | ------------- | ---------------------- |
| **Create** | `INSERT INTO` | `db.run()`             |
| **Read**   | `SELECT`      | `db.all()`, `db.get()` |
| **Update** | `UPDATE`      | `db.run()`             |
| **Delete** | `DELETE`      | `db.run()`             |

### 3. **Database Methods**

```javascript
// Execute SQL without return value
await db.exec("CREATE TABLE ...");

// Execute with parameters, returns result info
await db.run("INSERT INTO ...", [values]);

// Get all matching rows
const rows = await db.all("SELECT * FROM products");

// Get single row
const row = await db.get("SELECT * FROM products WHERE id = ?", [1]);
```

### 4. **Async/Await Pattern**

All database operations are **asynchronous**:

```javascript
// ✅ Correct - wait for completion
await db.run("INSERT ...");
console.log("Done!");

// ❌ Wrong - doesn't wait
db.run("INSERT ...");
console.log("Done!"); // Runs before insert completes!
```

---

## 🆚 SQLite vs PostgreSQL Comparison

| Feature              | SQLite                  | PostgreSQL            |
| -------------------- | ----------------------- | --------------------- |
| **Type**             | File-based              | Client-server         |
| **Setup**            | None (just a file)      | Install & run server  |
| **Use Case**         | Dev, prototypes, mobile | Production, scale     |
| **Connection**       | File path               | Host/port/credentials |
| **Auto ID**          | `AUTOINCREMENT`         | `SERIAL`              |
| **Concurrent Users** | Limited                 | Excellent             |
| **Size Limit**       | ~140 TB                 | Unlimited             |
| **Best For**         | Learning, small apps    | Real applications     |

**🎯 For this project:** SQLite is perfect! Simple, no server setup, great for learning.

**🚀 For production:** Would use PostgreSQL for better performance & scalability.

---

## 🛠️ Database Files Created

```
fullstack-express-sound-app/
├── database.db          ← The actual SQLite database file
├── data.js              ← Source data (10 vinyl albums)
├── createTable.js       ← Schema creation script
├── seedTable.js         ← Data population script
└── logTable.js          ← Verification/viewing script
```

---

## 🧪 Testing Your Database

### Quick Commands:

```powershell
# Create the table
node createTable.js

# Insert the data
node seedTable.js

# View the data
node logTable.js

# Reset everything (delete database file)
Remove-Item database.db
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Table already exists"

```javascript
// Solution: Use IF NOT EXISTS
CREATE TABLE IF NOT EXISTS products (...)
```

### Issue 2: "UNIQUE constraint failed"

```javascript
// Solution: Delete existing data first, or drop table
await db.exec("DROP TABLE IF EXISTS products");
```

### Issue 3: "No such table"

```javascript
// Solution: Run createTable.js before seedTable.js
// Order matters!
```

### Issue 4: Wrong table name

```javascript
// createTable.js creates: "products"
// seedTable.js inserts into: "productsTable" ❌
// Must match exactly!
```

---

## 🎨 Creative Insights

### The Database is Like...

**🏗️ A Spreadsheet with Superpowers**

- Rows = Records (vinyl albums)
- Columns = Fields (title, artist, price)
- But with: validation, relationships, transactions, concurrent access

**📚 A Library Catalog System**

- Each book (vinyl) has ID, title, author (artist)
- You can search, filter, sort
- Multiple people can browse simultaneously

**🗂️ A Filing Cabinet**

- Each drawer = table
- Each folder = row
- Each label = column
- IDs = folder numbers for quick lookup

---

## 💡 Pro Tips

1. **Always use transactions for bulk operations** - keeps data consistent
2. **Use parameterized queries** - prevents SQL injection
3. **Close database connections** - use `finally` block
4. **Log errors clearly** - helps debugging
5. **Test with logTable.js** - verify data before using in API
6. **Keep data.js separate** - easy to update seed data
7. **Use meaningful column names** - `price` not `p`
8. **Add indexes later** - speeds up searches on large tables

---

## 🔮 What's Next?

Now that database is ready, we can:

1. ✅ Connect controllers to database
2. ✅ Implement `getProducts()` to query and return JSON
3. ✅ Implement `getGenres()` to return unique genres
4. ✅ Add filtering logic (search, genre)
5. ✅ Test API endpoints
6. ✅ Connect frontend to working backend

---

## 📖 SQL Cheat Sheet

```sql
-- Create
CREATE TABLE products (id INTEGER PRIMARY KEY, title TEXT);

-- Insert
INSERT INTO products (title, price) VALUES ('Album', 19.99);

-- Read All
SELECT * FROM products;

-- Read Filtered
SELECT * FROM products WHERE genre = 'rock';

-- Read Specific Columns
SELECT title, artist FROM products;

-- Update
UPDATE products SET price = 24.99 WHERE id = 1;

-- Delete
DELETE FROM products WHERE id = 5;

-- Count
SELECT COUNT(*) FROM products;

-- Unique Values
SELECT DISTINCT genre FROM products;

-- Order
SELECT * FROM products ORDER BY price DESC;

-- Limit
SELECT * FROM products LIMIT 10;
```

---

## 🎉 Achievement Unlocked!

**You've built a complete database system from scratch!**

- ✅ Designed schema with proper data types
- ✅ Implemented transactions for data integrity
- ✅ Used parameterized queries for security
- ✅ Created reusable database scripts
- ✅ Populated with real product data
- ✅ Verified with visual confirmation
- ✅ **Connected to Express API endpoints**
- ✅ **Implemented filtering & search queries**
- ✅ **Deployed fullstack app to GitHub**

**Skills Gained:**

- 🗄️ SQLite fundamentals
- 🔒 Transaction management
- 🛡️ SQL injection prevention
- 📊 Database design principles
- 🔄 CRUD operations
- ⚡ Async database operations
- 🔍 Advanced SQL queries (LIKE, DISTINCT, WHERE)
- 🎯 Query parameter handling
- 🌐 Database-API integration

---

## 🚀 From Database to Live Application

### The Complete Integration Journey

```
DATABASE LAYER                API LAYER                  CLIENT LAYER
─────────────────            ────────────               ──────────────

database.db                  server.js                  index.html
  ↓                            ↓                          ↓
products table    ←──────   routes/product.js  ────→   index.js
  │                            ↓                          ↓
  │                      controllers/                  UI renders
  │                      productControllers.js           ↓
  │                            ↓                    Product cards
  │                       SQL Queries                with animations
  │                            ↓
  └──────────────────→  getProducts()
                        getGenres()
```

### 🔗 How Database Powers the API

#### **1. Genre Dropdown Population**

```javascript
// Controller: getGenres()
SELECT DISTINCT genre FROM products
  ↓
[{genre: "rock"}, {genre: "indie"}, {genre: "folk"}]
  ↓
.map(row => row.genre)
  ↓
["rock", "indie", "folk"]  ← Sent to frontend
  ↓
Frontend populates <select> dropdown
```

#### **2. Product Filtering Flow**

```
User selects "rock" genre
  ↓
GET /api/products?genre=rock
  ↓
getProducts(req, res) extracts req.query.genre
  ↓
SQL: SELECT * FROM products WHERE genre = ?
Params: ["rock"]
  ↓
Database returns rock albums
  ↓
res.json(products)
  ↓
Frontend renders filtered products with fade-in animation
```

#### **3. Search Functionality**

```
User types "cloud" in search
  ↓
GET /api/products?search=cloud
  ↓
SQL: SELECT * FROM products
     WHERE title LIKE ? OR artist LIKE ? OR genre LIKE ?
Params: ["%cloud%", "%cloud%", "%cloud%"]
  ↓
Database finds matches in any column
  ↓
Returns: [{title: "Selling Dogma", artist: "The Clouds", ...}]
  ↓
Frontend displays matching products
```

#### **4. Combined Filters**

```
User: "rock" genre + "paper" search
  ↓
GET /api/products?genre=rock&search=paper
  ↓
SQL: SELECT * FROM products
     WHERE genre = ? AND (title LIKE ? OR artist LIKE ?)
Params: ["rock", "%paper%", "%paper%"]
  ↓
Database returns rock albums with "paper" in title/artist
  ↓
Precise filtered results displayed
```

---

## 📊 Database Connection Module

**File:** `db/db.js` (Database utility)

```javascript
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "node:path";

export async function getDBConnection() {
  return await open({
    filename: path.join("database.db"),
    driver: sqlite3.Database,
  });
}
```

**Used in controllers:**

```javascript
const db = await getDBConnection();
const products = await db.all(query, params);
await db.close();
res.json(products);
```

---

## 🎨 Real-World Query Examples

### Example 1: Get All Products

```sql
-- Query
SELECT * FROM products

-- Returns
[
  {id: 1, title: "Selling Dogma", artist: "The Clouds", price: 44.99, ...},
  {id: 2, title: "Echoes in Transit", artist: "Silver Meadow", price: 38.59, ...},
  ... (10 total)
]
```

### Example 2: Filter by Genre

```sql
-- Query
SELECT * FROM products WHERE genre = 'indie'

-- Returns
[
  {id: 2, title: "Echoes in Transit", genre: "indie", ...},
  {id: 7, title: "Velvet Frequencies", genre: "indie", ...}
]
```

### Example 3: Search Across Columns

```sql
-- Query
SELECT * FROM products
WHERE title LIKE '%night%' OR artist LIKE '%night%' OR genre LIKE '%night%'

-- Matches
{id: 3, title: "Midnight Parallels", artist: "Neon Grove", ...}
```

### Example 4: Get Unique Genres

```sql
-- Query
SELECT DISTINCT genre FROM products

-- Returns
[
  {genre: "rock"},
  {genre: "indie"},
  {genre: "ambient"},
  {genre: "folk"}
]

-- Transformed to
["rock", "indie", "ambient", "folk"]
```

---

## 🔐 Security Best Practices Applied

### ✅ What We Did Right:

1. **Parameterized Queries**

```javascript
// Safe - SQL and data are separate
db.all("SELECT * FROM products WHERE genre = ?", ["rock"]);
```

2. **Input Sanitization**

```javascript
// LIKE patterns built safely
const pattern = `%${search}%`; // User input wrapped in %
db.all("... WHERE title LIKE ?", [pattern]);
```

3. **Error Handling**

```javascript
try {
  const products = await db.all(query, params);
  res.json(products);
} catch (err) {
  res.status(500).json({ error: "Failed to fetch products" });
}
```

---

## 📈 Performance Considerations

### Current Setup (Perfect for Learning):

- ✅ Small dataset (10 records)
- ✅ Simple queries (fast execution)
- ✅ File-based database (easy deployment)

### Future Optimizations (For Scaling):

- 🔄 Add indexes on frequently queried columns (genre)
- 🔄 Implement query result caching
- 🔄 Connection pooling for concurrent requests
- 🔄 Pagination for large datasets
- 🔄 Migrate to PostgreSQL for production

---

**Database Status:** ✅ **FULLY INTEGRATED**  
**Records:** 10 vinyl albums  
**API Endpoints:** 2 active (`/api/products`, `/api/products/genres`)  
**Features:** Genre filter, Search, Combined filters  
**Deployed:** GitHub repository

---

## 🎓 What You Learned

### Database Fundamentals:

- Creating tables with proper data types
- Using constraints (PRIMARY KEY, NOT NULL)
- Auto-incrementing IDs
- Transactions (BEGIN, COMMIT, ROLLBACK)

### SQL Queries:

- SELECT with WHERE conditions
- LIKE operator for partial matching
- DISTINCT for unique values
- Combining conditions with AND/OR
- Parameterized queries for security

### Backend Integration:

- Database connection management
- Query execution with async/await
- Error handling in controllers
- Sending JSON responses

### Fullstack Flow:

- Client → Server → Database → Server → Client
- Query parameter extraction
- Data transformation (objects → arrays)
- Real-time filtering and search

---

_"Data is the new oil, but unlike oil, data is reusable, renewable, and gets better with use."_ 🛢️➡️💎

**— The Spiral Sounds Database Team** 🎵📀

**Date Completed:** December 10, 2025  
**Status:** Production-Ready Fullstack Application ✨
