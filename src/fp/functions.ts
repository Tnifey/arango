import type { DatabaseLike } from "./types.ts";
import { queueRequest } from "../request.ts";

export function functionCreate(
  database: DatabaseLike,
  options: CreateFunctionOptions,
) {
  return queueRequest<{ isNewlyCreated: boolean }, boolean>(database, {
    method: "POST",
    path: `_api/aqlfunction`,
    body: options,
    transform: (data) => data.isNewlyCreated,
  });
}

export function functionDrop(
  database: DatabaseLike,
  functionName: string,
  options?,
) {
  return queueRequest<{ deletedCount: number }, number>(database, {
    method: "DELETE",
    path: `_api/aqlfunction/${functionName}`,
    body: options,
    transform: (data) => data.deletedCount,
  });
}

export function functionList(database: DatabaseLike): Promise<string[]> {
  return queueRequest<{ result: string[] }, string[]>(database, {
    path: `_api/function/list`,
    transform: (data) => data.result,
  });
}

export type CreateFunctionOptions = {
  name: string;
  code: string;
  isDeterministic?: boolean;
};
