import { ArangoError } from "./error.ts";
import { Connection } from "./connection.ts";
import type { DatabaseLike } from "./fp/types.ts";

export function createFetch(endpoint, payload) {
  return fetch(endpoint, payload).then(async (response) => {
    if (!response.ok) throw response;
    const data = await response.clone().json();
    if (data.error) throw response;
    return response;
  }).catch(async (error) => {
    if (error instanceof Response) {
      const data = await error.clone().json();

      const err = new ArangoError(data.errorMessage, {
        code: data.errorNum,
        response: error,
      });

      throw err;
    }
    throw error;
  });
}

export function createDatabaseRequest<T, R>(
  database: DatabaseLike,
  config: CreateDatabaseRequestConfig<T, R>,
) {
  const { path, isAbsolute, silent = false, ...rest } = config;
  try {
    const url = database.isAbsolute || isAbsolute
      ? new URL(path, "http://0.0.0.0:8529/")
      : new URL(path, `http://0.0.0.0:8529/_db/${database.name}/`);

    return database.connection.request<T, R>({
      ...rest,
      path: url.href.replace(url.origin, ""),
    });
  } catch (error) {
    if (silent) return error;
    throw error;
  }
}

export function queueRequest<T, R>(
  database: DatabaseLike,
  config: CreateDatabaseRequestConfig<T, R>,
) {
  if (!database || typeof database?.name !== "string" || !database.name) {
    throw new Error(`ArangoError: database is not a valid database`);
  }

  if (!database?.connection || !(database.connection instanceof Connection)) {
    throw new Error(`ArangoError: connection is not a valid connection`);
  }

  return database.connection.getQueue(database).add(async () => {
    return await createDatabaseRequest<T, R>(database, config);
  });
}

export type CreateDatabaseRequestConfig<T, R> = RequestConfig<R, T> & {
  isAbsolute?: boolean;
  silent?: boolean;
};

export type RequestConfig<R, T> = {
  transform?: (result: T, response: Response, host: string) => Promise<R> | R;
  path: string;
  method?: string;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  host?: string;
};
