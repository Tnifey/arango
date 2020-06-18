export interface HostRequest {
  url: string;
  method?: string;
  body?: Record<string, any>;
  headers?: Record<string, string> | Headers;
  allowDirtyRead?: boolean;
}

export type HostGetter<T = any> = (any?: any) => T | Promise<T>;

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
  plan?: any;
  profile?: any;
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
