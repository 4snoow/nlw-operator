import { z } from "zod";
import { db } from "@/db";
import { codes } from "@/db/schema";
import { getSystemPrompt, openai, type RoastResponse } from "@/lib/openai";
import { publicProcedure, router } from "../trpc";

const createRoastInput = z.object({
	code: z.string().min(1).max(10000),
	roastMode: z.boolean().default(false),
});

const createRoastOutput = z.object({
	id: z.string(),
});

export const roastRouter = router({
	createRoast: publicProcedure
		.input(createRoastInput)
		.output(createRoastOutput)
		.mutation(async ({ input }) => {
			try {
				const response = await openai.chat.completions.create({
					model: "gpt-4o",
					messages: [
						{ role: "system", content: getSystemPrompt(input.roastMode) },
						{ role: "user", content: input.code },
					],
					response_format: { type: "json_object" },
					temperature: input.roastMode ? 0.8 : 0.3,
				});

				const content = response.choices[0]?.message?.content;
				if (!content) {
					throw new Error("No response from AI");
				}

				let roastData: RoastResponse;
				try {
					roastData = JSON.parse(content) as RoastResponse;
				} catch {
					throw new Error("Invalid response format from AI");
				}

				const [savedCode] = await db
					.insert(codes)
					.values({
						code: input.code,
						language: "auto",
						status: roastData.verdict as
							| "critical"
							| "needs_serious_help"
							| "warning"
							| "good",
						score: roastData.score,
						roast: JSON.stringify(roastData),
						roastMode: input.roastMode,
					})
					.returning({ id: codes.id });

				return { id: savedCode.id };
			} catch (error) {
				if (error instanceof Error) {
					throw new Error(`Roast failed: ${error.message}`);
				}
				throw new Error("Roast failed: Unknown error");
			}
		}),
});
