import type { Database } from "./types.ts";

export function indexList(database: Database, collectionName: string) {
  return database.request({
    path: `_api/index?collection=${collectionName}`,
  });
}

export function indexCreate(
  database: Database,
  collectionName: string,
  options,
) {
  return database.request({
    method: "POST",
    path: `_api/index?collection=${collectionName}`,
    body: options,
  });
}

export function indexDrop(
  database: Database,
  collectionName: string,
  indexId: string,
) {
  return database.request({
    method: "DELETE",
    path: `_api/index/${collectionName}/${indexId}`,
  });
}

export function indexGet(
  database: Database,
  collectionName: string,
  indexId: string,
) {
  return database.request({
    path: `_api/index/${collectionName}/${indexId}`,
  });
}
