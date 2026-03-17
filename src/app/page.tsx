import { HomeClient } from "@/components/home-client";
import { LeaderboardPreview } from "@/components/leaderboard-preview";
import { HydrateClient, trpc } from "@/trpc/server";

export const revalidate = 3600;

export default async function Home() {
	void trpc.metrics.getMetrics.prefetch();
	const leaderboard = await trpc.leaderboard.getLeaderboard({ limit: 3 });

	return (
		<HydrateClient>
			<main className="mx-auto flex max-w-5xl flex-col gap-8 px-10 py-20">
				<HomeClient>
					<LeaderboardPreview leaderboard={leaderboard} />
				</HomeClient>
			</main>
		</HydrateClient>
	);
}
