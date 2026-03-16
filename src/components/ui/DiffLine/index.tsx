import { cn } from "@/lib/utils";
import { diffLineTv } from "./diff-line.styles";
import type { DiffLineProps } from "./diff-line.types";

export function DiffLine({ className, type, code, ...props }: DiffLineProps) {
	const prefix = type === "removed" ? "-" : type === "added" ? "+" : " ";
	const prefixColor =
		type === "removed"
			? "text-red-500"
			: type === "added"
				? "text-emerald-500"
				: "text-gray-500";
	const codeColor =
		type === "removed"
			? "text-gray-500"
			: type === "added"
				? "text-[#fafafa]"
				: "text-gray-500";

	return (
		<div className={diffLineTv({ type, className })} {...props}>
			<span className={cn("w-3", prefixColor)}>{prefix}</span>
			<span className={codeColor}>{code}</span>
		</div>
	);
}

export type { DiffLineProps };
