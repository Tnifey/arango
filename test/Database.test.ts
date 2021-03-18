// deno-lint-ignore-file
import { assert, AssertionError } from "./deps_test.ts";
import arango, { aql, Database, Pool } from "../mod.ts";
import { Cursor } from "../src/Cursor.ts";

Deno.test({
  name: "url -> url as string",
  async fn() {
    const url = "testing";
    const database = new Database({ url });
    assert(database.url === url);
  },
});

Deno.test({
  name: "url -> url as array",
  async fn() {
    const url = "testing";
    const database = new Database({ url: [url] });
    assert(database.url === url);
  },
});

Deno.test({
  name: "url -> without url",
  async fn() {
    const url = "http://localhost:8529/";
    const database = new Database();
    assert(database.url === url);
  },
});

Deno.test({
  name: "database -> create database instance using function",
  async fn() {
    const name = "_system";
    const database = arango().database(name);
    assert(database.name === name);
  },
});

Deno.test({
  name: "database -> create database instance using function",
  async fn() {
    const name = "_system";
    const database = arango().database(name);
    assert(database.name === name);
  },
});

Deno.test({
  name: "database -> create database instance with class",
  async fn() {
    const name = "_system";
    const database = new Database({ name });
    assert(database.name === name);
  },
});

Deno.test({
  name: "database -> create database with instance of Pool",
  async fn() {
    const name = "_system";
    const pool = new Pool();
    const database = pool.database(name);
    assert(database.name === name);
  },
});

Deno.test({
  name: "database -> connect to database without password",
  async fn() {
    const database = new Database({
      url: "http://localhost:8529",
    });
    const { error, result } = await database.get();
    assert(result?.name === "_system");
    assert(error === false);
  },
});

Deno.test({
  name: "database -> connect to database with password",
  async fn() {
    const database = new Database({
      url: "http://localhost:8530",
      auth: {
        username: "root",
        password: "secret",
      },
    });

    const { error, result } = await database.get();

    assert(result?.name === "_system");
    assert(error === false);
  },
});

Deno.test({
  name: "database -> connect to database with wrong password",
  async fn() {
    const database = new Database({
      url: "http://localhost:8530",
      auth: {
        password: "birds-fly-key",
      },
    });

    try {
      await database.get();
    } catch (error) {
      assert(
        error.message.indexOf(`not authorized`) !== -1,
      );
    }
  },
});

Deno.test({
  name: "database -> connect to non existing database",
  async fn() {
    const database = new Database({
      url: "http://localhost:8529",
      name: "i-am-not-here",
    });

    try {
      await database.get();
    } catch (error) {
      assert(error.message.indexOf(`database not found`) !== -1);
    }
  },
});

Deno.test({
  name: "database -> connect to non existing database",
  async fn() {
    const database = new Database({
      url: "http://localhost:8530",
    });

    const token = await database.login("root", "secret");

    database.useBearerAuth(token);

    const { result, error } = await database.get();

    assert(result.name === database.name);
    assert(error === false);
  },
});

Deno.test({
  name: "database -> aql tag",
  async fn() {
    const query = aql`return 1`;
    assert(query?.query === `return 1`);
  },
});

Deno.test({
  name: "database -> database query",
  async fn() {
    const name = "_system";
    const database = new Pool().database(name);

    const query = aql`return 1`;
    const result = await database.query(query);

    assert(result instanceof Cursor, "result is not an cursor");
    const all = await result.all();
    assert(Array.isArray(all), "result all is not an array");

    assert(all?.[0] === 1, "returned result not match with given result");
  },
});

Deno.test({
  name: "database -> database query bindVars",
  async fn() {
    const name = "_system";
    const database = new Pool().database(name);

    const query = aql`return ${2}`;
    const result = await database.query(query);

    assert(result instanceof Cursor, "result is not an cursor");
    const all = await result.all();
    assert(Array.isArray(all), "result all is not an array");

    assert(all?.[0] === 2, "returned result not match with given result");
  },
});

Deno.test({
  name: "database -> database query batch",
  async fn() {
    const name = "_system";
    const database = new Pool().database(name);
    const batchSize = 2;
    const payload = [1, 2, 3, 4, 5, 6];

    const query = aql`
      let items = ${payload}
      for item in items
      return item
    `;
    const result = await database.query(query, { batchSize });

    assert(result instanceof Cursor, "result is not cursor");
    const all = await result.all();
    assert(Array.isArray(all), "result all is not an array");
    assert(all.length === 2, "batch size is not valid");
    assert(
      all?.[0] === payload[0],
      "returned result not match with given result",
    );

    assert(typeof result.hasMore === "boolean", "invalid hasMore property");
    const more = await result.more();
    assert(!!more, "invalid cursor");

    if (more) {
      const moreAll = await more.all();
      assert(moreAll.length === batchSize, "more batch size is not valid");
      assert(moreAll[0] === payload[2], "invalid more first result");
    }

    try {
      await result.kill();
    } catch (error) {
      // @ts-ignore
      throw new AssertionError(`cursor kill error: ${error.message}`);
    }
  },
});
