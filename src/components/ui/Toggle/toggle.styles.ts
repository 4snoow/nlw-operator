import { tv } from "tailwind-variants";

export const toggleTv = tv({
	base: "inline-flex items-center gap-3 cursor-pointer",
	variants: {
		checked: {
			true: "text-primary",
			false: "text-gray-500",
		},
	},
});
