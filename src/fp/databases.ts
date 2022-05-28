import type { DatabaseLike } from "./types.ts";
import { Database } from "../database.ts";
import { ArangoError, ArangoErrorCode } from "../error.ts";
import { queueRequest } from "../request.ts";

export function databaseCollections(database: DatabaseLike) {
  return queueRequest<{ result: string[] }, string[]>(database, {
    path: `_api/collection/list`,
    transform: (data) => data.result,
  });
}

export function databaseCreate(
  database: DatabaseLike,
  options?: DatabaseCreateOptions & { silent?: boolean },
) {
  return queueRequest<unknown, DatabaseLike>(database, {
    silent: options?.silent,
    method: "POST",
    path: `_api/database/create`,
    body: {
      name: database.name,
      options: options?.options,
      users: options?.users,
    },
    transform: () => {
      return database.connection.database(database.name).get({
        silent: options?.silent,
      });
    },
  });
}

export function databaseDrop(database: DatabaseLike, name: string) {
  if (name !== this.name) {
    throw new Error(`ArangoError: database name is not valid`);
  }

  if (name === "_system") {
    throw new Error(`ArangoError: cannot drop _system database`);
  }

  return queueRequest<{ result: boolean }, boolean>(database, {
    method: "DELETE",
    path: `_api/database/${database.name}`,
    transform: (data) => data.result,
  });
}

export async function databaseExists(database: DatabaseLike): Promise<boolean> {
  try {
    const db = await databaseGet(database);
    return !!db.id;
  } catch (error) {
    if (
      error instanceof ArangoError &&
      error.code === ArangoErrorCode.ERROR_ARANGO_DATABASE_NOT_FOUND
    ) {
      return false;
    }

    throw error;
  }
}

export function databaseGet(
  database: DatabaseLike,
  options?: DatabaseGetOptions,
): Promise<Database> {
  return queueRequest<Partial<Database>, Database>(database, {
    silent: options?.silent,
    path: `_api/database/current`,
    transform: (data) => {
      return new Database({
        connection: database.connection,
        isAbsolute: data.isAbsolute,
        name: data.name,
      });
    },
  });
}

export function databaseList(database: DatabaseLike) {
  return queueRequest<{ result: string[] }, string[]>(database, {
    path: `_api/database/list`,
    transform: (data) => data.result,
  });
}

export function databaseUser(database: DatabaseLike) {
  return queueRequest<{ result: string[] }, string[]>(database, {
    path: `_api/database/user`,
    transform: (data) => data.result,
  });
}

export function databaseVersion(database: DatabaseLike) {
  return queueRequest<{ version: string }, string>(database, {
    path: `_api/database/current/version`,
    transform: (data) => data.version,
  });
}

export type DatabaseGetOptions = {
  silent?: boolean;
};

export type DatabaseCreateOptions = {
  users?: DatabaseUser[];
  isSystem?: boolean;
  options?: {
    sharding?: "" | "flexible" | "single";
    replicationFactor?: number;
    writeConcern?: number;
  };
};

export type DatabaseUser = {
  username: string;
  passwd: string;
  active: boolean;
  extra: unknown;
};
