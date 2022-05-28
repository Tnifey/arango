import type { DatabaseLike } from "./fp/types.ts";
import { cursorDrop, cursorNextBatch } from "./fp/index.ts";

export class Cursor<T extends unknown = unknown> {
  #database: DatabaseLike;
  get database() {
    return this.#database;
  }

  #host: string;
  get host() {
    return this.#host;
  }

  #id: string;
  get id() {
    return this.#id;
  }

  #results: T[] = [];
  get results() {
    return [...this.#results];
  }

  constructor(config: CursorConfig, results: unknown[] = []) {
    this.#database = config.database;
    this.#host = config.host;
    this.#id = config.id;

    this.#results = results as T[];
  }

  drop(options?) {
    return cursorDrop(this, options);
  }

  nextBatch(options?) {
    return cursorNextBatch(this, options);
  }

  all() {
    return [...this.#results];
  }

  *[Symbol.iterator]() {
    while (true) {
      const results = this.results;
      if (results.length === 0) {
        break;
      }
      yield* results;
    }
  }

  #current = 0;

  next() {
    const results = this.results;
    if (this.#current >= results.length) {
      return { done: true };
    }
    const value = results[this.#current];
    this.#current++;
    return { value, done: false };
  }

  reset() {
    this.#current = 0;
  }

  hasNext() {
    return this.#current < this.results.length;
  }

  each(callback: (value: T, index: number, cursor: Cursor<T>) => void) {
    return this.results.forEach((value, index) => callback(value, index, this));
  }

  every(callback: (value: T, index: number, cursor: Cursor<T>) => boolean) {
    return this.#results.every((value, index) => callback(value, index, this));
  }

  some(callback: (value: T, index: number, cursor: Cursor<T>) => boolean) {
    return this.#results.some((value, index) => callback(value, index, this));
  }

  map(callback: (value: T, index: number, cursor: Cursor<T>) => unknown) {
    return this.#results.map((value, index) => callback(value, index, this));
  }

  reduce(
    callback: (
      accumulator: unknown,
      value: T,
      index: number,
      cursor: Cursor<T>,
    ) => unknown,
  ) {
    return this.#results.reduce(
      (accumulator, value, index) => callback(accumulator, value, index, this),
      undefined,
    );
  }
}

export type CursorConfig = {
  database: DatabaseLike;
  host: string;
  id: string;
  cache?: boolean;
};
