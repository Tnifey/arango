import { Connection, ConnectionConfig } from "./src/connection.ts";

export default function createConnection(options?: ConnectionConfig) {
  return new Connection(options);
}

export * from "./src/connection.ts";
export * from "./src/database.ts";
export * from "./src/cursor.ts";
export * from "./src/collection.ts";
export * from "./src/error.ts";
export * from "./src/aql.ts";
