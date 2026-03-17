import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/DiffLine";
import { ScoreRing } from "@/components/ui/score-ring";
import { db } from "@/db";
import { codes } from "@/db/schema";

export const revalidate = 0;

interface RoastData {
	score: number;
	verdict: string;
	quote: string;
	issues: Array<{
		variant: "critical" | "warning" | "good";
		title: string;
		description: string;
	}>;
	diff: Array<{
		type: "added" | "removed" | "context";
		code: string;
	}>;
}

export default async function RoastResultsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const codeEntry = await db.query.codes.findFirst({
		where: (codes, { eq }) => eq(codes.id, id),
	});

	if (!codeEntry) {
		notFound();
	}

	let roastData: RoastData;
	try {
		roastData = JSON.parse(codeEntry.roast) as RoastData;
	} catch {
		notFound();
	}

	const codeLines = codeEntry.code.split("\n").length;

	return (
		<main className="min-h-screen bg-bg-page">
			<div className="mx-auto flex max-w-6xl flex-col gap-10 px-20 py-10">
				<section className="flex items-center gap-12">
					<ScoreRing score={roastData.score} />

					<div className="flex flex-1 flex-col gap-4">
						<Badge variant="verdict">verdict: {codeEntry.status}</Badge>

						<blockquote className="font-mono text-xl italic leading-relaxed text-text-primary">
							&quot;{roastData.quote}&quot;
						</blockquote>

						<div className="flex items-center gap-4 font-mono text-xs text-text-tertiary">
							<span>lang: {codeEntry.language}</span>
							<span>·</span>
							<span>{codeLines} lines</span>
						</div>
					</div>
				</section>

				<div className="h-px w-full bg-border-primary" />

				<section className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<span className="font-bold font-mono text-accent-green">
							{"//"}
						</span>
						<h2 className="font-bold font-mono text-sm text-text-primary">
							your_submission
						</h2>
					</div>

					<CodeBlock
						code={codeEntry.code}
						lang={codeEntry.language}
						filename="your_code.js"
						height="auto"
					/>
				</section>

				<div className="h-px w-full bg-border-primary" />

				<section className="flex flex-col gap-6">
					<div className="flex items-center gap-2">
						<span className="font-bold font-mono text-accent-green">
							{"//"}
						</span>
						<h2 className="font-bold font-mono text-sm text-text-primary">
							detailed_analysis
						</h2>
					</div>

					<div className="grid grid-cols-2 gap-5">
						{roastData.issues.map((issue, index) => (
							<Card
								key={index}
								title={issue.title}
								description={issue.description}
								variant={issue.variant}
							/>
						))}
					</div>
				</section>

				<div className="h-px w-full bg-border-primary" />

				<section className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<span className="font-bold font-mono text-accent-green">
							{"//"}
						</span>
						<h2 className="font-bold font-mono text-sm text-text-primary">
							suggested_fix
						</h2>
					</div>

					<div className="w-full overflow-hidden rounded border border-border-primary bg-bg-input">
						<div className="flex h-10 items-center gap-2 border-border-primary border-b px-4">
							<span className="font-mono text-xs text-text-secondary">
								your_code.js → improved_code.js
							</span>
						</div>

						<div className="flex flex-col py-1">
							{roastData.diff.map((line, index) => (
								<DiffLine key={index} type={line.type} code={line.code} />
							))}
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
