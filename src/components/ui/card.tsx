import { tv, type VariantProps } from "tailwind-variants";
import { Badge } from "@/components/ui/badge";

const cardTv = tv({
	base: "w-[480px] rounded border border-border-primary p-5 flex flex-col gap-3",
	variants: {
		variant: {
			critical: "border-border-primary",
			warning: "border-border-primary",
			good: "border-border-primary",
		},
	},
	defaultVariants: {
		variant: "critical",
	},
});

export interface CardProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardTv> {
	title: string;
	description: string;
}

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
