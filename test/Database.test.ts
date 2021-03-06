// deno-lint-ignore-file
import {
  assert,
  AssertionError,
} from "https://deno.land/std/testing/asserts.ts";
import arango, { aql, Database, Pool } from "../mod.ts";
import { Cursor } from "../src/Cursor.ts";

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

    assert(result instanceof Cursor, "result is not an cursor");
    const all = await result.all();
    assert(Array.isArray(all), "result all is not an array");
    assert(all.length === 2, "batch size is not valid");
    assert(
      all?.[0] === payload[0],
      "returned result not match with given result",
    );

    assert(result.hasMore, "invalid hasMore property");
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
      if (error) {
        throw new AssertionError(`cursor kill error: ${error.message}`);
      }
    }
  },
});
