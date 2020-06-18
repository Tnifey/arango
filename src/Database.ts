import { posix } from "https://deno.land/std/node/path.ts";
import { Pool } from "../mod.ts";
import { Cursor } from "./Cursor.ts";
import { AqlValue } from "./aql.ts";

export class Database {
  #pool: Pool;
  #name: string = "_system";
  #isAbsolute: boolean = false;

  constructor(pool: Pool, init: DatabaseConfig) {
    this.#pool = pool;
    this.#name = init?.name ?? "_system";
    this.#isAbsolute = Boolean(init?.isAbsolute ?? false);
  }

  get pool() {
    return this.#pool;
  }

  get name() {
    return this.#name;
  }

  get url() {
    return `_db/${this.#name}/`;
  }

  private _url(...suffix: string[]) {
    if (this.#isAbsolute === true) {
      return posix.join(...suffix);
    }
    return posix.join(`_db`, this.#name, ...suffix);
  }

  public _open(...suffix: string[]) {
    return this._url("_open", ...suffix);
  }

  public _api(...suffix: string[]) {
    return this._url("_api", ...suffix);
  }

  get isAbsolute() {
    return this.#isAbsolute;
  }

  async login(
    username: string = "root",
    password: string = "",
  ): Promise<string> {
    const payload = {
      method: "post",
      url: this._open(`auth`),
      body: {
        username,
        password,
      },
    };

    const getter = ({ data }: any) => data?.jwt;
    return this.pool.host.request(payload, getter);
  }

  async query(
    query: { query: string; bindVars: Record<string, AqlValue> },
    options?: any,
  ): Promise<any>;
  async query(
    query: string,
    bindVars: Record<string, AqlValue>,
    options?: any,
  ): Promise<any>;
  async query(...args: any[]): Promise<any> {
    let query, bindVars, options;

    if (typeof args[0]?.query === "string") {
      query = args[0]?.query;
      bindVars = args[0]?.bindVars ?? {};
      options = args[1] ?? {};
    } else {
      query = args[0];
      bindVars = args[1] ?? {};
      options = args[2] ?? {};
    }

    const payload = {
      method: "post",
      url: this._api(`cursor`),
      body: {
        ...options,
        query,
        bindVars,
      },
    };

    const getter = ({ data, host }: any) => new Cursor(this, { host, ...data });
    return this.pool.host.request(payload, getter);
  }
}

export interface DatabaseConfig {
  name: string;
  isAbsolute?: boolean;
}
