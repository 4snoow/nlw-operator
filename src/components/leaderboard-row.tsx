import { codeToHtml } from "shiki";
import { LeaderboardRowClient } from "./leaderboard-row-client";

interface LeaderboardRowProps {
	id: string;
	code: string;
	language: string;
	score: number;
	rank: number;
}

export async function LeaderboardRow({
	id,
	code,
	language,
	score,
	rank,
}: LeaderboardRowProps) {
	const codeLines = code.split("\n");
	const isLongCode = codeLines.length > 5;
	const codeTruncated = isLongCode ? codeLines.slice(0, 3).join("\n") : code;

	const [htmlFull, htmlTruncated] = await Promise.all([
		codeToHtml(code, { lang: language, theme: "vesper" }),
		codeToHtml(codeTruncated, { lang: language, theme: "vesper" }),
	]);

	return (
		<LeaderboardRowClient
			htmlFull={htmlFull}
			htmlTruncated={htmlTruncated}
			language={language}
			rank={rank}
			score={score}
			lines={codeLines.length}
			isLongCode={isLongCode}
		/>
	);
}
