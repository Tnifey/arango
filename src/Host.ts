import ky from "https://deno.land/x/ky/index.js";
import { Pool } from "./Pool.ts";
import { ArangoError } from "./Error.ts";
import { concatHeaders } from "./utils.ts";
import { HostRequest, HostGetter } from "./types.ts";

export class Host {
  #url: string;
  #pool: Pool;
  #request: any;

  constructor(pool: Pool, url: string) {
    this.#url = url;
    this.#pool = pool;

    this.#request = ky.create({
      prefixUrl: this.#url,
      throwHttpErrors: false,
    });
  }

  get pool() {
    return this.#pool;
  }

  get url() {
    return this.#url;
  }

  async request<T = any>(init: HostRequest, getter?: HostGetter<T>) {
    const { url, body, headers: customHeaders, ...opts } = init;

    const headers = concatHeaders(this.pool.headers, customHeaders);
    if (!headers.has("authorization")) {
      headers.set("authorization", `Basic ${btoa(`root:`)}`);
    }

    return this.#request(url, {
      ...opts,
      headers,
      json: body,
    })
      .then(async (response: Response) => {
        const data = await response.clone().json();

        if (data?.error) {
          throw {
            host: this,
            response,
            error: data?.error,
            code: data?.code,
            errnum: data?.errnum,
            message: data?.errorMessage,
          };
        }

        if (typeof getter === "function") {
          return await getter({ response, data, host: this });
        }

        return { response, data, host: this };
      })
      .catch((error: any) => {
        if (error instanceof Error) {
          throw error;
        }

        const err = new ArangoError(error?.message);
        err.code = err?.code;
        throw err;
      });
  }
}
