function RoastLoadingSkeleton() {
	return (
		<main className="min-h-screen bg-bg-page">
			<div className="mx-auto flex max-w-6xl flex-col gap-10 px-20 py-10">
				<div className="flex items-center gap-12 animate-pulse">
					<div className="h-32 w-32 rounded-full bg-gray-800" />
					<div className="flex flex-1 flex-col gap-4">
						<div className="h-6 w-32 rounded bg-gray-800" />
						<div className="h-8 w-full rounded bg-gray-800" />
					</div>
				</div>
				<div className="h-px w-full bg-border-primary" />
				<div className="h-48 w-full rounded border border-border-primary bg-gray-800 animate-pulse" />
				<div className="h-px w-full bg-border-primary" />
				<div className="grid grid-cols-2 gap-5">
					<div className="h-32 rounded border border-border-primary bg-gray-800 animate-pulse" />
					<div className="h-32 rounded border border-border-primary bg-gray-800 animate-pulse" />
				</div>
				<div className="flex items-center justify-center py-4">
					<span className="font-mono text-gray-500 text-sm">
						Analyzing your code...
					</span>
				</div>
			</div>
		</main>
	);
}

export default function RoastLoading() {
	return <RoastLoadingSkeleton />;
}
