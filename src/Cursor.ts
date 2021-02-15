import type { Database } from "./Database.ts";
import type { ICursorExtra, ICursorInit } from "./types.ts";

export class Cursor<T extends unknown = unknown> {
  #database: Database;
  #count?: number;
  #id?: string;
  #result: T[] = [];
  #extra?: ICursorExtra;
  #cached = false;
  #hasMore = false;

  constructor(init: ICursorInit<T>, database: Database) {
    this.#database = database;

    if (init?.id) {
      this.#id = init?.id;
    }

    if (Array.isArray(init?.result)) {
      this.#result = init?.result;
    }

    if (init?.extra) {
      this.#extra = init?.extra;
    }

    if (init?.cached) {
      this.#cached = !!init?.cached;
    }

    if (init?.hasMore) {
      this.#hasMore = !!init?.hasMore;
    }
  }

  get id() {
    return this.#id;
  }

  get count() {
    return this.#count;
  }

  get cached() {
    return this.#cached;
  }

  get hasMore() {
    return this.#hasMore;
  }

  get extra() {
    return this.#extra;
  }

  get stats() {
    return this.#extra?.stats;
  }

  async all() {
    return await [...this.#result];
  }

  async *next() {
    for await (const value of this.#result) {
      yield value;
    }
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<
    unknown,
    undefined,
    undefined
  > {
    for (const result of this.#result) {
      yield result;
    }
    return undefined;
  }

  async more() {
    return await this.nextBatch();
  }

  async nextBatch(): Promise<Cursor | undefined> {
    if (!this.hasMore || !this.#id) return;
    try {
      const data = await this.#database?.request({
        method: "put",
        path: `_api/cursor/${this.id}`,
      });

      return new Cursor<T>(data, this.#database);
    } catch (error) {
      return undefined;
    }
  }

  async kill(): Promise<unknown> {
    if (!this.hasMore || !this.#id) return;
    try {
      const data = await this.#database?.request({
        method: "delete",
        path: `_api/cursor/${this.id}`,
      });
      this.#hasMore = false;
      this.#id = undefined;

      return data;
    } catch (error) {
      throw error;
    }
  }
}
