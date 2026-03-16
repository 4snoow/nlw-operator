import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/api/routers/_app";
import { createTRPCContext } from "@/trpc/init";

const handler = (req: Request) =>
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext: () =>
			createTRPCContext({ req } as Parameters<typeof createTRPCContext>[0]),
	});

export { handler as GET, handler as POST };
