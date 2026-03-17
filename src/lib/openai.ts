import OpenAI from "openai";

export const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	timeout: 60000,
	maxRetries: 2,
});

interface RoastResponse {
	score: number;
	verdict: string;
	quote: string;
	issues: Issue[];
	diff: DiffLine[];
}

interface Issue {
	variant: "critical" | "warning" | "good";
	title: string;
	description: string;
}

interface DiffLine {
	type: "added" | "removed" | "context";
	code: string;
}

function getSystemPrompt(roastMode: boolean): string {
	const base = `You are an expert code reviewer. Analyze the following code and provide a detailed review in JSON format with exactly this structure:
{
  "score": number (0-10, 0=terrible, 10=perfect),
  "verdict": "critical" | "needs_serious_help" | "warning" | "good",
  "quote": "a short one-liner comment about the code",
  "issues": [{"variant": "critical" | "warning" | "good", "title": "issue title", "description": "detailed explanation"}],
  "diff": [{"type": "added" | "removed" | "context", "code": "line of code"}]
}`;

	if (roastMode) {
		return (
			base +
			"\n\nBe sarcastic, witty, and merciless but still technically accurate. Make it entertaining!"
		);
	}
	return (
		base +
		"\n\nBe constructive but honest. Focus on helping the developer improve."
	);
}

export type { RoastResponse, Issue, DiffLine };
export { getSystemPrompt };
