export const LANGUAGES = [
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

export const THEMES = [
	{ value: "vesper", label: "Vesper", dark: true },
	{ value: "github-dark", label: "GitHub Dark", dark: true },
	{ value: "github-light", label: "GitHub Light", dark: false },
	{ value: "dracula", label: "Dracula", dark: true },
	{ value: "nord", label: "Nord", dark: true },
	{ value: "one-dark-pro", label: "One Dark", dark: true },
	{ value: "catppuccin-mocha", label: "Catppuccin", dark: true },
] as const;

export const FONTS = [
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

export const LANGUAGE_KEYWORDS: Record<string, string[]> = {
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

export const MAX_CODE_LENGTH = 2000;

export function detectLanguage(code: string): string {
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
