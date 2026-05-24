import type { ParamSchema, ParamValues } from './types';

export function defaultsFromSchema(schema: ParamSchema): ParamValues {
  return Object.fromEntries(schema.map((d) => [d.key, d.default]));
}
