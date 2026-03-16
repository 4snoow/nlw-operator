import { buttonTv } from "./button.styles";
import type { ButtonProps } from "./button.types";

export function Button({ className, variant, size, ...props }: ButtonProps) {
	return (
		<button className={buttonTv({ variant, size, className })} {...props} />
	);
}

export type { ButtonProps };
