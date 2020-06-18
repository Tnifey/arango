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

  constructor(init?: PoolConfig) {
    const config: PoolConfig = init || {};

    if (Array.isArray(config?.url)) {
      for (let url of config.url) {
        this.#hosts.push(new Host(this, url));
      }
    }

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

  addHeaders(value: Headers | Record<string, string>) {
    this.#headers = concatHeaders(this.#headers, value);
  }

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

  useBasicAuth(username: string = "root", password: string = "") {
    const token = btoa(`${username}:${password}`);
    this.headers.set("authorization", `Basic ${token};`);
  }

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
