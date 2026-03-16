import { CodeBlock } from "@/components/ui/code-block";

interface LeaderboardEntry {
	rank: number;
	score: number;
	language: string;
	lines: number;
	code: string;
}

const leaderboardData: LeaderboardEntry[] = [
	{
		rank: 1,
		score: 1.2,
		language: "javascript",
		lines: 3,
		code: `eval(prompt("enter code"))
document.write(response)
// trust the user lol`,
	},
	{
		rank: 2,
		score: 2.8,
		language: "typescript",
		lines: 3,
		code: `const x = 1;
export default x;`,
	},
	{
		rank: 3,
		score: 3.1,
		language: "sql",
		lines: 2,
		code: `DROP DATABASE prod;
-- oops`,
	},
	{
		rank: 4,
		score: 3.5,
		language: "java",
		lines: 3,
		code: `public class Main {
  public static void main(String[] args) {`,
	},
	{
		rank: 5,
		score: 3.9,
		language: "javascript",
		lines: 3,
		code: `function foo() {
  return 1;
}`,
	},
];

export default async function LeaderboardPage() {
	return (
		<main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-5xl flex-col gap-10 px-20 py-10">
			<section className="flex flex-col gap-4">
				<div className="flex items-center gap-3">
					<span className="font-bold font-mono text-[32px] text-accent-green">
						&gt;
					</span>
					<h1 className="font-bold font-mono text-[28px] text-text-primary">
						shame_leaderboard
					</h1>
				</div>
				<p className="font-mono text-sm text-text-secondary">
					{/* the most roasted code on the internet */}
				</p>
				<div className="flex items-center gap-2 font-mono text-text-tertiary text-xs">
					<span>2,847 submissions</span>
					<span>·</span>
					<span>avg score: 4.2/10</span>
				</div>
			</section>

			<section className="flex w-full flex-col gap-5">
				{leaderboardData.map((entry) => (
					<CodeBlock
						key={entry.rank}
						code={entry.code}
						lang={entry.language}
						variant="leaderboard"
						rank={entry.rank}
						score={entry.score}
						language={entry.language}
						lines={entry.lines}
					/>
				))}
			</section>
		</main>
	);
}
