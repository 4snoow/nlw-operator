import type { VariantProps } from "tailwind-variants";
import type { buttonTv } from "./button.styles";

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonTv> {}
