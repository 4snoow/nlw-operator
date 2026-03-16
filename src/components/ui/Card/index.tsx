import { Badge } from "../Badge";
import { cardTv } from "./card.styles";
import type { CardProps } from "./card.types";

export function Card({
	className,
	variant,
	title,
	description,
	...props
}: CardProps) {
	return (
		<div className={cardTv({ variant, className })} {...props}>
			<div className="flex items-center gap-2">
				<Badge variant={variant}>{variant}</Badge>
			</div>
			<p className="font-mono text-[#fafafa] text-[13px]">{title}</p>
			<p className="font-mono text-[#6b7280] text-xs leading-relaxed">
				{description}
			</p>
		</div>
	);
}

export type { CardProps };
