import { Database } from "./Database.ts";
import { Host } from "./Host.ts";
import { CursorExtra } from "./types.ts";

export class Cursor {
  #database: Database;

  #extra?: CursorExtra = {};
  #id?: string;
  #hasMore: boolean = false;
  #cached: boolean = false;
  #result: any = [];
  #count?: number;
  #host?: Host;

  constructor(database: Database, init: any) {
    this.#database = database;

    const { id, hasMore, cached, extra, result = [], count } = init;

    this.#id = id;
    this.#hasMore = hasMore;
    this.#cached = cached;
    this.#extra = extra;
    this.#result = result;
    this.#count = count;

    this.#host = init?.host;
  }

  get id() {
    return this.#id;
  }

  get hasMore() {
    return this.#hasMore;
  }

  get cached() {
    return this.#cached;
  }

  get count() {
    return this.#count;
  }

  get extra() {
    return {
      stats: { ...(this.#extra?.stats ?? {}) },
      warnings: [...(this.#extra?.warnings ?? [])],
    };
  }

  async more(): Promise<Cursor | undefined> {
    if (!this.hasMore || !this.#id) return;
    const payload = {
      method: "put",
      url: this.#database._api("cursor", this.#id),
    };

    const getter = ({ data, host }: any) =>
      new Cursor(this.#database, { host, ...data });

    return this.#host?.request(payload, getter);
  }

  async all() {
    return [...this.#result];
  }

  async *next() {
    for await (let value of this.#result) {
      yield value;
    }
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<
    unknown,
    undefined,
    undefined
  > {
    for (let result of this.#result) {
      yield result;
    }
    return undefined;
  }

  async kill(): Promise<void> {
    if (!this.hasMore || !this.#id) return;
    const payload = {
      method: "delete",
      url: this.#database._api(`cursor`, this.#id),
    };
    const getter = () => void (this.#hasMore = false);

    return await this.#host?.request(payload, getter);
  }
}
