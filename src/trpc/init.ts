import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { t } from "@/server/api/trpc";

export async function createTRPCContext(opts?: FetchCreateContextFnOptions) {
	return {
		headers: opts?.req.headers,
	};
}

export const createCallerFactory = t.createCallerFactory;
