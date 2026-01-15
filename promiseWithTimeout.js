export function promiseWithTimeout(timeout) {
  const { promise, resolve } = Promise.withResolvers();
  const timeoutPromise = new Promise(r => setTimeout(r, timeout));
  return {
    promise: Promise.race([promise, timeoutPromise]),
    resolve
  };
}
