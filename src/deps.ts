export { posix } from "https://deno.land/std/node/path.ts";
import QS from "https://jspm.dev/npm:query-string@2";

export const qs = QS as {
  parse: (q: string, o: unknown) => JSON;
  stringify: (o: JSON) => string;
};

export {
  aql,
  isAqlLiteral,
  isArangoCollection,
  isGeneratedAqlQuery,
} from "https://github.com/Tnifey/aql-tag/raw/master/src/mod.ts";

export type {
  AqlLiteral,
  AqlLiteralValueType,
  AqlValue,
  ArangoCollection,
  GeneratedAqlQuery,
} from "https://github.com/Tnifey/aql-tag/raw/master/src/mod.ts";

export { default as ArangoErrorCode } from "https://github.com/oprogramador/arangodb-error-codes/raw/288426d121493e1a86c2304ff5431662d560c589/app/index.js";
