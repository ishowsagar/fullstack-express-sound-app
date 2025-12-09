import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "node:path";

async function createTable() {
  const db = await open({
    // this will create this file when query executed
    filename: path.join("database.db"),
    driver: sqlite3.Database,
  });

  await db.exec(`
    create table if not exists products(
    id integer primary key autoincrement,
    title text not null,
    artist text not null,
    price real not null,
    image text not null,
    year integer,
    genre text,
    stock integer
    )
    `);

  await db.close();
  console.log("product-table is created");
}

createTable();
