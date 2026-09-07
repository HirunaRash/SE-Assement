"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseIdParam = parseIdParam;
/**
 * Express 5's ParamsDictionary types route params as `string | string[]`
 * (to support repeated-segment routes like "/:id+"). For a normal "/:id"
 * route it's always a single string at runtime, so this helper narrows
 * it safely for TypeScript and for `parseInt`.
 */
function parseIdParam(param) {
    const value = Array.isArray(param) ? param[0] : param;
    return parseInt(value, 10);
}
//# sourceMappingURL=params.js.map