import { tv } from "tailwind-variants";

export const badgeTv = tv({
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
