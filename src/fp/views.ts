import type { Database } from "./types.ts";

export function viewsList(database: Database) {
  return database.request({
    path: `_api/views`,
  });
}

export function viewsCreate(database: Database, options) {
  return database.request({
    method: "POST",
    path: `_api/views`,
    body: options,
  });
}

export function viewsDrop(database: Database, viewName: string) {
  return database.request({
    method: "DELETE",
    path: `_api/views/${viewName}`,
  });
}

export function viewsGet(database: Database, viewName: string) {
  return database.request({
    path: `_api/views/${viewName}`,
  });
}

export function viewsProperies(database: Database, viewName: string) {
  return database.request({
    path: `_api/views/${viewName}/properties`,
  });
}

export function viewsSetProperties(
  database: Database,
  viewName: string,
  options: Record<string, unknown>,
) {
  return database.request({
    method: "PUT",
    path: `_api/views/${viewName}/properties`,
    body: options,
  });
}

export function viewsChangeProperties(
  database: Database,
  viewName: string,
  options: Record<string, unknown>,
) {
  return database.request({
    method: "PATCH",
    path: `_api/views/${viewName}/properties`,
    body: options,
  });
}

export function viewsRename(
  database: Database,
  viewName: string,
  newName: string,
) {
  return database.request({
    method: "PUT",
    path: `_api/views/${viewName}/rename`,
    body: { name: newName },
  });
}
