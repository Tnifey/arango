import type { Database } from "./types.ts";

export function functionCreate(
  database: Database,
  options: CreateFunctionOptions,
) {
  return database.request<{ isNewlyCreated: boolean }, boolean>({
    method: "POST",
    path: `_api/aqlfunction`,
    body: options,
    transform: (data) => data.isNewlyCreated,
  });
}

export function functionDrop(
  database: Database,
  functionName: string,
  options?,
) {
  return database.request<{ deletedCount: number }, number>({
    method: "DELETE",
    path: `_api/aqlfunction/${functionName}`,
    body: options,
    transform: (data) => data.deletedCount,
  });
}

export function functionList(database: Database): Promise<string[]> {
  return database.request<{ result: string[] }, string[]>({
    path: `_api/function/list`,
    transform: (data) => data.result,
  });
}

export type CreateFunctionOptions = {
  name: string;
  code: string;
  isDeterministic?: boolean;
};
