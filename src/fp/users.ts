import type { DatabaseLike } from "./types.ts";
import { queueRequest } from "../request.ts";

export function usersList(database: DatabaseLike) {
  return queueRequest(database, {
    path: `_api/user`,
  });
}

export function userCreate(database: DatabaseLike, options) {
  return queueRequest(database, {
    method: "POST",
    path: `_api/user`,
    body: options,
  });
}

export function userDrop(database: DatabaseLike, username: string) {
  return queueRequest(database, {
    method: "DELETE",
    path: `_api/user/${username}`,
  });
}

export function userGet(database: DatabaseLike, username: string) {
  return queueRequest(database, {
    path: `_api/user/${username}`,
  });
}

export function userChange(
  database: DatabaseLike,
  username: string,
  options: Record<string, unknown>,
) {
  return queueRequest(database, {
    method: "PATCH",
    path: `_api/user/${username}`,
    body: options,
  });
}

export function userReplace(
  database: DatabaseLike,
  username: string,
  options: Record<string, unknown>,
) {
  return queueRequest(database, {
    method: "PUT",
    path: `_api/user/${username}`,
    body: options,
  });
}

export function userDatabases(database: DatabaseLike, username: string) {
  return queueRequest(database, {
    path: `_api/user/${username}/database`,
  });
}

export function userDatabaseAccessDrop(
  database: DatabaseLike,
  username: string,
  databaseName: string,
) {
  return queueRequest(database, {
    method: "DELETE",
    path: `_api/user/${username}/database/${databaseName}`,
  });
}

export function userDatabaseAccess(
  database: DatabaseLike,
  username: string,
  databaseName: string,
) {
  return queueRequest(database, {
    path: `_api/user/${username}/database/${databaseName}`,
  });
}

export function userDatabaseAccessSet(
  database: DatabaseLike,
  username: string,
  databaseName: string,
  options: Record<string, unknown>,
) {
  return queueRequest(database, {
    method: "PUT",
    path: `_api/user/${username}/database/${databaseName}`,
    body: options,
  });
}

export function userCollectionAccess(
  database: DatabaseLike,
  username: string,
  databaseName: string,
  collectionName: string,
) {
  return queueRequest(database, {
    path:
      `_api/user/${username}/database/${databaseName}/collection/${collectionName}`,
  });
}

export function userCollectionAccessSet(
  database: DatabaseLike,
  username: string,
  databaseName: string,
  collectionName: string,
  options: Record<string, unknown>,
) {
  return queueRequest(database, {
    method: "PUT",
    path:
      `_api/user/${username}/database/${databaseName}/collection/${collectionName}`,
    body: options,
  });
}
