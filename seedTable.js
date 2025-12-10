import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "node:path";
import { vinyl } from "./data.js";

async function seedTable() {
  const db = await open({
    filename: path.join("database.db"),
    driver: sqlite3.Database,
  });

  try {
    // * BEGIN TRANSACTION: Start a database transaction (all-or-nothing operation)
    // If anything fails, we can rollback ALL changes as if nothing happened
    await db.exec("begin transaction");
    // for ( const Eachobj of array) --> just destructured to use its properties indiviually
    for (const { title, artist, price, image, year, genre, stock } of vinyl) {
      await db.run(
        `
            insert into products (
            title,artist,price,image,year,genre,stock       
            ) values (?,?,?,?,?,?,?)`,
        //  ! these values from dataArr will replace the '?' placeholder values enclosed in array
        [title, artist, price, image, year, genre, stock]
      );
    }
    // * COMMIT: Save all changes permanently to the database
    // Only runs if ALL inserts succeeded (no errors in try block)
    await db.exec("commit");
    console.log("All records inserted successfully.");
  } catch (err) {
    // * ROLLBACK: Undo ALL changes made in this transaction
    // Database returns to state BEFORE "begin transaction"
    await db.exec("rollback");
    console.error("Error inserting data:", err.message);
  } finally {
    await db.close();
    console.log("Database connection closed.");
  }
}

seedTable();
