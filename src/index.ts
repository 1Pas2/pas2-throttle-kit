export interface Throttled<A extends unknown[]> {
  (...args: A): void;
  cancel(): void;
  flush(): void;
}
export function throttle<A extends unknown[]>(
  fn: (...args: A) => void,
  waitMs: number,
  trailing = true,
): Throttled<A> {
  if (!Number.isFinite(waitMs) || waitMs < 0 || waitMs > 2147483647)
    throw new RangeError("Invalid wait");
  let timer: ReturnType<typeof setTimeout> | undefined, args: A | undefined;
  function expire(): void {
    timer = undefined;
    if (args) {
      const a = args;
      args = undefined;
      timer = setTimeout(expire, waitMs);
      fn(...a);
    }
  }
  const wrapped = ((...a: A) => {
    if (timer === undefined) {
      timer = setTimeout(expire, waitMs);
      fn(...a);
    } else if (trailing) args = a;
  }) as Throttled<A>;
  wrapped.cancel = () => {
    clearTimeout(timer);
    timer = undefined;
    args = undefined;
  };
  wrapped.flush = () => {
    if (args) {
      clearTimeout(timer);
      expire();
    }
  };
  return wrapped;
}
