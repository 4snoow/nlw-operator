import { codeToHtml } from "shiki";

interface CodeBlockProps {
	code: string;
	lang?: string;
	filename?: string;
}

export async function CodeBlock({
	code,
	lang = "javascript",
	filename,
}: CodeBlockProps) {
	const html = await codeToHtml(code, {
		lang,
		theme: "vesper",
	});

	const lines = code.split("\n");

	return (
		<div className="w-full max-w-[560px] overflow-hidden rounded border border-border-primary bg-input-bg">
			{filename && (
				<div className="flex h-10 items-center gap-3 border-border-primary border-b px-4">
					<span className="h-2.5 w-2.5 rounded-full bg-red-500" />
					<span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
					<span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
					<span className="flex-1" />
					<span className="font-mono text-gray-500 text-xs">{filename}</span>
				</div>
			)}
			<div className="flex">
				<div className="flex w-10 flex-col gap-1.5 border-border-primary border-r bg-[#0f0f0f] px-2.5 py-3 text-right font-mono text-[13px] text-gray-500 leading-normal">
					{Array.from({ length: lines.length }, (_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: line numbers are inherently stable
						<span key={i}>{i + 1}</span>
					))}
				</div>
				<div
					className="flex-1 overflow-x-auto p-3 font-mono text-[13px] leading-normal"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: shiki generates safe HTML
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</div>
		</div>
	);
}
