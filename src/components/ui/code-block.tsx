import { codeToHtml } from "shiki";

export interface CodeBlockProps {
	code: string;
	lang?: string;
	filename?: string;
	variant?: "default" | "leaderboard";
	rank?: number;
	score?: number;
	language?: string;
	lines?: number;
}

export async function CodeBlock({
	code,
	lang = "javascript",
	filename,
	variant = "default",
	rank,
	score,
	language,
	lines,
}: CodeBlockProps) {
	const html = await codeToHtml(code, {
		lang,
		theme: "vesper",
	});

	const codeLines = code.split("\n");

	return (
		<div className="w-full overflow-hidden rounded border border-border-primary bg-bg-input">
			{variant === "default" && filename && (
				<div className="flex h-10 items-center gap-3 border-border-primary border-b px-4">
					<span className="h-2.5 w-2.5 rounded-full bg-red-500" />
					<span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
					<span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
					<span className="flex-1" />
					<span className="font-mono text-gray-500 text-xs">{filename}</span>
				</div>
			)}

			{variant === "leaderboard" && (
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
							<span className="font-bold text-accent-red">{score}</span>
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
			)}

			<div className="flex max-h-[120px] overflow-y-auto">
				<div className="flex w-10 flex-col items-end gap-1.5 border-border-primary border-r bg-bg-surface px-2.5 py-3 font-mono text-text-tertiary text-xs leading-normal">
					{Array.from({ length: codeLines.length }, (_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: line numbers are inherently stable
						<span key={i}>{i + 1}</span>
					))}
				</div>
				<div
					className="flex-1 overflow-x-auto p-3 font-mono text-xs leading-normal"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: shiki generates safe HTML
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</div>
		</div>
	);
}
