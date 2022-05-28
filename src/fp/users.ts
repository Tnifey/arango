import type { Database } from "./types.ts";

export function usersList(database: Database) {
  return database.request({
    path: `_api/user`,
  });
}

export function userCreate(database: Database, options) {
  return database.request({
    method: "POST",
    path: `_api/user`,
    body: options,
  });
}

export function userDrop(database: Database, username: string) {
  return database.request({
    method: "DELETE",
    path: `_api/user/${username}`,
  });
}

export function userGet(database: Database, username: string) {
  return database.request({
    path: `_api/user/${username}`,
  });
}

export function userChange(
  database: Database,
  username: string,
  options: Record<string, unknown>,
) {
  return database.request({
    method: "PATCH",
    path: `_api/user/${username}`,
    body: options,
  });
}

export function userReplace(
  database: Database,
  username: string,
  options: Record<string, unknown>,
) {
  return database.request({
    method: "PUT",
    path: `_api/user/${username}`,
    body: options,
  });
}

export function userDatabases(database: Database, username: string) {
  return database.request({
    path: `_api/user/${username}/database`,
  });
}

export function userDatabaseAccessDrop(
  database: Database,
  username: string,
  databaseName: string,
) {
  return database.request({
    method: "DELETE",
    path: `_api/user/${username}/database/${databaseName}`,
  });
}

export function userDatabaseAccess(
  database: Database,
  username: string,
  databaseName: string,
) {
  return database.request({
    path: `_api/user/${username}/database/${databaseName}`,
  });
}

export function userDatabaseAccessSet(
  database: Database,
  username: string,
  databaseName: string,
  options: Record<string, unknown>,
) {
  return database.request({
    method: "PUT",
    path: `_api/user/${username}/database/${databaseName}`,
    body: options,
  });
}

export function userCollectionAccess(
  database: Database,
  username: string,
  databaseName: string,
  collectionName: string,
) {
  return database.request({
    path:
      `_api/user/${username}/database/${databaseName}/collection/${collectionName}`,
  });
}

export function userCollectionAccessSet(
  database: Database,
  username: string,
  databaseName: string,
  collectionName: string,
  options: Record<string, unknown>,
) {
  return database.request({
    method: "PUT",
    path:
      `_api/user/${username}/database/${databaseName}/collection/${collectionName}`,
    body: options,
  });
}
