import { asc } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { codes } from "@/db/schema";
import { publicProcedure, router } from "../trpc";

export const leaderboardRouter = router({
	getLeaderboard: publicProcedure
		.input(z.object({ limit: z.number().min(1).max(100).default(3) }))
		.output(
			z.array(
				z.object({
					id: z.string(),
					code: z.string(),
					language: z.string(),
					score: z.number(),
				}),
			),
		)
		.query(async ({ input }) => {
			const leaderboard = await db.query.codes.findMany({
				orderBy: [asc(codes.score)],
				limit: input.limit,
			});
			return leaderboard.map((code) => ({
				id: code.id,
				code: code.code,
				language: code.language,
				score: code.score,
			}));
		}),
});
