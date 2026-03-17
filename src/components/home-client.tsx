"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { Metrics } from "@/components/metrics";
import { Button } from "@/components/ui/Button";
import { CodeEditor } from "@/components/ui/CodeEditor";
import { Toggle } from "@/components/ui/Toggle";
import { trpc } from "@/trpc/client";

interface HomeClientProps {
	children: ReactNode;
}

export function HomeClient({ children }: HomeClientProps) {
	const router = useRouter();
	const [roastMode, setRoastMode] = useState(false);
	const [code, setCode] = useState("");
	const isOverLimit = code.length > 10000;

	const createRoast = trpc.roast.createRoast.useMutation({
		onSuccess: (data) => {
			router.push(`/roast/${data.id}`);
		},
		onError: (error) => {
			alert(error.message);
		},
	});

	const handleRoast = () => {
		if (!code.trim()) return;
		createRoast.mutate({
			code,
			roastMode,
		});
	};

	return (
		<>
			{/* Hero */}
			<div className="flex flex-col gap-3 items-center">
				<h1 className="flex items-center gap-3 font-bold font-mono text-[#fafafa] text-[36px] ">
					<span className="text-primary">&gt;</span>
					paste your code. get roasted.
				</h1>
				<p className="font-mono text-gray-500 text-sm">
					{" //"} drop your code below and we&apos;ll rate it &mdash; brutally
					honest or full roast mode
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
				<Button
					disabled={isOverLimit || createRoast.isPending}
					variant="default"
					className="cursor-pointer"
					onClick={handleRoast}
				>
					{createRoast.isPending ? "roasting..." : "$ roast_my_code"}
				</Button>
			</div>

			{/* Stats Footer */}
			<Metrics />

			{/* Leaderboard Preview */}
			{children}
		</>
	);
}
