import { PQueue } from "./deps.ts";

export function initializeQueue(config: QueueConfig): PQueue {
  return new PQueue({
    concurrency: config?.concurrency ?? Infinity,
    interval: config?.interval ?? 0,
    intervalCap: config?.intervalCap ?? Infinity,
    timeout: config?.timeout ?? Infinity,
    throwOnTimeout: true,
  });
}

export type QueueConfig = {
  /**
   * Concurrency limit.
   * If set to 1, the queue will be executed synchronously.
   * - default: Infinity
   * - minimum: 1
   */
  concurrency?: number;

  /**
   * Per-operation timeout in milliseconds.
   * Operations fulfill once timeout elapses if they haven't already.
   */
  timeout?: number;

  /**
   * The length of time in milliseconds before the interval count resets.
   * Must be finite.
   * - default: 0
   * - minimum: 0
   */
  interval?: number;

  /**
   * The max number of runs in the given interval of time.
   * - default: Infinity
   * - minimum: 1
   */
  intervalCap?: number;
};
