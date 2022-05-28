import type { Database } from "./types.ts";
import type { AqlQuery, GeneratedAqlQuery } from "../aql.ts";

export function queryCacheDrop(database: Database) {
  return database.request({
    method: "DELETE",
    path: `_api/query-cache`,
  });
}

export function queryCacheEntries(database: Database) {
  return database.request({
    path: `_api/query-cache`,
  });
}

export function queryCacheProperties(database: Database) {
  return database.request({
    path: `_api/query-cache/properties`,
  });
}

export function queryCacheSetProperties(
  database: Database,
  options: QueryCacheSetPropertiesOptions,
) {
  return database.request({
    method: "PUT",
    path: `_api/query-cache/properties`,
    body: options,
  });
}

export function queryCurrent(database: Database) {
  return database.request({
    path: `_api/query/current`,
  });
}

export function queryDrop(database: Database, queryId: string) {
  return database.request({
    method: "DELETE",
    path: `_api/query/${queryId}`,
  });
}

export function queryExplain(
  database: Database,
  query: AqlQuery | GeneratedAqlQuery,
  options?,
) {
  return database.request({
    method: "POST",
    path: `_api/query/explain`,
    body: {
      query: query.query,
      bindVars: query.bindVars,
      options: options,
    },
  });
}

export function queryParse(database: Database, query: string) {
  return database.request({
    method: "POST",
    path: `_api/query`,
    body: { query },
  });
}

export function queryProperties(database: Database) {
  return database.request({
    path: `_api/query/properties`,
  });
}

export function querySetProperties(database: Database, options?) {
  return database.request({
    method: "PUT",
    path: `_api/query/properties`,
    body: options,
  });
}

export function querySlowDrop(database: Database) {
  return database.request({
    method: "DELETE",
    path: `_api/query/slow`,
  });
}

export function querySlow(database: Database) {
  return database.request({
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
