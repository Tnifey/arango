import { IPoolConfig } from "./src/types.ts";
import { Pool } from "./src/Pool.ts";
import { Database } from "./src/Database.ts";

export { Database, Pool };

/**
 * Pool factory function
 * @param config
 */
export default function arango(config?: IPoolConfig) {
  return new Pool(config);
}

export {
  aql,
  isAqlLiteral,
  isArangoCollection,
  isGeneratedAqlQuery,
} from "./src/deps.ts";
