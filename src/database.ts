import { Connection, isConnection } from "./connection.ts";
import {
  createDatabaseRequest,
  CreateDatabaseRequestConfig,
} from "./request.ts";
import { initializeQueue, QueueConfig } from "./queue.ts";
import { Collection } from "./collection.ts";
import { Cursor } from "./cursor.ts";
import type { AqlQuery, GeneratedAqlQuery } from "./aql.ts";
import {
  cursorCreate,
  databaseCollections,
  databaseCreate,
  databaseDrop,
  databaseExists,
  databaseGet,
  databaseList,
  databaseUser,
  databaseVersion,
  queryExplain,
  transactionCreate,
} from "./fp/index.ts";

export class Database {
  #connection: Connection;

  get connection() {
    return this.#connection;
  }

  #name: string;
  get name(): string {
    return this.#name;
  }

  #isAbsolute = false;
  get isAbsolute(): boolean {
    return this.#isAbsolute;
  }

  #id: string;
  get id() {
    return this.#id;
  }

  #path: string;
  get path() {
    return this.#path;
  }

  #isSystem: boolean;
  get isSystem() {
    return this.#isSystem;
  }

  #sharding: unknown;
  get sharding() {
    return this.#sharding;
  }

  #replicationFactor: unknown;
  get replicationFactor() {
    return this.#replicationFactor;
  }

  #writeConcern: unknown;
  get writeConcern() {
    return this.#writeConcern;
  }

  get isDatabase(): true {
    return true;
  }

  constructor(config: DatabaseConfig) {
    if (!isConnection(config?.connection)) {
      throw new Error(`ArangoError: connection is not a valid connection`);
    }

    if (!isValidDatabaseName(config.name)) {
      throw new Error(`ArangoError: database name is not valid`);
    }

    this.#name = config.name;

    if (!(config.connection instanceof Connection)) {
      throw new Error(
        `ArangoError: connection is not a valid connection in ${config.name} database`,
      );
    }

    this.#connection = config?.connection;
    if (this.connection.connectedDatabases.has(config.name)) {
      return this.connection.connectedDatabases.get(
        config.name,
      ) as unknown as Database;
    }

    if (config.isAbsolute) {
      this.#isAbsolute = !!config.isAbsolute;
    }

    if (!this.connection.queues.has(this.name)) {
      this.connection.queues.set(
        this.name,
        initializeQueue(config?.queue || {}),
      );
    }

    this.connection.connectedDatabases.set(this.name, this);
  }

  request<T extends unknown = unknown, R = T>(
    config: CreateDatabaseRequestConfig<T, R>,
  ) {
    return this.connection.getQueue(this).add(async () => {
      return await createDatabaseRequest<T, R>(
        this,
        config,
      ) as unknown as ReturnType<typeof config["transform"]>;
    });
  }

  async query<T = unknown>(query: AqlQuery | GeneratedAqlQuery, options?) {
    return await cursorCreate(this, query, options) as Cursor<T>;
  }

  async explain(query: AqlQuery | GeneratedAqlQuery, options?) {
    return await queryExplain(this, query, options);
  }

  version() {
    return databaseVersion(this);
  }

  async get(options?: { silent?: boolean; litter?: boolean }) {
    const database = await databaseGet(this, options);
    if (options?.litter === false) return database;

    this.#id = database.id;
    this.#path = database.path;
    this.#isSystem = database.isSystem;
    this.#sharding = database.sharding;
    this.#replicationFactor = database.replicationFactor;
    this.#writeConcern = database.writeConcern;

    return this;
  }

  exists() {
    return databaseExists(this);
  }

  user() {
    return databaseUser(this);
  }

  list() {
    return databaseList(this);
  }

  create(options) {
    return databaseCreate(this, options);
  }

  drop(name: string) {
    return databaseDrop(this, name);
  }

  collections() {
    return databaseCollections(this);
  }

  collection(name: string) {
    return new Collection({ database: this, name });
  }

  executeTransaction(options) {
    return transactionCreate(this, options);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      path: this.path,
      isSystem: this.isSystem,
      sharding: this.sharding,
      replicationFactor: this.replicationFactor,
      writeConcern: this.writeConcern,
    };
  }
}

export interface DatabaseConfig {
  connection: Connection;
  name: string;
  isAbsolute?: boolean;
  queue?: QueueConfig;
}

export function isValidDatabaseName(name: string) {
  return /^[a-zA-Z0-9_\-]+$/.test(name);
}
