import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/ui/navbar";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
	title: "NLW Operator",
	description: "NLW para treinar o uso de IAS com Next.js",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR" className={jetbrainsMono.variable}>
			<body className="min-h-screen bg-bg-page">
				<Navbar />
				{children}
			</body>
		</html>
	);
}
