"use client";

import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { cn } from "@/lib/utils";
import { toggleTv } from "./toggle.styles";
import type { ToggleProps } from "./toggle.types";

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
			disabled={props.disabled}
		>
			<span
				className={cn(
					"flex h-[22px] w-[40px] items-center rounded-[11px] p-[3px] transition-colors",
					checked ? "bg-primary" : "bg-[#2a2a2a]",
				)}
			>
				<span
					className={cn(
						"h-4 w-4 rounded-full transition-transform",
						checked
							? "translate-x-[18px] bg-[#0a0a0a]"
							: "translate-x-0 bg-[#6b7280]",
					)}
				/>
			</span>
			{children}
		</BaseToggle>
	);
}

export type { ToggleProps };
