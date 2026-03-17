"use client";

import { useState } from "react";

interface LeaderboardRowClientProps {
	htmlFull: string;
	htmlTruncated: string;
	language: string;
	rank: number;
	score: number;
	lines: number;
	isLongCode: boolean;
}

export function LeaderboardRowClient({
	htmlFull,
	htmlTruncated,
	language,
	rank,
	score,
	lines,
	isLongCode,
}: LeaderboardRowClientProps) {
	const [expanded, setExpanded] = useState(false);

	const codeLines = (expanded ? htmlFull : htmlTruncated).split("\n");

	return (
		<div className="border-border-primary border-b">
			<div className="w-full overflow-hidden rounded border border-border-primary bg-bg-input">
				<div className="flex h-fit items-center justify-between border-border-primary border-b px-5 py-3">
					<div className="flex items-center gap-4">
						<span className="flex items-center gap-1.5 font-mono text-sm text-text-tertiary">
							<span className="text-text-tertiary">#</span>
							<span
								className={
									rank === 1 ? "font-bold text-accent-amber" : "font-normal"
								}
							>
								{rank}
							</span>
						</span>
						<span className="flex items-center gap-1.5 font-mono text-text-tertiary text-xs">
							<span>score:</span>
							<span className="font-bold text-accent-red">
								{score.toFixed(1)}
							</span>
						</span>
					</div>
					<div className="flex items-center gap-3">
						<span className="font-mono text-text-secondary text-xs">
							{language}
						</span>
						<span className="font-mono text-text-tertiary text-xs">
							{lines} lines
						</span>
					</div>
				</div>

				<div
					className={
						!isLongCode || expanded
							? "flex"
							: "flex max-h-[120px] overflow-y-auto"
					}
				>
					<div className="flex w-10 flex-col items-end gap-1.5 border-border-primary border-r bg-bg-surface px-2.5 py-3 font-mono text-text-tertiary text-xs leading-normal">
						{Array.from({ length: codeLines.length }, (_, i) => (
							<span key={i}>{i + 1}</span>
						))}
					</div>
					<div
						className="flex-1 overflow-x-auto p-3 font-mono text-xs leading-normal"
						dangerouslySetInnerHTML={{
							__html: expanded ? htmlFull : htmlTruncated,
						}}
					/>
				</div>
			</div>
			{isLongCode && (
				<button
					onClick={() => setExpanded(!expanded)}
					className="flex w-full items-center justify-center gap-1 border-t border-border-primary bg-bg-input px-4 py-2 font-mono text-xs text-gray-500 transition-colors hover:bg-bg-surface"
				>
					{expanded ? <>show less ▲</> : <>show more ({lines - 3} lines) ▼</>}
				</button>
			)}
		</div>
	);
}
