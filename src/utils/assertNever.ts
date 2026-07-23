/**
 * Forces a compile error if a switch statement doesn't handle every member
 * of a union. Used in builderReducer's `default` branch — adding a new
 * BuilderAction variant without a matching `case` fails the build, not a
 * user's click at runtime.
 */
export function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
}
