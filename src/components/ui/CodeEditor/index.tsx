"use client";

import { toPng } from "html-to-image";
import { useEffect, useRef, useState } from "react";
import { createHighlighter, type Highlighter } from "shiki";
import { Button } from "../Button";
import {
	detectLanguage,
	FONTS,
	LANGUAGES,
	MAX_CODE_LENGTH,
	THEMES,
} from "./code-editor.constants";
import { codeEditorTv } from "./code-editor.styles";
import type { CodeEditorProps } from "./code-editor.types";

export function CodeEditor({
	initialCode = "",
	showControls = true,
	onCodeChange,
	className,
	size,
	height,
	...props
}: CodeEditorProps) {
	const [code, setCode] = useState(initialCode);
	const [language, setLanguage] = useState("auto");
	const [detectedLanguage, setDetectedLanguage] = useState("javascript");
	const [theme, setTheme] =
		useState<(typeof THEMES)[number]["value"]>("vesper");
	const [font, setFont] =
		useState<(typeof FONTS)[number]["value"]>("jetbrains-mono");
	const [highlightedHtml, setHighlightedHtml] = useState("");
	const [copied, setCopied] = useState(false);
	const [isExporting, setIsExporting] = useState(false);
	const editorRef = useRef<HTMLDivElement>(null);
	const highlighterRef = useRef<Highlighter | null>(null);

	useEffect(() => {
		if (language === "auto") {
			const detected = detectLanguage(code);
			setDetectedLanguage(detected);
		}
	}, [code, language]);

	useEffect(() => {
		const initHighlighter = async () => {
			if (!highlighterRef.current) {
				highlighterRef.current = await createHighlighter({
					themes: THEMES.map((t) => t.value),
					langs: LANGUAGES.map((l) => l.value).filter((l) => l !== "auto"),
				});
			}
		};
		initHighlighter();
	}, []);

	useEffect(() => {
		const highlight = async () => {
			if (!highlighterRef.current || !code.trim()) {
				setHighlightedHtml("");
				return;
			}

			const lang = language === "auto" ? detectedLanguage : language;

			try {
				const html = highlighterRef.current.codeToHtml(code, {
					lang,
					theme,
				});
				setHighlightedHtml(html);
			} catch {
				const html = highlighterRef.current.codeToHtml(code, {
					lang: "text",
					theme,
				});
				setHighlightedHtml(html);
			}
		};

		highlight();
	}, [code, language, detectedLanguage, theme]);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleExport = async () => {
		if (!editorRef.current) return;

		setIsExporting(true);
		try {
			const dataUrl = await toPng(editorRef.current, {
				backgroundColor: "#111111",
				pixelRatio: 2,
			});

			const link = document.createElement("a");
			link.download = `code-${Date.now()}.png`;
			link.href = dataUrl;
			link.click();
		} catch (error) {
			console.error("Export failed:", error);
		} finally {
			setIsExporting(false);
		}
	};

	const _currentLang = language === "auto" ? detectedLanguage : language;
	const currentFont = FONTS.find((f) => f.value === font);
	const _isDarkTheme = THEMES.find((t) => t.value === theme)?.dark ?? true;

	const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newCode = e.target.value;
		setCode(newCode);
		onCodeChange?.(newCode);
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
		const textarea = e.target as HTMLTextAreaElement;
		const clipboardData = e.clipboardData.getData("text");
		const currentLength = code.length;
		const pasteLength = clipboardData.length;
		const totalLength =
			currentLength +
			pasteLength -
			textarea.selectionEnd +
			textarea.selectionStart;
		const exceededAmount = totalLength - MAX_CODE_LENGTH;

		if (exceededAmount > 0) {
			e.preventDefault();
			alert(
				`Character limit exceeded by ${exceededAmount.toLocaleString()} characters. Maximum allowed is ${MAX_CODE_LENGTH.toLocaleString()}.`,
			);
		}
	};

	const isOverLimit = code.length > MAX_CODE_LENGTH;
	const charsRemaining = MAX_CODE_LENGTH - code.length;

	return (
		<div className={codeEditorTv({ size, height, className })} {...props}>
			{showControls && (
				<div className="flex flex-col gap-2 w-full border-border-primary border-b">
					<div className="flex flex-wrap items-center gap-2  bg-bg-input p-3">
						<select
							value={language}
							onChange={(e) => setLanguage(e.target.value)}
							className="rounded border border-border-primary bg-bg-input px-2 py-1.5 font-mono text-gray-400 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						>
							{LANGUAGES.map((lang) => (
								<option key={lang.value} value={lang.value}>
									{lang.label}
								</option>
							))}
						</select>

						{language === "auto" && (
							<span className="font-mono text-gray-500 text-xs">
								detected: {detectedLanguage}
							</span>
						)}

						<div className="flex-1"></div>
						<select
							value={theme}
							onChange={(e) =>
								setTheme(e.target.value as (typeof THEMES)[number]["value"])
							}
							className="rounded border border-border-primary bg-bg-input px-2 py-1.5 font-mono text-gray-400 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						>
							{THEMES.map((t) => (
								<option key={t.value} value={t.value}>
									{t.label}
								</option>
							))}
						</select>

						<select
							value={font}
							onChange={(e) =>
								setFont(e.target.value as (typeof FONTS)[number]["value"])
							}
							className="rounded border border-border-primary bg-bg-input px-2 py-1.5 font-mono text-gray-400 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						>
							{FONTS.map((f) => (
								<option key={f.value} value={f.value}>
									{f.label}
								</option>
							))}
						</select>

						<Button
							size="sm"
							variant="outline"
							onClick={handleCopy}
							className="font-mono cursor-pointer text-white text-xs"
						>
							{copied ? "copied!" : "copy"}
						</Button>

						<Button
							size="sm"
							variant="default"
							onClick={handleExport}
							disabled={isExporting}
							className="font-mono cursor-pointer text-xs"
						>
							{isExporting ? "exporting..." : "png"}
						</Button>
					</div>
					<span
						className={`font-mono text-xs ${
							isOverLimit ? "text-red-500" : "text-gray-500 ml-auto"
						}`}
					>
						{Math.max(0, charsRemaining).toLocaleString()} /{" "}
						{MAX_CODE_LENGTH.toLocaleString()}
					</span>
				</div>
			)}

			<div className="relative overflow-y-auto" ref={editorRef}>
				<div className="flex">
					<div
						className="flex w-10 flex-shrink-0 flex-col gap-1.5 border-border-primary border-r bg-[#0a0a0a] px-2.5 py-3 text-right font-mono text-[13px] text-gray-500 leading-normal"
						style={{ fontFamily: currentFont?.family }}
					>
						{code.split("\n").map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: line numbers are inherently stable
							<span key={i}>{i + 1}</span>
						))}
					</div>
					<div className="relative flex-1 overflow-hidden">
						<div
							className="absolute inset-0 overflow-x-auto overflow-y-auto whitespace-pre p-3 font-mono text-[13px] leading-normal"
							style={{ fontFamily: currentFont?.family }}
						>
							{highlightedHtml ? (
								// biome-ignore lint/security/noDangerouslySetInnerHtml: shiki generates safe HTML
								<div dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
							) : (
								<code className="text-gray-600">paste your code here...</code>
							)}
						</div>
						<textarea
							value={code}
							onChange={handleCodeChange}
							onPaste={handlePaste}
							spellCheck={false}
							className="absolute inset-0 h-full w-full resize-none overflow-y-auto whitespace-pre bg-transparent p-3 font-mono text-[13px] text-transparent leading-normal caret-white outline-none"
							style={{ fontFamily: currentFont?.family }}
							placeholder="paste your code here..."
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export type { CodeEditorProps };
