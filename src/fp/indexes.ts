import type { DatabaseLike } from "./types.ts";
import { queueRequest } from "../request.ts";

export function indexList(database: DatabaseLike, collectionName: string) {
  return queueRequest(database, {
    path: `_api/index?collection=${collectionName}`,
  });
}

export function indexCreate(
  database: DatabaseLike,
  collectionName: string,
  options,
) {
  return queueRequest(database, {
    method: "POST",
    path: `_api/index?collection=${collectionName}`,
    body: options,
  });
}

export function indexDrop(
  database: DatabaseLike,
  collectionName: string,
  indexId: string,
) {
  return queueRequest(database, {
    method: "DELETE",
    path: `_api/index/${collectionName}/${indexId}`,
  });
}

export function indexGet(
  database: DatabaseLike,
  collectionName: string,
  indexId: string,
) {
  return queueRequest(database, {
    path: `_api/index/${collectionName}/${indexId}`,
  });
}
