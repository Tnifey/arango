import { Database } from "../database.ts";
import { ArangoError, ArangoErrorCode } from "../error.ts";

export function databaseCollections(database: Database) {
  return database.request<{ result: string[] }, string[]>({
    path: `_api/collection/list`,
    transform: (data) => data.result,
  });
}

export function databaseCreate(
  database: Database,
  options?: DatabaseCreateOptions & { silent?: boolean },
) {
  return database.request<unknown, Database>({
    silent: options?.silent,
    method: "POST",
    path: `_api/database/create`,
    body: {
      name: database.name,
      options: options?.options,
      users: options?.users,
    },
    transform: () => {
      return database.get({
        silent: options?.silent,
      });
    },
  });
}

export function databaseDrop(database: Database, name: string) {
  if (name !== this.name) {
    throw new Error(`ArangoError: database name is not valid`);
  }

  if (name === "_system") {
    throw new Error(`ArangoError: cannot drop _system database`);
  }

  return database.request<{ result: boolean }, boolean>({
    method: "DELETE",
    path: `_api/database/${database.name}`,
    transform: (data) => data.result,
  });
}

export async function databaseExists(database: Database): Promise<boolean> {
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
  database: Database,
  options?: DatabaseGetOptions,
): Promise<Database> {
  return database.request<Partial<Database>, Database>({
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

export function databaseList(database: Database) {
  return database.request<{ result: string[] }, string[]>({
    path: `_api/database/list`,
    transform: (data) => data.result,
  });
}

export function databaseUser(database: Database) {
  return database.request<{ result: string[] }, string[]>({
    path: `_api/database/user`,
    transform: (data) => data.result,
  });
}

export function databaseVersion(database: Database) {
  return database.request<{ version: string }, string>({
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
