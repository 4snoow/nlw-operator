# Especificação do Banco de Dados - Drizzle ORM

## Visão Geral

- **Banco**: PostgreSQL com Docker Compose
- **ORM**: Drizzle ORM
- **Sem autenticação**: Sistema anônimo

## Enum

### roast_status

Status do código baseado no score.

| Valor | Score | Descrição |
|-------|-------|-----------|
| `critical` | 0-2 | Crítico - código horrível |
| `needs_serious_help` | 2-4 | Precisa de ajuda séria |
| `warning` | 4-6 | Atenção -代码问题 |
| `good` | 6-10 | Bom - código aceitável |

## Tabelas

### 1. `codes`

Tabela principal que armazena os códigos submetidos para análise.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` | ID único do registro |
| `code` | `text` | Código fonte submetido |
| `language` | `text` | Linguagem detectada/selecionada |
| `status` | `roast_status` | Status do roast (critical, needs_serious_help, warning, good) |
| `score` | `double precision` | Score de roast (0-10) |
| `roast` | `text` | Feedback/roast gerado |
| `roast_mode` | `boolean` | Se modo roast estava ativo |
| `created_at` | `timestamp` | Data de criação |

### 2. `stats`

Estatísticas globais do sistema.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `integer` | Sempre 1 (single row) |
| `total_roasted` | `integer` | Total de códigos processados |
| `avg_score` | `double precision` | Score médio |

## Estrutura de Arquivos

```
src/
├── db/
│   ├── index.ts        # Conexão com banco
│   ├── schema.ts       # Definição das tabelas
│   └── migrations/     # Migrações Drizzle
├── lib/
│   └── db.ts           # Instância do banco
```

## To-Dos

- [ ] Configurar Docker Compose com PostgreSQL
- [ ] Instalar dependências: `drizzle-orm`, `drizzle-kit`, `pg`
- [ ] Criar arquivo `src/db/schema.ts` com definições de tabelas
- [ ] Criar arquivo `src/db/index.ts` com conexão
- [ ] Configurar `drizzle.config.ts`
- [ ] Criar script de migração inicial
- [ ] Criar seed com dados iniciais (estatísticas)
- [ ] Criar repository/queries para CRUD
- [ ] Integrar com homepage para salvar códigos

## Docker Compose

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16
    container_name: devroast-db
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Drizzle Config

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env DATABASE_URL!,
  },
});
```

## Variáveis de Ambiente

```
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```
