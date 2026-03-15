import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { stats } from "./schema";

async function seed() {
	console.log("🌱 Seeding database...");

	// Verificar se stats já existe
	const existingStats = await db
		.select()
		.from(stats)
		.where(eq(stats.id, 1))
		.limit(1);

	if (existingStats.length === 0) {
		await db.insert(stats).values({
			id: 1,
			totalRoasted: 0,
			avgScore: 0,
		});
		console.log("✅ Stats row created");
	} else {
		console.log("ℹ️ Stats already exists");
	}

	// Seed de exemplo de codes (opcional - para testing)
	const existingCodes = await db.select().from(stats);

	if (existingCodes.length > 0) {
		console.log(
			`📊 Current stats: ${existingCodes[0].totalRoasted} roasted, avg ${existingCodes[0].avgScore}`,
		);
	}

	console.log("🌱 Seeding complete!");
}

seed()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error("❌ Seed failed:", err);
		process.exit(1);
	});
