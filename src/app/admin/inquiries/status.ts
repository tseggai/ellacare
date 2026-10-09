export const STATUSES = ["new", "contacted", "toured", "closed"] as const;
export type Status = (typeof STATUSES)[number];
