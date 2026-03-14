import { cn } from "@/lib/utils";

interface ScoreRingProps {
	score: number;
	className?: string;
}

export function ScoreRing({ score, className }: ScoreRingProps) {
	const clampedScore = Math.max(0, Math.min(10, score));
	const percentage = clampedScore / 10;
	const radius = 80;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference * (1 - percentage);

	const amberPosition = Math.max(1, percentage * 100);

	return (
		<div
			className={cn(
				"relative inline-flex items-center justify-center",
				className,
			)}
		>
			<svg
				width="180"
				height="180"
				className="-rotate-[135deg]"
				viewBox="0 0 180 180"
				aria-label={`Score: ${clampedScore} out of 10`}
			>
				<defs>
					<linearGradient
						id="scoreGradient"
						x1="0%"
						y1="0%"
						x2="100%"
						y2="0%"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0%" stopColor="#ef4444" />
						<stop offset={`${amberPosition}%`} stopColor="#f59e0b" />
						<stop offset="100%" stopColor="#10b981" />
					</linearGradient>
				</defs>
				<circle
					cx="90"
					cy="90"
					r={radius}
					fill="none"
					stroke="#2a2a2a"
					strokeWidth="4"
				/>
				<circle
					cx="90"
					cy="90"
					r={radius}
					fill="none"
					stroke="url(#scoreGradient)"
					strokeWidth="4"
					strokeLinecap="round"
					strokeDasharray={circumference}
					strokeDashoffset={strokeDashoffset}
					className="origin-center"
				/>
			</svg>
			<div className="absolute inset-0 flex items-center justify-center">
				<span className="font-bold font-mono text-5xl text-[#fafafa]">
					{clampedScore.toFixed(1)}
				</span>
				<span className="ml-1 font-mono text-base text-gray-500">/10</span>
			</div>
		</div>
	);
}
