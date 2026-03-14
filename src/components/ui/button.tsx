import { tv, type VariantProps } from "tailwind-variants";

const buttonTv = tv({
	base: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-[13px] font-[500] font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			destructive:
				"bg-destructive text-destructive-foreground hover:bg-destructive/90",
			outline:
				"border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline",
		},
		size: {
			default: "h-10 px-6 py-2.5",
			sm: "h-9 px-3",
			lg: "h-11 px-8",
			icon: "h-10 w-10",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonTv> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
	return (
		<button className={buttonTv({ variant, size, className })} {...props} />
	);
}
