import "dotenv/config";
import { faker } from "@faker-js/faker";
import { eq, sql } from "drizzle-orm";
import { db } from "./index";
import { codes, stats } from "./schema";

const LANGUAGES = [
	"javascript",
	"typescript",
	"python",
	"rust",
	"go",
	"java",
	"cpp",
	"c",
	"csharp",
	"php",
	"ruby",
	"swift",
	"kotlin",
	"sql",
	"html",
	"css",
	"json",
	"yaml",
	"bash",
];

const ROAST_TEMPLATES = {
	critical: [
		"This code looks like it was written during a power outage in 2005.",
		"I've seen better code in a Hello World tutorial.",
		"This is what happens when you let AI write code without supervision.",
		"Congratulations, you've invented a new programming language: GarbageScript.",
		"This code is so bad it made my compiler cry.",
		"Warning: Code quality below acceptable levels. Do not operate heavy machinery.",
		"If this code were a movie, it would be a horror film.",
		"I've seen more structure in a bowl of spaghetti.",
		"Please tell me this is satire and you're actually a good developer.",
		"This code is an insult to every developer who ever lived.",
	],
	needs_serious_help: [
		"This code needs more than just a code review, it needs therapy.",
		"The person who wrote this needs to go back to basics.",
		"I've seen better solutions in debug comments.",
		"This is like using a sledgehammer to crack a nut, but somehow still missing.",
		"The indentation is giving me schizophrenia.",
		"Somebody please think of the maintainers.",
		"This works, but at what cost? At what COST?",
		"The variable names are more confusing than the logic itself.",
		"It's functional, but the ghosts of developers past are weeping.",
		"Please, for the love of all that is holy, add some comments.",
	],
	warning: [
		"This code works, but barely passes the vibe check.",
		"I've seen cleaner code in production, but not by much.",
		"Not terrible, but definitely not winning any awards.",
		"This is technical debt in its most honest form.",
		"The complexity is... concerning, but manageable.",
		"It's like a diamond in the rough, if the rough was made of coal.",
		"Some assembly required. Documentation not included.",
		"It compiles, ship it! (Please don't actually do this)",
		"A hint of cleverness, buried under layers of confusion.",
		"Works on my machine, might work elsewhere with prayer.",
	],
	good: [
		"Decent code. Someone actually cared about quality here.",
		"Not perfect, but solid work. Well done.",
		"This is the kind of code that doesn't make you want to quit.",
		"Clean, readable, and actually makes sense. Rare!",
		"Boring code is good code. You've nailed it.",
		"Someone learned from their elders. Respect.",
		"This is what happens when you think before you type.",
		"No red flags. I'm genuinely surprised.",
		"Good job! Don't let it go to your head though.",
		"Quality code that doesn't make me question my career choice.",
	],
};

const CODE_SAMPLES: Record<string, string[]> = {
	javascript: [
		"function calculateTotal(items) { return items.reduce((a, b) => a + b.price, 0); }",
		"const fetchData = async () => { const res = await fetch(url); return res.json(); };",
		"document.querySelectorAll('.btn').forEach(btn => btn.addEventListener('click', handler));",
		"const [state, setState] = useState(initialValue);",
		"export default function App() { return <div>Hello World</div>; }",
	],
	typescript: [
		"interface User { id: number; name: string; email: string; }",
		"const processData = (data: InputType): OutputType => { return transform(data); };",
		"type Result<T> = { success: true; data: T } | { success: false; error: string };",
		"async function fetchUser(id: string): Promise<User | null> { ... }",
		"const handleSubmit = (e: FormEvent<HTMLFormElement>): void => { ... }",
	],
	python: [
		"def process_data(items: list[dict]) -> dict: return sum(item['value'] for item in items)",
		"class DataProcessor: def __init__(self, data): self.data = data",
		"async def fetch_data(url: str) -> dict: async with aiohttp.ClientSession() as session: ...",
		"result = [x for x in items if x['active'] == True]",
		"@dataclass class User: name: str; email: str; age: int",
	],
	rust: [
		"fn process_data(items: Vec<Item>) -> Result<u32, Error> { items.iter().sum() }",
		"let mut counter = 0; for item in &items { counter += item.value; }",
		"pub struct User { pub id: u64, pub name: String, pub email: String }",
		"impl Handler for MyHandler { fn handle(&self, req: Request) -> Response { ... } }",
		"async fn fetch_data(url: &str) -> Result<String, reqwest::Error> { ... }",
	],
	go: [
		"func processItems(items []Item) int { total := 0; for _, item := range items { total += item.Value } return total }",
		'type User struct { ID int64 `json:"id"`; Name string `json:"name"` }',
		"func fetchData(ctx context.Context, url string) ([]byte, error) { ... }",
		"wg := &sync.WaitGroup{}; wg.Add(1); go worker(wg)",
		"defer func() { if r := recover(); r != nil { log.Error(r) } }()",
	],
	java: [
		"public int calculateTotal(List<Item> items) { return items.stream().mapToInt(Item::getPrice).sum(); }",
		"public class UserService { private final UserRepository repository; public User findById(Long id) { ... } }",
		"@Component public class DataProcessor { @Autowired private JdbcTemplate jdbc; }",
		"public Optional<User> findByEmail(String email) { return repository.findByEmail(email); }",
		"public interface UserRepository extends JpaRepository<User, Long> { ... }",
	],
	cpp: [
		"int calculateTotal(const std::vector<Item>& items) { int sum = 0; for (const auto& item : items) sum += item.price; return sum; }",
		"class UserManager { public: void addUser(const User& user); private: std::vector<User> users_; };",
		"std::future<int> asyncProcess(const std::string& input) { return std::async(processData, input); }",
		"template<typename T> T max(T a, T b) { return a > b ? a : b; }",
		'int main() { std::cout << "Hello, World!" << std::endl; return 0; }',
	],
	sql: [
		"SELECT u.name, COUNT(o.id) as orders FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.id;",
		"SELECT p.name, SUM(o.quantity * p.price) as total FROM products p JOIN orders o ON p.id = o.product_id GROUP BY p.name;",
		"INSERT INTO users (name, email, created_at) VALUES ('John', 'john@example.com', NOW());",
		"UPDATE users SET last_login = NOW() WHERE id = 1; DELETE FROM sessions WHERE expires_at < NOW();",
		"CREATE INDEX idx_users_email ON users(email); CREATE TABLE IF NOT EXISTS orders (id SERIAL PRIMARY KEY, user_id INT REFERENCES users(id));",
	],
	html: [
		'<div class="container"><header><nav><ul><li><a href="/">Home</a></li></ul></nav></header><main></main></div>',
		'<form action="/submit" method="POST"><input type="text" name="username" required><button type="submit">Submit</button></form>',
		'<div class="card"><img src="image.jpg" alt="Description"><h3>Title</h3><p>Content</p></div>',
		'<meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="style.css">',
		'<script src="app.js" defer></script><style>body { margin: 0; }</style>',
	],
	css: [
		".container { display: flex; justify-content: center; align-items: center; gap: 1rem; }",
		".btn { background: #007bff; color: white; padding: 0.5rem 1rem; border-radius: 4px; }",
		"@media (max-width: 768px) { .menu { display: none; } }",
		"* { box-sizing: border-box; margin: 0; padding: 0; }",
		".card { background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }",
	],
};

