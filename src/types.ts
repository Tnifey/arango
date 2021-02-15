export interface IPoolConfig {
  /**
   * Database host url
   */
  url?: string | string[];

  /**
   * Database authentication credentials
   * (username and password) or bearer token
   * @default {{username:"root"}}
   */
  auth?: IArangoCredentials;
}

export interface IArangoConfig extends IPoolConfig {
  /**
   * Database name
   */
  name?: string;

  /**
   * Determinates if database has absolute path
   */
  isAbsolute?: boolean;
}

export type IArangoCredentials =
  | { username?: string; password?: string }
  | string;

export interface HostRequest {
  url: string;
  method?: string;
  body?: Dict;
  headers?: IHeaders;
  allowDirtyRead?: boolean;
}

export type HostGetter<T = unknown> = (smth?: unknown) => T | Promise<T>;

export interface PoolConfig {
  /**
     * Array of url to hosts
     */
  url?: string[];

  /**
     * JWT Token or object with username and password
     */
  auth?: string | { username: string; password?: string };

  /**
     * Additional headers
     */
  headers?: Record<string, string> | Headers;

  /**
     * Choose strategy host to pick host to perform request
     */
  loadBalancingStrategy?: LoadBalancingStrategy;
  arangoVersion?: number;
}

export type LoadBalancingStrategy = "NONE" | "ONE_RANDOM";

export interface CursorExtra {
  stats?: CursorExtraStats;
  warnings?: CursorExtraWarning[];
  plan?: unknown;
  profile?: unknown;
}

export interface CursorExtraStats {
  writesExecuted: number;
  writesIgnored: number;
  scannedFull: number;
  scannedIndex: number;
  filtered: number;
  httpRequests: number;
  executionTime: number;
  peakMemoryUsage: number;
}

export interface CursorExtraWarning {
  code: number;
  message: string;
}

export interface IArangoQueryOptions {
  cache?: boolean;
  batchSize?: number;
}

export interface ICursorInit<T> {
  result: T[];
  extra?: ICursorExtra;
  cached?: boolean;
  id?: string;
  hasMore?: boolean;
}

export interface ICursorExtra {
  stats: Partial<ICursorStats>;
  warnings: [];
}

export interface ICursorStats {
  writesExecuted: number;
  writesIgnored: number;
  scannedFull: number;
  scannedIndex: number;
  filtered: number;
  httpRequests: number;
  executionTime: number;
  peakMemoryUsage: number;
}

export type IHeaders = (Headers | Record<string, string>);

export type IRequest = {
  method: string;
  path: string;
  query?: Dict;
  headers?: IHeaders;
  body?: unknown;
  isAbsolute?: boolean;
};

export type Dict<T extends unknown = unknown> = Record<string, T>;

export enum CollectionType {
  "DOCUMENT_COLLECTION" = 2,
  "EDGES_COLLECTION" = 3,
}

export enum CollectionStatus {
  "new born collection" = 1,
  "unloaded" = 2,
  "loaded" = 3,
  "in the process of being unloaded" = 4,
  "deleted" = 5,
  "loading" = 6,
}

export interface ICollection {
  id: string;
  name: string;
  status: number;
  type: CollectionType;
  isSystem: boolean;
}

export interface ICollectionCreate {
  name: string;
  type: CollectionType;
}
