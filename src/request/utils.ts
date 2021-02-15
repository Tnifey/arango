import { posix, qs } from "../deps.ts";
import { Dict, IHeaders } from "../types.ts";

export function buildUrl(
  host: string,
  endpoint: string[],
  query?: Dict,
): string {
  const url = new URL(host);
  url.username = "";
  url.password = "";

  url.pathname = posix.join(url.pathname, ...endpoint);
  url.search = buildSearchQuery(url.search, query);
  return url.href;
}

export function buildSearchQuery(current: string, query?: Dict) {
  const obj = { ...qs.parse(current, {}), ...query };
  return qs.stringify(obj);
}

export function joinHeaders(a: IHeaders, b?: IHeaders) {
  if (!b) return new Headers(a);

  const returns = new Headers(a);
  if (b instanceof Headers) {
    for (const key of b.keys()) {
      const value = b.get(key);
      if (value) {
        returns.append(key, value);
      }
    }
  } else if (b instanceof Object) {
    for (const key of Object.keys(b)) {
      const value = b[key];
      if (value) {
        returns.append(key, value);
      }
    }
  }

  return returns;
}
