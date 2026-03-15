import {
	boolean,
	doublePrecision,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const roastStatusEnum = pgEnum("roast_status", [
	"critical",
	"needs_serious_help",
	"warning",
	"good",
]);

export const codes = pgTable("codes", {
	id: uuid("id").defaultRandom().primaryKey(),
	code: text("code").notNull(),
	language: text("language").notNull(),
	status: roastStatusEnum("status").notNull(),
	score: doublePrecision("score").notNull(),
	roast: text("roast").notNull(),
	roastMode: boolean("roast_mode").notNull().default(false),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const stats = pgTable("stats", {
	id: integer("id").primaryKey(),
	totalRoasted: integer("total_roasted").notNull().default(0),
	avgScore: doublePrecision("avg_score").notNull().default(0),
});

export type Code = typeof codes.$inferSelect;
export type NewCode = typeof codes.$inferInsert;
export type Stats = typeof stats.$inferSelect;
export type NewStats = typeof stats.$inferInsert;
