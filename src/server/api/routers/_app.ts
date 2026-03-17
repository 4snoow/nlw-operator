import { router } from "../trpc";
import { leaderboardRouter } from "./leaderboard";
import { metricsRouter } from "./metrics";

export const appRouter = router({
	leaderboard: leaderboardRouter,
	metrics: metricsRouter,
});

export type AppRouter = typeof appRouter;
