import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/DiffLine";
import { ScoreRing } from "@/components/ui/score-ring";

const roastData = {
	score: 3.5,
	verdict: "needs_serious_help",
	quote:
		"this code looks like it was written during a power outage... in 2005.",
	language: "javascript",
	lines: 7,
	code: `function calculateSum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}`,
	issues: [
		{
			variant: "critical",
			title: "Inefficient loop pattern",
			description:
				"Using a manual for loop when Array.reduce() is more idiomatic and concise for sum operations.",
		},
		{
			variant: "warning",
			title: "Missing input validation",
			description:
				"No check if arr is actually an array or if it contains valid numbers. Could throw unexpected errors.",
		},
		{
			variant: "warning",
			title: "No handling of empty arrays",
			description:
				"Calling this function with an empty array returns 0, which may or may not be the desired behavior.",
		},
		{
			variant: "good",
			title: "Non-functional mutation",
			description:
				"The sum variable is mutated in each iteration. Functional approaches are more predictable.",
		},
	],
	diff: [
		{ type: "context" as const, code: "function calculateSum(arr) {" },
		{
			type: "context" as const,
			code: "  // Consider using reduce for sum operations",
		},
		{ type: "context" as const, code: "  if (!Array.isArray(arr)) return 0;" },
		{ type: "removed" as const, code: "  let sum = 0;" },
		{
			type: "removed" as const,
			code: "  for (let i = 0; i < arr.length; i++) {",
		},
		{ type: "removed" as const, code: "    sum += arr[i];" },
		{ type: "removed" as const, code: "  }" },
		{ type: "removed" as const, code: "  return sum;" },
		{
			type: "added" as const,
			code: "  return arr.reduce((a, b) => a + b, 0);",
		},
		{ type: "context" as const, code: "}" },
	],
};

export default function RoastResultsPage() {
	return (
		<main className="min-h-screen bg-bg-page">
			<div className="mx-auto flex max-w-6xl flex-col gap-10 px-20 py-10">
				<section className="flex items-center gap-12">
					<ScoreRing score={roastData.score} />

					<div className="flex flex-1 flex-col gap-4">
						<Badge variant="verdict">verdict: {roastData.verdict}</Badge>

						<blockquote className="font-mono text-xl italic leading-relaxed text-text-primary">
							&quot;{roastData.quote}&quot;
						</blockquote>

						<div className="flex items-center gap-4 font-mono text-xs text-text-tertiary">
							<span>lang: {roastData.language}</span>
							<span>·</span>
							<span>{roastData.lines} lines</span>
						</div>

						<div className="flex items-center gap-3 pt-2">
							<button
								type="button"
								className="cursor-pointer rounded border border-border-primary px-4 py-2 font-mono text-xs text-text-secondary transition-colors hover:border-text-tertiary hover:text-text-primary"
							>
								share
							</button>
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
						code={roastData.code}
						lang={roastData.language}
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
								variant={issue.variant as "critical" | "warning" | "good"}
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
