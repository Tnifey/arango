// deno-lint-ignore-file
import { assert } from "./deps_test.ts";
import { Connection, createConnection } from "../mod.ts";

Deno.test({
  name: "connection -> create connection :: new Connection",
  async fn() {
    const connection = new Connection();
    assert(connection.url[0] === "http://localhost:8529");
  },
});

Deno.test({
  name: "connection -> create connection :: createConnection",
  async fn() {
    const connection = createConnection();
    assert(connection.url[0] === "http://localhost:8529");
  },
});

Deno.test({
  name: "connection -> create connection :: new Connection (url)",
  async fn() {
    const url = "http://localhost:8530";
    const connection = new Connection({
      url: [url],
    });
    assert(connection.url[0] === url);
  },
});

Deno.test({
  name: "connection -> create connection :: createConnection (url)",
  async fn() {
    const url = "http://localhost:8530";
    const connection = createConnection({
      url: [url],
    });
    assert(connection.url[0] === url);
  },
});
