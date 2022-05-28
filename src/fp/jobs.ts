import type { DatabaseLike } from "./types.ts";
import { queueRequest } from "../request.ts";

export function jobGet(database: DatabaseLike, jobId: string) {
  return queueRequest(database, {
    path: `_api/job/${jobId}`,
  });
}

export function jobResult(database: DatabaseLike, jobId: string) {
  return queueRequest(database, {
    method: "PUT",
    path: `_api/job/${jobId}`,
  });
}

export function jobCancel(database: DatabaseLike, jobId: string) {
  return queueRequest(database, {
    method: "PUT",
    path: `_api/job/${jobId}/cancel`,
  });
}

export function jobsDropByType(database: DatabaseLike, type: string) {
  return queueRequest(database, {
    method: "DELETE",
    path: `_api/job/${type}`,
  });
}

export function jobsGetByType(database: DatabaseLike, type: string) {
  return queueRequest(database, {
    path: `_api/job/${type}`,
  });
}