function getRandomElement<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomCode(language: string): string {
	const samples = CODE_SAMPLES[language] || CODE_SAMPLES.javascript;
	const code = getRandomElement(samples);
	const lines = code.split("\n").length;

	if (lines > 3 && Math.random() > 0.5) {
		return code.split("\n").slice(0, 2).join("\n") + "\n  // ... more code";
	}

	return code;
}

function generateRoast(status: keyof typeof ROAST_TEMPLATES): string {
	const templates = ROAST_TEMPLATES[status];
	const template = getRandomElement(templates);

	const extensions = [
		"",
		" 🤡",
		" 😅",
		" 🙃",
		" 💀",
		" 🚩",
		" please...",
		" just why?",
		" I'm begging you",
		" seriously though",
	];

	return template + getRandomElement(extensions);
}

function getRandomStatus(): {
	status: keyof typeof ROAST_TEMPLATES;
	score: number;
} {
	const rand = Math.random();

	if (rand < 0.15) {
		return {
			status: "critical",
			score: Number((Math.random() * 2).toFixed(1)),
		};
	} else if (rand < 0.35) {
		return {
			status: "needs_serious_help",
			score: Number((2 + Math.random() * 2).toFixed(1)),
		};
	} else if (rand < 0.6) {
		return {
			status: "warning",
			score: Number((4 + Math.random() * 2).toFixed(1)),
		};
	} else {
		return {
			status: "good",
			score: Number((6 + Math.random() * 4).toFixed(1)),
		};
	}
}

function getRandomDate(daysAgo: number): Date {
	const date = new Date();
	date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
	date.setHours(Math.floor(Math.random() * 24));
	date.setMinutes(Math.floor(Math.random() * 60));
	return date;
}

async function seedFull() {
	console.log("🌱 Generating fake roasts...");

	const totalToGenerate = 100;
	const batches = Math.ceil(totalToGenerate / 20);

	for (let batch = 0; batch < batches; batch++) {
		const batchSize = Math.min(20, totalToGenerate - batch * 20);
		const roastData = [];

		for (let i = 0; i < batchSize; i++) {
			const language = getRandomElement(LANGUAGES);
			const { status, score } = getRandomStatus();

			roastData.push({
				code: getRandomCode(language),
				language,
				status,
				score,
				roast: generateRoast(status),
				roastMode: Math.random() > 0.3,
				createdAt: getRandomDate(30),
			});
		}

		await db.insert(codes).values(roastData);
		console.log(
			`✅ Inserted batch ${batch + 1}/${batches} (${batchSize} roasts)`,
		);
	}

	// Update stats
	const allCodes = await db
		.select({
			count: sql<number>`count(*)`,
			avgScore: sql<number>`avg(${codes.score})`,
		})
		.from(codes);

	const totalRoasted = allCodes[0]?.count || 0;
	const avgScore = Number(allCodes[0]?.avgScore?.toFixed(1) || 0);

	await db
		.update(stats)
		.set({
			totalRoasted,
			avgScore,
		})
		.where(eq(stats.id, 1));

	console.log(
		`\n📊 Stats updated: ${totalRoasted} roasts, avg score: ${avgScore}/10`,
	);
	console.log("🌱 Seeding complete!");
}

seedFull()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error("❌ Seed failed:", err);
		process.exit(1);
	});
