import { PoolConfig } from "./src/types.ts";
import { Pool } from "./src/Pool.ts";
import { Database } from "./src/Database.ts";

export { Pool, Database };

/**
 * Pool factory function
 * @param config
 */
export default function arango(config?: PoolConfig) {
  return new Pool(config);
}

export {
  aql,
  isAqlLiteral,
  isArangoCollection,
  isGeneratedAqlQuery,
} from "./src/aql.ts";
