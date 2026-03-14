import { tv, type VariantProps } from "tailwind-variants";

const badgeTv = tv({
	base: "inline-flex items-center gap-2 font-mono text-xs font-normal",
	variants: {
		variant: {
			critical: "text-red-500",
			warning: "text-amber-500",
			good: "text-emerald-500",
			verdict: "text-red-500",
		},
	},
	defaultVariants: {
		variant: "good",
	},
});

export interface BadgeProps
	extends React.HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof badgeTv> {}

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
