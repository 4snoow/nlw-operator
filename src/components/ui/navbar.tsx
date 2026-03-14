import Link from "next/link";

export function Navbar() {
	return (
		<nav className="flex h-14 items-center justify-between border-border-primary border-b bg-bg-page px-6">
			<Link href="/" className="flex items-center gap-2">
				<span className="font-bold font-mono text-primary text-xl">&gt;</span>
				<span className="font-medium font-mono text-[#fafafa] text-lg">
					devroast
				</span>
			</Link>
			<Link
				href="/leaderboard"
				className="font-mono text-gray-500 text-sm hover:text-gray-400"
			>
				leaderboard
			</Link>
		</nav>
	);
}
