"use client";

import { toPng } from "html-to-image";
import { useEffect, useRef, useState } from "react";
import { createHighlighter, type Highlighter } from "shiki";
import { tv, type VariantProps } from "tailwind-variants";
import { Button } from "./button";

const codeEditorTv = tv({
	base: "flex flex-col gap-3 rounded-lg border border-border-primary bg-bg-input overflow-hidden",
	variants: {
		size: {
			sm: "max-w-[400px]",
			md: "max-w-[560px]",
			lg: "max-w-[720px]",
			full: "max-w-full",
		},
		height: {
			sm: "h-[200px]",
			md: "h-[300px]",
			lg: "h-[400px]",
			xl: "h-[500px]",
		},
	},
	defaultVariants: {
		size: "md",
		height: "md",
	},
});

const LANGUAGES = [
	{ value: "auto", label: "Auto" },
	{ value: "javascript", label: "JavaScript" },
	{ value: "typescript", label: "TypeScript" },
	{ value: "python", label: "Python" },
	{ value: "rust", label: "Rust" },
	{ value: "go", label: "Go" },
	{ value: "java", label: "Java" },
	{ value: "cpp", label: "C++" },
	{ value: "c", label: "C" },
	{ value: "csharp", label: "C#" },
	{ value: "php", label: "PHP" },
	{ value: "ruby", label: "Ruby" },
	{ value: "swift", label: "Swift" },
	{ value: "kotlin", label: "Kotlin" },
	{ value: "sql", label: "SQL" },
	{ value: "html", label: "HTML" },
	{ value: "css", label: "CSS" },
	{ value: "json", label: "JSON" },
	{ value: "yaml", label: "YAML" },
	{ value: "markdown", label: "Markdown" },
	{ value: "bash", label: "Bash" },
	{ value: "shell", label: "Shell" },
] as const;

const THEMES = [
	{ value: "vesper", label: "Vesper", dark: true },
	{ value: "github-dark", label: "GitHub Dark", dark: true },
	{ value: "github-light", label: "GitHub Light", dark: false },
	{ value: "dracula", label: "Dracula", dark: true },
	{ value: "nord", label: "Nord", dark: true },
	{ value: "one-dark-pro", label: "One Dark", dark: true },
	{ value: "catppuccin-mocha", label: "Catppuccin", dark: true },
] as const;

const FONTS = [
	{
		value: "jetbrains-mono",
		label: "JetBrains Mono",
		family: "'JetBrains Mono', monospace",
	},
	{ value: "fira-code", label: "Fira Code", family: "'Fira Code', monospace" },
	{
		value: "source-code-pro",
		label: "Source Code Pro",
		family: "'Source Code Pro', monospace",
	},
	{ value: "monaco", label: "Monaco", family: "'Monaco', monospace" },
	{
		value: "ubuntu-mono",
		label: "Ubuntu Mono",
		family: "'Ubuntu Mono', monospace",
	},
	{
		value: "cascadia-code",
		label: "Cascadia Code",
		family: "'Cascadia Code', monospace",
	},
] as const;

const LANGUAGE_KEYWORDS: Record<string, string[]> = {
	javascript: [
		"function",
		"const",
		"let",
		"var",
		"=>",
		"async",
		"await",
		"import",
		"export",
		"require",
		"console",
		"document",
		"window",
	],
	typescript: [
		"interface",
		"type",
		"enum",
		"namespace",
		": string",
		": number",
		": boolean",
		"as const",
		"import type",
	],
	python: [
		"def ",
		"class ",
		"import ",
		"from ",
		"self.",
		"elif ",
		"print(",
		"__init__",
		"lambda",
		"async def",
	],
	rust: [
		"fn ",
		"let mut",
		"impl ",
		"pub ",
		"struct ",
		"enum ",
		"use ",
		"mod ",
		"match ",
		"->",
		"::",
		"unwrap",
	],
	go: [
		"func ",
		"package ",
		"import ",
		"type ",
		"struct ",
		"interface ",
		"go ",
		"defer ",
		"chan ",
		"range ",
		":= ",
	],
	java: [
		"public class",
		"private ",
		"protected ",
		"void ",
		"static ",
		"final ",
		"extends ",
		"implements ",
		"System.out",
	],
	cpp: [
		"#include",
		"std::",
		"cout",
		"cin",
		"endl",
		"namespace ",
		"template<",
		"virtual ",
		"nullptr",
	],
	c: [
		"#include",
		"printf",
		"scanf",
		"malloc",
		"free",
		"sizeof",
		"typedef",
		"struct ",
		"NULL",
	],
	php: [
		"<?php",
		"echo ",
		"function ",
		"class ",
		"public ",
		"private ",
		"protected ",
		"use ",
		"namespace ",
	],
	sql: [
		"SELECT",
		"FROM",
		"WHERE",
		"INSERT",
		"UPDATE",
		"DELETE",
		"JOIN",
		"CREATE",
		"ALTER",
		"DROP",
		"TABLE",
	],
	html: [
		"<!DOCTYPE",
		"<html",
		"<head",
		"<body",
		"<div",
		"<span",
		"<script",
		"<style",
		"<link",
	],
	css: [
		"@media",
		"@import",
		"@keyframes",
		"margin:",
		"padding:",
		"display:",
		"position:",
		"flex",
		"grid",
	],
	json: ['{"', '"}', '": ', "[]", "true", "false", "null"],
	yaml: ["---", "- ", ": ", "true", "false", "null"],
	bash: [
		"#!/bin/bash",
		"echo ",
		"if [",
		"fi",
		"then",
		"else",
		"for ",
		"done",
		"export ",
		"source ",
	],
	shell: ["#!/bin/sh", "echo ", "if [", "fi", "then", "else", "for ", "done"],
};

function detectLanguage(code: string): string {
	const scores: Record<string, number> = {};

	for (const [lang, keywords] of Object.entries(LANGUAGE_KEYWORDS)) {
		scores[lang] = 0;
		for (const keyword of keywords) {
			if (code.includes(keyword)) {
				scores[lang]++;
			}
		}
	}

	let maxScore = 0;
	let detected = "javascript";

	for (const [lang, score] of Object.entries(scores)) {
		if (score > maxScore) {
			maxScore = score;
			detected = lang;
		}
	}

	return detected;
}

interface CodeEditorProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof codeEditorTv> {
	initialCode?: string;
	showControls?: boolean;
}

export function CodeEditor({
	initialCode = "",
	showControls = true,
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
		setCode(e.target.value);
	};

	return (
		<div className={codeEditorTv({ size, height, className })} {...props}>
			{showControls && (
				<div className="flex flex-wrap items-center gap-2 border-border-primary border-b bg-bg-input p-3">
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

					<div className="flex-1" />

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
						className="font-mono text-white text-xs"
					>
						{copied ? "copied!" : "copy"}
					</Button>

					<Button
						size="sm"
						variant="default"
						onClick={handleExport}
						disabled={isExporting}
						className="font-mono text-xs"
					>
						{isExporting ? "exporting..." : "png"}
					</Button>
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
