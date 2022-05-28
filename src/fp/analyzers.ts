import type { Database } from "./types.ts";

export function analyzerCreate(
  database: Database,
  options: AnalyzerCreateOptions,
) {
  return database.request({
    method: "POST",
    path: `_api/analyzer`,
    body: options,
  });
}

export function analyzerDrop(database: Database, analyzerName: string) {
  return database.request({
    method: "DELETE",
    path: `_api/analyzer/${analyzerName}`,
  });
}

export function analyzerGet(database: Database, analyzerName: string) {
  return database.request({
    path: `_api/analyzer/${analyzerName}`,
  });
}

export function analyzerList(database: Database) {
  return database.request({
    path: `_api/analyzer`,
  });
}

export type AnalyzerCreateOptions = {
  name: string;
  type: string;
  properties?: Record<string, unknown>;
  features?: string[] | string;
};
