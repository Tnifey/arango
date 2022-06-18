import { createFetch, RequestConfig } from "./request.ts";
import { Database } from "./database.ts";
import { initializeQueue } from "./queue.ts";

export enum ConnectionStrategy {
  "random" = "random",
  "round-robin" = "round-robin",
}

export class Connection {
  #url: Set<string> = new Set(["http://localhost:8529"]);
  get url() {
    return [...this.#url];
  }

  #headers: Headers = new Headers({
    "content-type": "application/json",
  });
  get headers() {
    return this.#headers;
  }

  get isConnection(): true {
    return true;
  }

  #queues: Map<string, ReturnType<typeof initializeQueue>> = new Map();
  get queues() {
    return this.#queues;
  }

  #connectedDatabases: Map<string, Database> = new Map();
  get connectedDatabases() {
    return this.#connectedDatabases;
  }

  #strategy: ConnectionStrategy = ConnectionStrategy.random;
  get strategy() {
    return this.#strategy;
  }
  
  // current strategy host for round-robin
  #strategyHost = -1;

  constructor(config?: ConnectionConfig) {
    if (config?.url) {
      const hosts = Array.isArray(config?.url) ? config.url : [config?.url];
      this.#url = new Set(hosts);
    }

    if (config?.auth) {
      this._auth(config.auth);
    }

    this.#strategy = ConnectionStrategy[config?.strategy ?? "random"] || ConnectionStrategy.random;
  }

  private _auth(auth?: BasicAuthCredentials | BearerAuthCredentials): void {
    /**
     * Defaults to basic auth with username 'root' and password ''
     */
    if (!auth) return this.useBasicAuth();

    if ("username" in auth) {
      this.useBasicAuth(auth.username, auth.password);
      return;
    }

    if ("token" in auth && typeof auth?.token === "string") {
      this.useBearerAuth(auth.token);
    }

    throw new Error("Invalid auth credentials");
  }

  useUrl(url: string) {
    if (typeof url === "string" && /^https?\:\/\//i.test(url)) {
      this.#url.add(url);
      return this.url;
    }

    throw new Error("Invalid url");
  }

  removeUrl(url: string) {
    return this.#url.delete(url);
  }

  useBasicAuth(username = "root", password = "") {
    this.#headers.set(
      "Authorization",
      `Basic ${btoa(`${username}:${password}`)}`,
    );
  }

  useBearerAuth(token: string) {
    this.#headers.set("Authorization", `Bearer ${token}`);
  }

  useArangoVersion(version: number) {
    this.#headers.set("X-Arango-Version", `${version}`);
  }

  useHeaders(headers: Headers | Record<string, string>) {
    if (headers instanceof Headers) {
      for (const [key, value] of headers.entries()) {
        this.#headers.set(key, value);
      }
      return;
    }

    for (const [key, value] of Object.entries(headers)) {
      this.#headers.set(key, value);
    }
  }

  getQueue(database: string | Database | { name: string }) {
    const name = typeof database === "string" ? database : database?.name;

    if (!name || typeof name !== "string") {
      throw new Error("Database name is required");
    }

    if (!this.#queues.has(name)) {
      this.#queues.set(name, initializeQueue({}));
    }

    return this.#queues.get(name);
  }

  private getNextHost() {
    if(this.#strategy === ConnectionStrategy['round-robin']) {
      this.#strategyHost = (this.#strategyHost + 1) % this.#url.size;
      return [...this.url][this.#strategyHost];
    }
    return this.url[Math.floor(Math.random() * this.url.length)];
  }

  async request<T extends unknown = unknown, R = T>(
    config: RequestConfig<R, T>,
  ) {
    const {
      path,
      method = "GET",
      headers,
      body = undefined,
      transform = (data) => data,
    } = config;

    const host = config?.host || this.getNextHost();
    const endpoint = new URL(path, host).href;

    const payload: Partial<RequestInit> = {
      method: method.toUpperCase(),
      headers: this.#headers,
      cache: "no-cache",
      redirect: "error",
    };

    if (headers) {
      payload.headers = new Headers({
        ...this.#headers,
        ...(headers || {}),
      });
    }

    if ("body" in config) {
      payload.body = JSON.stringify(body);
    }

    try {
      const response = await createFetch(endpoint, payload);
      const data = await response.json();
      return await transform(data, response, host);
    } catch (error) {
      throw error;
    }
  }

  database(name: string) {
    return new Database({ 
      connection: this,
      name,
    });
  }

  toJSON() {
    return {
      url: this.url,
    };
  }
}

export function createConnection(config?: ConnectionConfig) {
  return new Connection(config);
}

/**
 * Checks if the given object is an instance of Connection
 */
export function isConnection(
  connection: unknown,
): connection is Connection {
  return connection instanceof Connection && !!connection.isConnection;
}

export type BasicAuthCredentials = {
  username: string;
  password?: string | undefined;
};

export type BearerAuthCredentials = {
  token: string;
};

export interface ConnectionConfig {
  url?: string[];
  auth?: BasicAuthCredentials | BearerAuthCredentials;
  arangoVersion?: number;
  headers?: Headers | Record<string, string>;
  debug?: boolean;
  /**
   * The strategy to use when selecting a host.
   * @default "random"
   * @see https://www.arangodb.com/docs/stable/aql/aql-query-language-reference.html#connection-strategy
   */
  strategy?: "round-robin" | "random";
}
