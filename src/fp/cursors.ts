import type { CursorLike, DatabaseLike } from "./types.ts";
import type { AqlQuery, GeneratedAqlQuery } from "../aql.ts";
import { Cursor } from "../cursor.ts";
import { queueRequest } from "../request.ts";

export function cursorCreate<T = unknown>(
  database: DatabaseLike,
  query: AqlQuery | GeneratedAqlQuery,
  options?: CursorCreateOptions,
) {
  return queueRequest<{ id: string; result: T[] }, unknown>(database, {
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
  return queueRequest<unknown, unknown>(cursor.database, {
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
  return queueRequest(cursor.database, {
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
