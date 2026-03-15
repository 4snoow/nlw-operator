import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { TableRow } from "@/components/ui/table-row";
import { Toggle } from "@/components/ui/toggle";

export default function ComponentsPage() {
	return (
		<main className="min-h-screen p-8">
			<h1 className="mb-8 font-bold text-3xl">Componentes UI</h1>

			{/* Button Section */}
			<section className="mb-12">
				<h2 className="mb-4 font-semibold text-2xl">Button</h2>

				{/* Variants */}
				<div className="mb-6 space-y-4">
					<h3 className="font-medium text-lg">Variantes</h3>
					<div className="flex flex-wrap gap-4">
						<Button variant="default">roast_my_code</Button>
						<Button variant="outline">share_roast</Button>
						<Button variant="link">view_all &gt;&gt;</Button>
					</div>
				</div>

				{/* Sizes */}
				<div className="space-y-4">
					<h3 className="font-medium text-lg">Tamanhos</h3>
					<div className="flex flex-wrap items-center gap-4">
						<Button size="sm">Small</Button>
						<Button size="default">Default</Button>
						<Button size="lg">Large</Button>
						<Button size="icon">+</Button>
					</div>
				</div>
			</section>

			{/* Badge Section */}
			<section className="mb-12">
				<h2 className="mb-4 font-semibold text-2xl">Badge</h2>

				<div className="space-y-4">
					<h3 className="font-medium text-lg">Variantes</h3>
					<div className="flex flex-wrap items-center gap-6">
						<Badge variant="critical">critical</Badge>
						<Badge variant="warning">warning</Badge>
						<Badge variant="good">good</Badge>
						<Badge variant="verdict">needs_serious_help</Badge>
					</div>
				</div>
			</section>

			{/* Toggle Section */}
			<section className="mb-12">
				<h2 className="mb-4 font-semibold text-2xl">Toggle</h2>

				<div className="space-y-4">
					<h3 className="font-medium text-lg">Estados</h3>
					<div className="flex flex-wrap items-center gap-8">
						<Toggle checked={true}>roast mode</Toggle>
						<Toggle checked={false}>roast mode</Toggle>
					</div>
				</div>
			</section>

			{/* Card Section */}
			<section className="mb-12">
				<h2 className="mb-4 font-semibold text-2xl">Card</h2>

				<div className="space-y-4">
					<h3 className="font-medium text-lg">Variantes</h3>
					<div className="flex flex-wrap gap-6">
						<Card
							variant="good"
							title="using var instead of const/let"
							description="the var keyword is function-scoped rather than block-scoped, which can lead to unexpected behavior and bugs. modern javascript uses const for immutable bindings and let for mutable ones."
						/>
					</div>
				</div>
			</section>

			{/* DiffLine Section */}
			<section className="mb-12">
				<h2 className="mb-4 font-semibold text-2xl">DiffLine</h2>

				<div className="space-y-4">
					<h3 className="font-medium text-lg">Tipos</h3>
					<div className="flex w-full max-w-140 flex-col gap-1">
						<DiffLine type="removed" code="var total = 0;" />
						<DiffLine type="added" code="const total = 0;" />
						<DiffLine
							type="context"
							code="for (let i = 0; i < items.length; i++) {"
						/>
					</div>
				</div>
			</section>

			{/* TableRow Section */}
			<section className="mb-12">
				<h2 className="mb-4 font-semibold text-2xl">TableRow</h2>

				<div className="space-y-4">
					<h3 className="font-medium text-lg">Exemplo</h3>
					<div className="w-full max-w-3xl overflow-hidden rounded border border-border-primary">
						<TableRow rank={1} score={2.1} language="javascript" />
						<TableRow rank={2} score={5.8} language="typescript" />
						<TableRow rank={3} score={8.4} language="typescript" />
					</div>
				</div>
			</section>

			{/* ScoreRing Section */}
			<section className="mb-12">
				<h2 className="mb-4 font-semibold text-2xl">ScoreRing</h2>

				<div className="space-y-4">
					<h3 className="font-medium text-lg">Scores</h3>
					<div className="flex flex-wrap items-center gap-8">
						<ScoreRing score={1.0} />
						<ScoreRing score={5.5} />
						<ScoreRing score={8.0} />
					</div>
				</div>
			</section>

			{/* CodeBlock Section */}
			<section className="mb-12">
				<h2 className="mb-4 font-semibold text-2xl">CodeBlock</h2>

				<div className="space-y-4">
					<h3 className="font-medium text-lg">Exemplo</h3>
					<CodeBlock
						filename="calculate.js"
						code={`function calculateTotal(items) {
  return items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
}`}
						lang="javascript"
					/>
				</div>
			</section>
		</main>
	);
}
