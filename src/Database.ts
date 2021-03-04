import { ArangoErrorCode, GeneratedAqlQuery } from "./deps.ts";
import { createRequest } from "./request/request.ts";
import { Cursor } from "./Cursor.ts";
import { Collection } from "./Collection.ts";
import { ArangoError } from "./request/Error.ts";
import {
  CollectionType,
  Dict,
  IArangoConfig,
  IArangoQueryOptions,
  IArangoTranscatctionConfig,
  ICollectionCreate,
} from "./types.ts";

export class Database {
  #url = "http://localhost:8529/";
  #headers = new Headers({
    "content-type": "application/json",
  });

  #name = "_system";
  #isAbsolute?: boolean;
  #request;

  constructor(config?: IArangoConfig) {
    if (config?.name) {
      this.#name = config.name;
    }

    if (config?.isAbsolute) {
      this.#isAbsolute = config.isAbsolute;
    }

    if (Array.isArray(config?.url)) {
      if ((config?.url?.length ?? 0) > 1) {
        console.warn(`this lib is for single instance, only first url is used`);
      }
      if (config?.url?.length === 1 && typeof config?.url[0] === "string") {
        this.#url = config?.url[0];
      } else {
        throw new Error(`Arango: invalid configuration: url`);
      }
    } else if (typeof config?.url === "string") {
      this.#url = config?.url;
    }

    if (typeof config?.auth === "string") {
      this.useBearerAuth(config.auth);
    } else {
      this.useBasicAuth(config?.auth?.username, config?.auth?.password);
    }

    this.#request = createRequest(this.#url, this);
  }

  get url() {
    return this.#url;
  }

  get name() {
    return this.#name;
  }

  get isAbsolute() {
    return this.#isAbsolute;
  }

  get headers(): Headers {
    return this.#headers;
  }

  get request() {
    return this.#request;
  }

  useBearerAuth(token: string): void {
    this.headers.set("Authorization", `Bearer ${token}`);
  }

  useBasicAuth(username = "root", password = ""): void {
    const credentials = btoa(`${username}:${password}`);
    this.headers.set("Authorization", `Basic ${credentials}`);
  }

  async query<T = unknown>(
    query: GeneratedAqlQuery,
    opts?: Partial<IArangoQueryOptions>,
  ) {
    const body: Record<string, unknown> = {
      query: query.query,
      bindVars: query.bindVars,
    };

    if (opts?.batchSize) body.batchSize = opts.batchSize;
    if (opts?.cache) body.cache = opts.cache;

    try {
      const data = await this.request({
        method: "post",
        path: `_api/cursor`,
        body,
      });

      return new Cursor<T>(data, this);
    } catch (error) {
      throw error;
    }
  }

  async get() {
    try {
      return await this.request({
        method: "get",
        path: `_api/database/current`,
      });
    } catch (error) {
      throw error;
    }
  }

  async exists(): Promise<boolean> {
    try {
      await this.get();
      return true;
    } catch (error) {
      if (
        error instanceof ArangoError &&
        ArangoErrorCode.ERROR_ARANGO_DATABASE_NOT_FOUND
      ) {
        return false;
      }
      throw error;
    }
  }

  async listDatabases(): Promise<string[]> {
    try {
      return await this.request({
        method: "get",
        path: `_api/database`,
      });
    } catch (error) {
      throw error;
    }
  }

  async listUserDatabases(): Promise<string[]> {
    try {
      return await this.request({
        method: "get",
        path: `_api/database`,
      }).then(({ result }) => result);
    } catch (error) {
      throw error;
    }
  }

  async explain(query: GeneratedAqlQuery): Promise<string[]> {
    try {
      return await this.request({
        method: "post",
        path: `_api/explain`,
        body: {
          query: query.query,
          bindVars: query.bindVars,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async login(username = "root", password = ""): Promise<string> {
    this.useBasicAuth(username, password);
    try {
      const data = await this.request({
        method: "post",
        path: `_open/auth`,
        body: {
          username,
          password,
        },
      });

      return data.jwt;
    } catch (error) {
      throw error;
    }
  }

  collection(name: string) {
    return new Collection({ name }, this);
  }

  createCollection(config: ICollectionCreate & Dict) {
    if (typeof config?.name !== "string") {
      throw new Error(`ArangoError: must provide collection name while create`);
    }
    try {
      const data = this.request({
        method: "post",
        path: `_api/collection`,
        body: {
          ...config,
          name: config.name,
          type: typeof config.type === "string"
            ? CollectionType[config.type]
            : config.type,
        },
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  executeTransaction(config?: IArangoTranscatctionConfig) {
    try {
      const data = this.request({
        method: "post",
        path: `_api/transaction`,
        body: { ...config },
      });

      return data;
    } catch (error) {
      throw error;
    }
  }
}
