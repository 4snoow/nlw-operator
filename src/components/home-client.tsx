"use client";

import Link from "next/link";
import { useState } from "react";
import { Metrics } from "@/components/metrics";
import { Button } from "@/components/ui/Button";
import { CodeEditor } from "@/components/ui/CodeEditor";
import { Toggle } from "@/components/ui/Toggle";
import { TableRow } from "@/components/ui/table-row";

export function HomeClient() {
	const [roastMode, setRoastMode] = useState(false);
	const [code, setCode] = useState("");
	const isOverLimit = code.length > 10000;

	return (
		<main className="mx-auto flex max-w-5xl  flex-col gap-8 px-10 py-20">
			{/* Hero */}
			<div className="flex flex-col gap-3 items-center">
				<h1 className="flex items-center gap-3 font-bold font-mono text-[#fafafa] text-[36px] ">
					<span className="text-primary">&gt;</span>
					paste your code. get roasted.
				</h1>
				<p className="font-mono text-gray-500 text-sm">
					{'//'} drop your code below and we&apos;ll rate it &mdash; brutally honest or
					full roast mode
				</p>
			</div>

			{/* Code Input */}
			<CodeEditor
				size="full"
				height="lg"
				className="w-full"
				onCodeChange={setCode}
			/>

			{/* Actions Bar */}
			<div className="flex items-center justify-between">
				<Toggle checked={roastMode} onPressedChange={setRoastMode}>
					roast mode
				</Toggle>
				<Button disabled={isOverLimit} variant="default">
					$ roast_my_code
				</Button>
			</div>

			{/* Stats Footer */}
			<Metrics />

			{/* Leaderboard Preview */}
			<div className="flex flex-col gap-6">
				<div className="flex items-center justify-between">
					<div className="flex w-full items-center gap-2">
						<span className="font-mono text-accent-green text-sm font-bold">
							{'//'}
						</span>
						<h2 className="font-mono text-[#fafafa] text-md font-bold">
							shame_leaderboard
						</h2>
					<Link
						href="/leaderboard"
						className="flex items-center gap-1 rounded border border-border-primary px-3 py-1.5 font-mono text-gray-500 text-xs ml-auto"
					>
						$ view_all &gt;&gt;
					</Link>
					</div>
				</div>

				<p className="font-mono text-gray-500 text-sm">
					the worst code on the internet, ranked by shame
				</p>

				<div className="overflow-hidden rounded border border-border-primary">
					{/* Header */}
					<div className="flex h-10 items-center bg-bg-input px-5">
						<span className="w-[50px] font-medium font-mono text-gray-500 text-xs">
							#
						</span>
						<span className="w-[70px] font-medium font-mono text-gray-500 text-xs">
							score
						</span>
						<span className="flex-1 font-medium font-mono text-gray-500 text-xs">
							code
						</span>
						<span className="w-[100px] font-medium font-mono text-gray-500 text-xs">
							lang
						</span>
					</div>

					{/* Rows */}
					<TableRow rank={1} score={1.2} language="javascript">
						<div className="flex flex-col gap-0.5">
							<span className="text-[#fafafa]">
								eval(prompt(&quot;enter code&quot;))
							</span>
							<span className="text-[#fafafa]">document.write(response)</span>
							<span className="text-gray-500">{/* trust the user lol */}</span>
						</div>
					</TableRow>
					<TableRow rank={2} score={1.8} language="typescript">
						<div className="flex flex-col gap-0.5">
							<span className="text-[#fafafa]">
								if (x == true) {"{"} return true; {"}"}
							</span>
							<span className="text-[#fafafa]">
								else if (x == false) {"{"} return false; {"}"}
							</span>
							<span className="text-[#fafafa]">
								else {"{"} return !false; {"}"}
							</span>
						</div>
					</TableRow>
					<TableRow rank={3} score={2.1} language="sql">
						<div className="flex flex-col gap-0.5">
							<span className="text-[#fafafa]">
								SELECT * FROM users WHERE 1=1
							</span>
							<span className="text-gray-500">
								{/* TODO: add authentication */}
							</span>
						</div>
					</TableRow>
				</div>

				<p className="px-4 py-3 text-center font-mono text-gray-500 text-xs">
					showing top 3 of 2,847 · view full leaderboard &gt;&gt;
				</p>
			</div>
		</main>
	);
}
