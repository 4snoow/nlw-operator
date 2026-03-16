import { tv } from "tailwind-variants";

export const codeEditorTv = tv({
	base: "flex flex-col gap-3 rounded-lg border border-border-primary bg-bg-input overflow-hidden",
	variants: {
		size: {
			sm: "max-w-[400px]",
			md: "max-w-[560px]",
			lg: "max-w-[720px]",
			full: "max-w-full",
		},
		height: {
			fit: "h-fit",
			sm: "h-[200px]",
			md: "h-[300px]",
			lg: "h-[400px]",
			xl: "h-[500px]",
		},
	},
	defaultVariants: {
		size: "md",
		height: "md",
	},
});
