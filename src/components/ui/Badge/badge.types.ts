import type { VariantProps } from "tailwind-variants";
import type { badgeTv } from "./badge.styles";

export interface BadgeProps
	extends React.HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof badgeTv> {}
