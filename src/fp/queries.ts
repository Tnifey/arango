import type { DatabaseLike } from "./types.ts";
import type { AqlQuery, GeneratedAqlQuery } from "../aql.ts";
import { queueRequest } from "../request.ts";

export function queryCacheDrop(database: DatabaseLike) {
  return queueRequest(database, {
    method: "DELETE",
    path: `_api/query-cache`,
  });
}

export function queryCacheEntries(database: DatabaseLike) {
  return queueRequest(database, {
    path: `_api/query-cache`,
  });
}

export function queryCacheProperties(database: DatabaseLike) {
  return queueRequest(database, {
    path: `_api/query-cache/properties`,
  });
}

export function queryCacheSetProperties(
  database: DatabaseLike,
  options: QueryCacheSetPropertiesOptions,
) {
  return queueRequest(database, {
    method: "PUT",
    path: `_api/query-cache/properties`,
    body: options,
  });
}

export function queryCurrent(database: DatabaseLike) {
  return queueRequest(database, {
    path: `_api/query/current`,
  });
}

export function queryDrop(database: DatabaseLike, queryId: string) {
  return queueRequest(database, {
    method: "DELETE",
    path: `_api/query/${queryId}`,
  });
}

export function queryExplain(
  database: DatabaseLike,
  query: AqlQuery | GeneratedAqlQuery,
  options?,
) {
  return queueRequest(database, {
    method: "POST",
    path: `_api/query/explain`,
    body: {
      query: query.query,
      bindVars: query.bindVars,
      options: options,
    },
  });
}

export function queryParse(database: DatabaseLike, query: string) {
  return queueRequest(database, {
    method: "POST",
    path: `_api/query`,
    body: { query },
  });
}

export function queryProperties(database: DatabaseLike) {
  return queueRequest(database, {
    path: `_api/query/properties`,
  });
}

export function querySetProperties(database: DatabaseLike, options?) {
  return queueRequest(database, {
    method: "PUT",
    path: `_api/query/properties`,
    body: options,
  });
}

export function querySlowDrop(database: DatabaseLike) {
  return queueRequest(database, {
    method: "DELETE",
    path: `_api/query/slow`,
  });
}

export function querySlow(database: DatabaseLike) {
  return queueRequest(database, {
    path: `_api/query/slow`,
  });
}

export type QueryCacheSetPropertiesOptions = {
  includeSystem: boolean;
  maxEntrySize: number;
  maxResults: number;
  maxResultsSize: number;
  mode: string;
};
