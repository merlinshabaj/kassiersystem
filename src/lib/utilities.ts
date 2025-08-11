export function assert(
  condition: boolean,
  failure_message?: string,
): asserts condition {
  if (condition) {
    return;
  }

  panic(failure_message ?? 'assertion failed');
}

export function panic(
  msg?: string,
): never {
  if ((globalThis as any).process?.env?.DEBUG) {
    debugger;
  }

  throw new Error(msg ?? 'unexpected error');
}