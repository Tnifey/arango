import type { Connection } from "../connection.ts";
import type { Database } from "../database.ts";
import type { Cursor } from "../cursor.ts";

export type { Cursor, Database };

export type CursorLike = Cursor | {
  database: DatabaseLike;
  host: string;
  id: string;
};

export type DatabaseLike = Database | {
  connection: Connection;
  name: string;
  isAbsolute: boolean;
};
