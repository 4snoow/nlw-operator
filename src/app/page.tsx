import { HomeClient } from "@/components/home-client";
import { HydrateClient, trpc } from "@/trpc/server";

export default async function Home() {
	void trpc.metrics.getMetrics.prefetch();

	return (
		<HydrateClient>
			<HomeClient />
		</HydrateClient>
	);
}
