export { posix } from "https://deno.land/std@0.138.0/node/path.ts";
import QS from "https://jspm.dev/npm:query-string@2";

export const qs = QS as {
  parse: (q: string, o: unknown) => JSON;
  stringify: (o: JSON) => string;
};

export { default as ArangoErrorCode } from "https://raw.githubusercontent.com/oprogramador/arangodb-error-codes/288426d121493e1a86c2304ff5431662d560c589/app/index.js";
export { default as PQueue } from "https://cdn.skypack.dev/p-queue@v7.2.0?dts";
export { default as cleanStack } from "https://cdn.skypack.dev/clean-stack";
