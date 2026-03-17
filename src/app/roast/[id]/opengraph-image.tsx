import { ImageResponse } from "@takumi-rs/image-response";
import { db } from "@/db";
import { codes } from "@/db/schema";

export const runtime = "nodejs";
export const alt = "DevRoast - Code Review Results";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const codeEntry = await db.query.codes.findFirst({
		where: (codes, { eq }) => eq(codes.id, id),
	});

	if (!codeEntry) {
		return new ImageResponse(<Root>Roast not found</Root>, { ...size });
	}

	const roastData = JSON.parse(codeEntry.roast);
	const codeLines = codeEntry.code.split("\n").length;

	return new ImageResponse(
		<Root
			style={{ backgroundColor: "#0A0A0A" }}
			className="w-full h-full flex flex-col items-center justify-center p-16 gap-7"
		>
			{/* Logo */}
			<div className="flex items-center gap-2">
				<span
					className="text-[#10B981]"
					style={{
						fontSize: 24,
						fontWeight: 900,
						fontFamily: "JetBrains Mono",
					}}
				>
					&gt;
				</span>
				<span
					className="text-[#FAFAFA]"
					style={{ fontSize: 20, fontFamily: "JetBrains Mono" }}
				>
					devroast
				</span>
			</div>

			{/* Score */}
			<div className="flex items-baseline gap-1">
				<span
					className="text-[#F59E0B]"
					style={{ fontSize: 160, fontWeight: 900 }}
				>
					{roastData.score}
				</span>
				<span className="text-[#737373]" style={{ fontSize: 56 }}>
					/10
				</span>
			</div>

			{/* Verdict */}
			<div className="flex items-center gap-2">
				<div className="w-3 h-3 rounded-full bg-[#EF4444]" />
				<span className="text-[#EF4444]" style={{ fontSize: 20 }}>
					{codeEntry.status.replace("_", " ")}
				</span>
			</div>

			{/* Meta */}
			<span
				className="text-[#737373]"
				style={{ fontSize: 16, fontFamily: "JetBrains Mono" }}
			>
				lang: {codeEntry.language} · {codeLines} lines
			</span>

			{/* Quote */}
			<p
				className="text-[#FAFAFA] text-[22px] italic text-center leading-relaxed m-0"
				style={{ fontFamily: "IBM Plex Mono" }}
			>
				"{roastData.quote}"
			</p>
		</Root>,
		{ ...size, jsx: { tailwindClassesProperty: "className" } },
	);
}

function Root({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return <div {...props}>{children}</div>;
}
