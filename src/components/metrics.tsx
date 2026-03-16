"use client";

import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";
import { trpc } from "@/trpc/client";

export function MetricsSkeleton() {
	return (
		<div className="flex justify-center gap-6">
			<span className="font-mono text-gray-500 text-xs">--- codes roasted</span>
			<span className="font-mono text-gray-500 text-xs">·</span>
			<span className="font-mono text-gray-500 text-xs">avg score: -/-</span>
		</div>
	);
}

export function Metrics() {
	const { data } = trpc.metrics.getMetrics.useQuery();
	const [displayData, setDisplayData] = useState({
		totalRoasted: 0,
		avgScore: 0,
	});

	useEffect(() => {
		if (data) {
			setDisplayData(data);
		}
	}, [data]);

	if (!data) return <MetricsSkeleton />;

	return (
		<div className="flex justify-center gap-6">
			<span className="font-mono text-gray-500 text-xs">
				<NumberFlow value={displayData.totalRoasted} /> codes roasted
			</span>
			<span className="font-mono text-gray-500 text-xs">·</span>
			<span className="font-mono text-gray-500 text-xs">
				avg score:{" "}
				<NumberFlow
					value={displayData.avgScore}
					format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
				/>{" "}
				/10
			</span>
		</div>
	);
}
