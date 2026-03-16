import { z } from "zod";
import { db } from "@/db";
import { stats } from "@/db/schema";
import { publicProcedure, router } from "../trpc";

export const metricsRouter = router({
	getMetrics: publicProcedure
		.output(
			z.object({
				totalRoasted: z.number(),
				avgScore: z.number(),
			}),
		)
		.query(async () => {
			const statsData = await db.query.stats.findFirst();
			if (!statsData) {
				return {
					totalRoasted: 0,
					avgScore: 0,
				};
			}
			return {
				totalRoasted: statsData.totalRoasted,
				avgScore: statsData.avgScore,
			};
		}),
});
