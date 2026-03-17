import Link from "next/link";
import { LeaderboardRow } from "./leaderboard-row";

interface LeaderboardItem {
	id: string;
	code: string;
	language: string;
	score: number;
}

interface LeaderboardPreviewProps {
	leaderboard: LeaderboardItem[];
	totalRoasted?: number;
}

function LeaderboardSkeleton() {
	return (
		<div className="overflow-hidden rounded border border-border-primary">
			<div className="flex h-10 items-center bg-bg-input px-5 animate-pulse">
				<span className="w-[50px] font-medium font-mono text-gray-500 text-xs">
					#
				</span>
				<span className="w-[70px] font-medium font-mono text-gray-500 text-xs">
					score
				</span>
				<span className="flex-1 font-medium font-mono text-gray-500 text-xs">
					code
				</span>
				<span className="w-[100px] font-medium font-mono text-gray-500 text-xs">
					lang
				</span>
			</div>
			{[1, 2, 3].map((i) => (
				<div
					key={i}
					className="flex h-[120px] items-center justify-center border-border-primary border-b bg-bg-input animate-pulse"
				>
					<span className="font-mono text-gray-500 text-xs">loading...</span>
				</div>
			))}
		</div>
	);
}

export async function LeaderboardPreview({
	leaderboard,
	totalRoasted,
}: LeaderboardPreviewProps) {
	const total = totalRoasted ?? leaderboard?.length ?? 0;

	if (!leaderboard || leaderboard.length === 0) {
		return (
			<div className="flex flex-col gap-6">
				<div className="flex items-center justify-between">
					<div className="flex w-full items-center gap-2">
						<span className="font-mono text-accent-green text-sm font-bold">
							{"//"}
						</span>
						<h2 className="font-mono text-[#fafafa] text-md font-bold">
							shame_leaderboard
						</h2>
						<Link
							href="/leaderboard"
							className="flex items-center gap-1 rounded border border-border-primary px-3 py-1.5 font-mono text-gray-500 text-xs ml-auto"
						>
							$ view_all &gt;&gt;
						</Link>
					</div>
				</div>
				<p className="font-mono text-gray-500 text-sm">
					the worst code on the internet, ranked by shame
				</p>
				<LeaderboardSkeleton />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div className="flex w-full items-center gap-2">
					<span className="font-mono text-accent-green text-sm font-bold">
						{"//"}
					</span>
					<h2 className="font-mono text-[#fafafa] text-md font-bold">
						shame_leaderboard
					</h2>
					<Link
						href="/leaderboard"
						className="flex items-center gap-1 rounded border border-border-primary px-3 py-1.5 font-mono text-gray-500 text-xs ml-auto"
					>
						$ view_all &gt;&gt;
					</Link>
				</div>
			</div>

			<p className="font-mono text-gray-500 text-sm">
				the worst code on the internet, ranked by shame
			</p>

			<div className="overflow-hidden rounded border border-border-primary">
				<div className="flex h-10 items-center bg-bg-input px-5">
					<span className="w-[50px] font-medium font-mono text-gray-500 text-xs">
						#
					</span>
					<span className="w-[70px] font-medium font-mono text-gray-500 text-xs">
						score
					</span>
					<span className="flex-1 font-medium font-mono text-gray-500 text-xs">
						code
					</span>
					<span className="w-[100px] font-medium font-mono text-gray-500 text-xs">
						lang
					</span>
				</div>
				{leaderboard.map((item, index) => (
					<LeaderboardRow
						key={item.id}
						id={item.id}
						code={item.code}
						language={item.language}
						score={item.score}
						rank={index + 1}
					/>
				))}
			</div>
			<p className="px-4 py-3 text-center font-mono text-gray-500 text-xs">
				showing top 3 of {total.toLocaleString()} · view full leaderboard
				&gt;&gt;
			</p>
		</div>
	);
}
