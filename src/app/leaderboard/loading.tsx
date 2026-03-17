function LeaderboardLoadingSkeleton() {
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
					the worst code on the internet, ranked by shame
				</p>
				<div className="flex items-center gap-2 font-mono text-text-tertiary text-xs">
					<span className="h-4 w-24 animate-pulse rounded bg-gray-700" />
					<span>·</span>
					<span className="h-4 w-20 animate-pulse rounded bg-gray-700" />
				</div>
			</section>

			<section className="flex w-full flex-col gap-5">
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
				{[1, 2, 3, 4, 5].map((i) => (
					<div
						key={i}
						className="flex h-[120px] animate-pulse items-center justify-center rounded border border-border-primary bg-bg-input"
					>
						<span className="font-mono text-gray-500 text-xs">loading...</span>
					</div>
				))}
			</section>
		</main>
	);
}

export default function LeaderboardLoading() {
	return <LeaderboardLoadingSkeleton />;
}
