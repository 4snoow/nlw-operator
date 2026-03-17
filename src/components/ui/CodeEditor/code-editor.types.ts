import type { VariantProps } from "tailwind-variants";
import type { codeEditorTv } from "./code-editor.styles";

export interface CodeEditorProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof codeEditorTv> {
	initialCode?: string;
	showControls?: boolean;
	onCodeChange?: (code: string) => void;
	onLanguageChange?: (language: string) => void;
}
