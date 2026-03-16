import type { VariantProps } from "tailwind-variants";
import type { diffLineTv } from "./diff-line.styles";

export interface DiffLineProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof diffLineTv> {
	type: "removed" | "added" | "context";
	code: string;
}
