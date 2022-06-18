import type { DatabaseLike } from "./types.ts";
import { queueRequest } from "../request.ts";

export function viewsList(database: DatabaseLike) {
  return queueRequest(database, {
    path: `_api/views`,
  });
}

export function viewsCreate(database: DatabaseLike, options) {
  return queueRequest(database, {
    method: "POST",
    path: `_api/views`,
    body: options,
  });
}

export function viewsDrop(database: DatabaseLike, viewName: string) {
  return queueRequest(database, {
    method: "DELETE",
    path: `_api/views/${viewName}`,
  });
}

export function viewsGet(database: DatabaseLike, viewName: string) {
  return queueRequest(database, {
    path: `_api/views/${viewName}`,
  });
}

export function viewsProperies(database: DatabaseLike, viewName: string) {
  return queueRequest(database, {
    path: `_api/views/${viewName}/properties`,
  });
}

export function viewsSetProperties(
  database: DatabaseLike,
  viewName: string,
  options: Record<string, unknown>,
) {
  return queueRequest(database, {
    method: "PUT",
    path: `_api/views/${viewName}/properties`,
    body: options,
  });
}

export function viewsChangeProperties(
  database: DatabaseLike,
  viewName: string,
  options: Record<string, unknown>,
) {
  return queueRequest(database, {
    method: "PATCH",
    path: `_api/views/${viewName}/properties`,
    body: options,
  });
}

export function viewsRename(
  database: DatabaseLike,
  viewName: string,
  newName: string,
) {
  return queueRequest(database, {
    method: "PUT",
    path: `_api/views/${viewName}/rename`,
    body: { name: newName },
  });
}
