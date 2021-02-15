import { IArangoCredentials, IPoolConfig } from "./types.ts";
import { Database } from "./Database.ts";

export class Pool {
  #url: string[] = ["http://localhost:8529"];
  #auth?: IArangoCredentials;

  constructor(config?: IPoolConfig) {
    if (config?.url) {
      if (Array.isArray(config.url)) {
        this.#url = config?.url;
      } else {
        this.#url = [config?.url];
      }
    }

    this.#auth = config?.auth;
  }

  get url() {
    return this.#url;
  }

  database(name: string, isAbsolute?: boolean) {
    return new Database({
      url: this.#url,
      auth: this.#auth,
      name,
      isAbsolute,
    });
  }
}
