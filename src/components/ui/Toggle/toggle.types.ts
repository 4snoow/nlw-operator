import type * as React from "react";
import type { VariantProps } from "tailwind-variants";
import type { toggleTv } from "./toggle.styles";

export interface ToggleProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value">,
		VariantProps<typeof toggleTv> {
	checked?: boolean;
	onPressedChange?: (pressed: boolean) => void;
}
