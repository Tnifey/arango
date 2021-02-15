// deno-lint-ignore-file
import { assert } from "https://deno.land/std/testing/asserts.ts";
import arango, { Pool } from "../mod.ts";

Deno.test({
  name: "create Pool without config",
  async fn() {
    const pool = arango();
    assert(pool.url[0] === `http://localhost:8529`);
  },
});

Deno.test({
  name: "create Pool with factory function",
  async fn() {
    const url = "http://localhost:8529";
    const pool = arango({ url: [url] });
    assert(pool.url[0] === url);
  },
});

Deno.test({
  name: "create Pool class",
  async fn() {
    const url = "http://localhost:8529";
    const pool = new Pool({ url: [url] });
    assert(pool.url[0] === url);
  },
});
