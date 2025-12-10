import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "node:path";

// ! use this fnc to connect to database
export async function getDBConnection() {
  const dbPath = path.join("database.db");
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}
