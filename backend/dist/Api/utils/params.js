"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalDate = exports.numberParam = void 0;
const numberParam = (value, fallback, min = 0, max = 100) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.min(max, Math.max(min, Math.floor(parsed))) : fallback;
};
exports.numberParam = numberParam;
const optionalDate = (value) => {
    if (typeof value !== 'string' || !value)
        return undefined;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
};
exports.optionalDate = optionalDate;
//# sourceMappingURL=params.js.map