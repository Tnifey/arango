/**
 * Create new Headers instance with merged values
 * @param base
 * @param args
 */
export function concatHeaders(
  base: Headers | Record<string, string>,
  ...args: (Headers | Record<string, string> | undefined)[]
) {
  const headers = new Headers(base);

  for (let custom of args) {
    const iterable =
      custom instanceof Headers
        ? custom.entries()
        : typeof custom === "object"
        ? Object.entries(custom)
        : undefined;

    if (iterable) {
      for (let [name, value] of iterable) {
        headers.set(name, value);
      }
    }
  }

  return headers;
}
