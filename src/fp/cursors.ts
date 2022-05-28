import type { CursorLike, Database } from "./types.ts";
import type { AqlQuery, GeneratedAqlQuery } from "../aql.ts";
import { Cursor } from "../cursor.ts";

export function cursorCreate<T = unknown>(
  database: Database,
  query: AqlQuery | GeneratedAqlQuery,
  options?: CursorCreateOptions,
) {
  return database.request<{ id: string; result: T[] }, unknown>({
    method: "POST",
    path: `/_api/cursor`,
    body: {
      query: query.query,
      bindVars: query.bindVars,
      options: options,
    },
    transform: ({ result, id }, _response, host) => {
      return new Cursor<T>({ database, host, id }, result);
    },
  });
}

export function cursorDrop(cursor: CursorLike, options?) {
  return cursor.database.request<unknown, unknown>({
    method: "DELETE",
    path: `/_api/cursor/${cursor.id}`,
    silent: options?.silent,
    host: cursor.host,
  });
}

export function cursorNextBatch(
  cursor: CursorLike,
  options?: CursorNextBatchOptions,
) {
  return cursor.database.request({
    method: "POST",
    path: `/_api/cursor/${cursor.id}`,
    silent: options?.silent,
    host: cursor.host,
    transform: ({ result }) => new Cursor(cursor, result),
  });
}

export type CursorNextBatchOptions = {
  silent?: boolean;
};

export type CursorCreateOptions = {
  batchSize?: number;
  count?: boolean;
  ttl?: number;
  fullCount?: boolean;
  cache?: boolean;
  cacheSize?: number;
};
