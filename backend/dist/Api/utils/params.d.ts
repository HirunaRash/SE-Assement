/**
 * Express 5's ParamsDictionary types route params as `string | string[]`
 * (to support repeated-segment routes like "/:id+"). For a normal "/:id"
 * route it's always a single string at runtime, so this helper narrows
 * it safely for TypeScript and for `parseInt`.
 */
export declare function parseIdParam(param: string | string[]): number;
//# sourceMappingURL=params.d.ts.map