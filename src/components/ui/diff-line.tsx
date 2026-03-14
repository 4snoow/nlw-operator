import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const diffLineTv = tv({
	base: "flex font-mono text-[13px] gap-2 px-4 py-2",
	variants: {
		type: {
			removed: "bg-[#1a0a0a]",
			added: "bg-[#0a1a0f]",
			context: "",
		},
	},
	defaultVariants: {
		type: "context",
	},
});

export interface DiffLineProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof diffLineTv> {
	type: "removed" | "added" | "context";
	code: string;
}

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
