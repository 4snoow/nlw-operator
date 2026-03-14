"use client";

import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const toggleTv = tv({
	base: "inline-flex items-center gap-3 cursor-pointer",
	variants: {
		checked: {
			true: "text-primary",
			false: "text-gray-500",
		},
	},
});

export interface ToggleProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof toggleTv> {
	pressed?: boolean;
	onPressedChange?: (pressed: boolean) => void;
}

export function Toggle({
	className,
	checked,
	onPressedChange,
	children,
	...props
}: ToggleProps) {
	return (
		<BaseToggle
			pressed={checked}
			onPressedChange={onPressedChange}
			className={toggleTv({ checked, className })}
			{...props}
			render={(renderProps, state) => (
				<button {...renderProps}>
					<span
						className={cn(
							"flex h-[22px] w-[40px] items-center rounded-[11px] p-[3px] transition-colors",
							state.pressed ? "bg-primary" : "bg-[#2a2a2a]",
						)}
					>
						<span
							className={cn(
								"h-4 w-4 rounded-full transition-transform",
								state.pressed
									? "translate-x-[18px] bg-[#0a0a0a]"
									: "translate-x-0 bg-[#6b7280]",
							)}
						/>
					</span>
					{children}
				</button>
			)}
		/>
	);
}
