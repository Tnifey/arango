import { concatHeaders } from "./utils.ts";
import { Host } from "./Host.ts";
import { Database } from "./Database.ts";
import { PoolConfig } from "./types.ts";

/**
 * Create connection pool
 */
export class Pool {
  #hosts: Host[] = [];
  #headers: Headers = new Headers();
  #loadBalancingStrategy: string = "NONE";

  constructor(init?: string | string[] | PoolConfig) {
    if (typeof init === "string" || Array.isArray(init)) {
      this.setHosts(init);
      init = {};
    } else {
      this.setHosts(init?.url ?? "http://localhost:8529");
    }

    const config: PoolConfig = init || {};

    if (typeof config?.auth === "string") {
      this.useBearerAuth(config.auth);
    }

    if (typeof (config?.auth as any)?.username === "string") {
      this.useBasicAuth(
        (config.auth as any).username ?? "root",
        (config.auth as any).password ?? "",
      );
    }

    if (config?.headers) {
      this.#headers = new Headers(config.headers);
    }
  }

  get headers() {
    return this.#headers;
  }

  addHeaders(value: Headers | Record<string, string>): void {
    this.#headers = concatHeaders(this.#headers, value);
  }

  /**
   * Get host based on loadBalancingStrategy
   */
  get host() {
    const strategy = this.#loadBalancingStrategy ?? "NONE";
    const hosts = [...this.#hosts];

    switch (strategy) {
      case "ONE_RANDOM":
        return hosts[Math.floor(Math.random() * hosts.length)];
      case "NONE":
      default:
        return hosts[0];
    }
  }

  setHosts(hosts: string | string[]): void {
    const urls = parseHosts(hosts);
    const current: Host[] = [];
    if (Array.isArray(urls)) {
      for (let url of urls) {
        current.push(new Host(this, url));
      }
    }

    this.#hosts = current;
  }

  addHosts(hosts: string | string[]): void {
    const urls = parseHosts(hosts);
    if (Array.isArray(urls)) {
      for (let url of urls) {
        this.#hosts.push(new Host(this, url));
      }
    }
  }

  /**
   * Set authorization header to use basic auth
   * @param username
   * @param password
   */
  useBasicAuth(username: string = "root", password: string = "") {
    const token = btoa(`${username}:${password}`);
    this.headers.set("authorization", `Basic ${token};`);
  }

  /**
   * Set authorization header to use bearer auth
   * @param token
   */
  useBearerAuth(token: string) {
    this.headers.set("authorization", `Bearer ${token}`);
  }

  /**
   * Create new database instance
   * @param name
   * @param isAbsolute
   */
  database(name: string, isAbsolute: boolean = false) {
    return new Database(this, { name, isAbsolute });
  }
}

function parseHosts(hosts: string | string[]) {
  const urls: string[] = typeof hosts === "string"
    ? [hosts]
    : Array.isArray(hosts) && hosts.some((host) => typeof host !== "string")
    ? []
    : hosts;

  if (urls?.length === 0) {
    throw new TypeError("urls has to be string or array of strings");
  }

  return urls;
}
