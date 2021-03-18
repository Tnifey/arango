// deno-lint-ignore-file
import { assert, AssertionError } from "./deps_test.ts";
import arango, { aql, Database, Pool } from "../mod.ts";

Deno.test({
  name: "transaction -> execute transaction with only string",
  async fn() {
    const database = new Database();
    const response = await database.executeTransaction(`() => {
      return 1;
    }`) as any;

    assert(
      "result" in response && response.result === 1,
      `Response has no expected result`,
    );
    assert(
      "error" in response && response.error === false,
      `Response has error`,
    );
    assert("code" in response, `Response has no error code`);
  },
});

Deno.test({
  name: "transaction -> execute transaction with string && params",
  async fn() {
    const expected = 1;
    const database = new Database();
    const response = await database.executeTransaction(
      `({ expected }) => {
      return expected;
    }`,
      { params: { expected } },
    ) as any;

    assert(
      "result" in response && response.result === 1,
      `Response has no expected result`,
    );
    assert(
      "error" in response && response.error === false,
      `Response has error`,
    );
    assert("code" in response, `Response has no error code`);
  },
});

Deno.test({
  name: "transaction -> execute transaction with config",
  async fn() {
    const database = new Database();
    const response = await database.executeTransaction({
      action: `() => {
        return 1;
      }`,
    }) as any;

    assert(
      "result" in response && response.result === 1,
      `Response has no expected result`,
    );
    assert(
      "error" in response && response.error === false,
      `Response has error`,
    );
    assert("code" in response, `Response has no error code`);
  },
});

Deno.test({
  name: "transaction -> execute transaction with config and params",
  async fn() {
    const expected = 1;
    const database = new Database();
    const response = await database.executeTransaction({
      params: { expected },
      action: `({ expected }) => {
        return expected;
      }`,
    }) as any;

    assert(
      "result" in response && response.result === 1,
      `Response has no expected result`,
    );
    assert(
      "error" in response && response.error === false,
      `Response has error`,
    );
    assert("code" in response, `Response has no error code`);
  },
});
