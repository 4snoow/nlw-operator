import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { appRouter } from "@/server/api/routers/_app";
import { createCallerFactory, createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";

export const getQueryClient = cache(makeQueryClient);
export const caller = createCallerFactory(appRouter)(createTRPCContext);

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
	caller,
	getQueryClient,
);
