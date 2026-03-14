import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TableRowProps extends React.HTMLAttributes<HTMLDivElement> {
	rank: number;
	score: number;
	language: string;
	children?: ReactNode;
}

export function TableRow({
	className,
	rank,
	score,
	language,
	children,
	...props
}: TableRowProps) {
	return (
		<div
			className={cn(
				"flex items-center gap-6 border-border-primary border-b px-5 py-4",
				className,
			)}
			{...props}
		>
			<span className="w-[50px] font-mono text-gray-500 text-xs">#{rank}</span>
			<span className="w-[70px] font-bold font-mono text-red-500 text-xs">
				{score.toFixed(1)}
			</span>
			{children ? (
				<span className="flex-1 font-mono text-xs">{children}</span>
			) : (
				<span className="flex-1 truncate font-mono text-gray-500 text-xs">
					-
				</span>
			)}
			<span className="w-[100px] font-mono text-gray-500 text-xs">
				{language}
			</span>
		</div>
	);
}
