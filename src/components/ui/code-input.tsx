import { cn } from "@/lib/utils";

export interface CodeInputProps {
	className?: string;
}

export function CodeInput({ className }: CodeInputProps) {
	return (
		<div
			className={cn(
				"flex flex-col overflow-hidden rounded border border-border-primary bg-bg-input",
				className,
			)}
		>
			<div className="flex h-10 items-center gap-3 border-border-primary border-b px-4">
				<span className="h-3 w-3 rounded-full bg-red-500" />
				<span className="h-3 w-3 rounded-full bg-amber-500" />
				<span className="h-3 w-3 rounded-full bg-emerald-500" />
			</div>
			<textarea
				placeholder="// paste your code here..."
				className="flex-1 resize-none bg-transparent p-4 font-mono text-[#fafafa] text-sm placeholder:text-gray-500 focus:outline-none"
			/>
		</div>
	);
}
