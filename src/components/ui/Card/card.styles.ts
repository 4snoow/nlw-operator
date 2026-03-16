import { tv } from "tailwind-variants";

export const cardTv = tv({
	base: "max-w-[480px] rounded border border-border-primary p-5 flex flex-col gap-3",
	variants: {
		variant: {
			critical: "border-border-primary",
			warning: "border-border-primary",
			good: "border-border-primary",
		},
	},
	defaultVariants: {
		variant: "critical",
	},
});
