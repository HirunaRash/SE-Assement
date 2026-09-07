export const numberParam = (value: unknown, fallback: number, min = 0, max = 100): number => {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? Math.min(max, Math.max(min, Math.floor(parsed))) : fallback;
};

export const optionalDate = (value: unknown): Date | undefined => {
	if (typeof value !== 'string' || !value) return undefined;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? undefined : date;
};
