import type { VariantProps } from "tailwind-variants";
import type { cardTv } from "./card.styles";

export interface CardProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardTv> {
	title: string;
	description: string;
}
