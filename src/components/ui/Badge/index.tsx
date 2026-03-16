import { badgeTv } from "./badge.styles";
import type { BadgeProps } from "./badge.types";

export function Badge({ className, variant, children, ...props }: BadgeProps) {
	return (
		<span className={badgeTv({ variant, className })} {...props}>
			{variant === "verdict" ? (
				<span className="flex gap-1.5">
					<span className="h-2.5 w-2.5 rounded-full bg-red-500" />
					<span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
					<span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
				</span>
			) : (
				<span className="h-2 w-2 rounded-full bg-current" />
			)}
			{children}
		</span>
	);
}

export type { BadgeProps };
