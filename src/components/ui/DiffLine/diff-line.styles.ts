import { tv } from "tailwind-variants";

export const diffLineTv = tv({
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
