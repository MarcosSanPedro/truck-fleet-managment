import { Database } from "bun:sqlite";

const db = new Database("test")

db.query('SELECT * FROM drivers')