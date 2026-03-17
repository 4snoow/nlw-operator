import type { Metadata } from "next";
import { db } from "@/db";
import { codes } from "@/db/schema";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;

	const codeEntry = await db.query.codes.findFirst({
		where: (codes, { eq }) => eq(codes.id, id),
	});

	if (!codeEntry) {
		return {
			title: "Roast not found | DevRoast",
		};
	}

	const roastData = JSON.parse(codeEntry.roast);

	return {
		title: `Score: ${roastData.score}/10 | DevRoast`,
		description: roastData.quote,
		openGraph: {
			title: `DevRoast - Score ${roastData.score}/10`,
			description: roastData.quote,
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
		},
	};
}
