import type { Database } from "./types.ts";

export function jobGet(database: Database, jobId: string) {
  return database.request({
    path: `_api/job/${jobId}`,
  });
}

export function jobResult(database: Database, jobId: string) {
  return database.request({
    method: "PUT",
    path: `_api/job/${jobId}`,
  });
}

export function jobCancel(database: Database, jobId: string) {
  return database.request({
    method: "PUT",
    path: `_api/job/${jobId}/cancel`,
  });
}

export function jobsDropByType(database: Database, type: string) {
  return database.request({
    method: "DELETE",
    path: `_api/job/${type}`,
  });
}

export function jobsGetByType(database: Database, type: string) {
  return database.request({
    path: `_api/job/${type}`,
  });
}
