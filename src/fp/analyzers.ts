import type { DatabaseLike } from "./types.ts";
import { queueRequest } from "../request.ts";

export function analyzerCreate(
  database: DatabaseLike,
  options: AnalyzerCreateOptions,
) {
  return queueRequest(database, {
    method: "POST",
    path: `_api/analyzer`,
    body: options,
  });
}

export function analyzerDrop(database: DatabaseLike, analyzerName: string) {
  return queueRequest(database, {
    method: "DELETE",
    path: `_api/analyzer/${analyzerName}`,
  });
}

export function analyzerGet(database: DatabaseLike, analyzerName: string) {
  return queueRequest(database, {
    path: `_api/analyzer/${analyzerName}`,
  });
}

export function analyzerList(database: DatabaseLike) {
  return queueRequest(database, {
    path: `_api/analyzer`,
  });
}

export type AnalyzerCreateOptions = {
  name: string;
  type: string;
  properties?: Record<string, unknown>;
  features?: string[] | string;
};
