import { Database } from "../Database.ts";
import { ArangoError } from "./Error.ts";
import { buildUrl, joinHeaders } from "./utils.ts";
import { IRequest } from "../types.ts";

export function createRequest(host: string, database: Database) {
  return async function (init: IRequest) {
    const path = init?.isAbsolute || database?.isAbsolute
      ? [init?.path]
      : [`_db/${database.name}`, init?.path];
    const url = buildUrl(host, path, init?.query);
    const headers = joinHeaders(database.headers, init?.headers);
    const method = String(init?.method || "GET").toUpperCase();
    const payload: RequestInit = { headers, mode: "cors", method };

    if (init?.body && !["GET", "HEAD"].includes(method)) {
      payload.body = JSON.stringify(init?.body);
    }

    try {
      const response = await fetch(url, payload);
      const data = await response.json();

      if (data?.error) throw [data, response];

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }

      if (Array.isArray(error)) {
        const [data, response] = error;

        const err = new ArangoError(data.errorMessage);
        err.errorNum = data.errorNum;
        err.code = data.code;

        throw err;
      }

      throw error;
    }
  };
}
