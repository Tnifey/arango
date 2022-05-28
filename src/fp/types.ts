import type { Database } from "../database.ts";
import type { Cursor } from "../cursor.ts";

export type { Cursor, Database };

export type CursorLike = Cursor | {
  database: Database;
  host: string;
  id: string;
};
