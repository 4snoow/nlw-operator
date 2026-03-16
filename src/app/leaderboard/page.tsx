interface LeaderboardEntry {
	rank: number;
	score: number;
	language: string;
	lines: number;
	code: string;
}

const leaderboardData: LeaderboardEntry[] = [
	{
		rank: 1,
		score: 1.2,
		language: "javascript",
		lines: 3,
		code: `eval(prompt("enter code"))
document.write(response)
// trust the user lol`,
	},
	{
		rank: 2,
		score: 2.8,
		language: "typescript",
		lines: 3,
		code: `const x = 1;
export default x;`,
	},
	{
		rank: 3,
		score: 3.1,
		language: "sql",
		lines: 2,
		code: `DROP DATABASE prod;
-- oops`,
	},
	{
		rank: 4,
		score: 3.5,
		language: "java",
		lines: 3,
		code: `public class Main {
  public static void main(String[] args) {`,
	},
	{
		rank: 5,
		score: 3.9,
		language: "javascript",
		lines: 3,
		code: `function foo() {
  return 1;
}`,
	},
];

export default function LeaderboardPage() {
	return (
		<main className="flex min-h-[calc(100vh-56px)] flex-col gap-10 px-20 py-10 max-w-5xl mx-auto">
			<section className="flex flex-col gap-4">
				<div className="flex items-center gap-3">
					<span className="font-bold font-mono text-[32px] text-accent-green">
						&gt;
					</span>
					<h1 className="font-bold font-mono text-[28px] text-text-primary">
						shame_leaderboard
					</h1>
				</div>
				<p className="font-mono text-sm text-text-secondary">
					{/* the most roasted code on the internet */}
				</p>
				<div className="flex items-center gap-2 font-mono text-text-tertiary text-xs">
					<span>2,847 submissions</span>
					<span>·</span>
					<span>avg score: 4.2/10</span>
				</div>
			</section>

			<section className="flex w-full flex-col gap-5">
				{leaderboardData.map((entry) => (
					<LeaderboardEntry key={entry.rank} entry={entry} />
				))}
			</section>
		</main>
	);
}

function LeaderboardEntry({ entry }: { entry: LeaderboardEntry }) {
	const codeLines = entry.code.split("\n");

	return (
		<div className="flex flex-col rounded border border-border-primary ">
			<div className="flex h-12 items-center justify-between border-border-primary border-b px-5">
				<div className="flex items-center gap-4">
					<span className="flex items-center gap-1.5 font-mono text-sm text-text-tertiary">
						<span className="text-text-tertiary">#</span>
						<span
							className={
								entry.rank === 1 ? "font-bold text-accent-amber" : "font-normal"
							}
						>
							{entry.rank}
						</span>
					</span>
					<span className="flex items-center gap-1.5 font-mono text-text-tertiary text-xs">
						<span>score:</span>
						<span className="font-bold text-accent-red">{entry.score}</span>
					</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="font-mono text-text-secondary text-xs">
						{entry.language}
					</span>
					<span className="font-mono text-text-tertiary text-xs">
						{entry.lines} lines
					</span>
				</div>
			</div>
			<div className="flex h-[120px] bg-bg-input">
				<div className="flex w-10 flex-col items-end gap-1.5 border-border-primary border-r bg-bg-surface px-2.5 py-3 font-mono text-text-tertiary text-xs leading-normal">
					{Array.from({ length: codeLines.length }, (_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: line numbers are inherently stable
						<span key={i}>{i + 1}</span>
					))}
				</div>
				<div className="flex-1 overflow-x-auto p-4 font-mono text-text-primary text-xs leading-normal">
					{codeLines.map((line, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: line numbers are inherently stable
						<div key={i} className="leading-normal">
							{highlightCode(line, entry.language)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

function highlightCode(code: string, lang: string): React.ReactNode {
	const tokens = tokenizeCode(code, lang);
	return (
		<>
			{tokens.map((token, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: tokens are inherently stable
				<span key={i} className={token.className}>
					{token.text}
				</span>
			))}
		</>
	);
}

interface Token {
	text: string;
	className: string;
}

function tokenizeCode(code: string, lang: string): Token[] {
	const tokens: Token[] = [];

	const keywords: Record<string, string[]> = {
		javascript: [
			"const",
			"let",
			"var",
			"function",
			"return",
			"export",
			"default",
			"if",
			"else",
			"for",
			"while",
		],
		typescript: [
			"const",
			"let",
			"var",
			"function",
			"return",
			"export",
			"default",
			"if",
			"else",
			"for",
			"while",
			"interface",
			"type",
		],
		sql: [
			"DROP",
			"DATABASE",
			"SELECT",
			"FROM",
			"WHERE",
			"INSERT",
			"UPDATE",
			"DELETE",
			"CREATE",
			"TABLE",
		],
		java: [
			"public",
			"class",
			"private",
			"protected",
			"static",
			"void",
			"return",
			"if",
			"else",
			"for",
			"while",
			"new",
		],
	};

	const keywordList = keywords[lang] || keywords.javascript;

	let i = 0;
	while (i < code.length) {
		if (code[i] === '"' || code[i] === "'") {
			const quote = code[i];
			let j = i + 1;
			while (j < code.length && code[j] !== quote) {
				if (code[j] === "\\") j++;
				j++;
			}
			tokens.push({ text: code.slice(i, j + 1), className: "text-[#99ffe4]" });
			i = j + 1;
		} else if (code[i] === "/" && code[i + 1] === "/") {
			const comment = code.slice(i);
			tokens.push({ text: comment, className: "text-[#6b7280]" });
			break;
		} else if (/[a-zA-Z_]/.test(code[i])) {
			let j = i;
			while (j < code.length && /[a-zA-Z0-9_]/.test(code[j])) j++;
			const word = code.slice(i, j);
			const isKeyword = keywordList.some(
				(k) => k.toLowerCase() === word.toLowerCase(),
			);
			if (isKeyword) {
				tokens.push({ text: word, className: "text-[#ffc799]" });
			} else if (/^[0-9]+$/.test(word)) {
				tokens.push({ text: word, className: "text-[#ffc799]" });
			} else {
				tokens.push({ text: word, className: "text-white" });
			}
			i = j;
		} else if (/[0-9]/.test(code[i])) {
			let j = i;
			while (j < code.length && /[0-9]/.test(code[j])) j++;
			tokens.push({ text: code.slice(i, j), className: "text-[#ffc799]" });
			i = j;
		} else {
			tokens.push({ text: code[i], className: "text-[#a0a0a0]" });
			i++;
		}
	}

	return tokens;
}
