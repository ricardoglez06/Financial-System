# Financial System

A full-stack financial management application for tracking income, expenses, budgets, investments, and savings goals. Built with a decoupled client-server architecture featuring a React frontend and an Express.js API backed by PostgreSQL.

## Features

- **Dashboard** — Real-time financial overview with interactive charts showing cash flow trends, expense breakdown by category, and summary cards for total balance, income, expenses, and net flow.
- **Transactions** — Full CRUD with advanced filtering by date range, category, type, and amount. Supports pagination, sorting, and search.
- **Budgets** — Monthly budget limits per category with visual progress bars that change color based on spending status (healthy/warning/danger).
- **Investments** — Portfolio tracking for ETFs, stocks, bonds, crypto, and mutual funds with principal vs. current value comparisons and return calculations.
- **Savings Goals** — Goal setting with target amounts, progress tracking, and contribution management.
- **Recurring Transactions** — Automate regular income/expenses with configurable frequencies (daily, weekly, monthly, etc.).
- **Tax Reports** — Deductible transaction tracking with end-of-year tax summaries grouped by category.
- **Multi-Account Support** — Manage checking, savings, cash, credit, and investment accounts.
- **Dark Mode** — Full theme support with persistent preference.
- **Responsive Design** — Mobile-friendly interface with collapsible navigation.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, Radix UI primitives |
| **State Management** | Zustand, TanStack Query |
| **Charts** | Recharts |
| **Forms** | React Hook Form, Zod |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Authentication** | JWT (HttpOnly cookies) |
| **Validation** | Zod |
| **Deployment** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions |

## Project Structure

```
financial-system/
├── apps/
│   ├── api/                    # Express.js backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   ├── seed.ts         # Demo data seeder
│   │   │   └── migrations/     # Database migrations
│   │   └── src/
│   │       ├── config/         # App configuration, DB, logger
│   │       ├── controllers/    # Request handlers
│   │       ├── services/       # Business logic layer
│   │       ├── middlewares/    # Auth, validation, error handling
│   │       ├── routes/         # API route definitions
│   │       ├── utils/          # Helpers (CSV parser, etc.)
│   │       ├── app.ts          # Express app setup
│   │       └── server.ts       # Server entry point
│   │
│   └── web/                    # React frontend
│       └── src/
│           ├── components/
│           │   ├── ui/         # Reusable UI components
│           │   └── layout/     # App layout, sidebar, header
│           ├── pages/          # Route-level page components
│           ├── hooks/          # Custom React Query hooks
│           ├── stores/         # Zustand state stores
│           ├── lib/            # API client, utilities
│           ├── App.tsx         # Router configuration
│           └── main.tsx        # React entry point
│
├── packages/
│   └── shared/                 # Shared code between apps
│       ├── schemas/            # Zod validation schemas
│       ├── types/              # TypeScript interfaces
│       └── utils/              # Shared utility functions
│
├── .github/
│   └── workflows/
│       ├── ci.yml              # Lint, typecheck, test, build
│       └── deploy.yml          # Deployment pipeline
│
├── Dockerfile                  # Multi-stage Docker build
├── docker-compose.yml          # Local development stack
├── turbo.json                  # Turborepo task configuration
└── pnpm-workspace.yaml         # Monorepo workspace definition
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 15+ (or Docker)

### Installation

```bash
# Clone the repository
git clone https://github.com/ricardoglez06/Financial-System.git
cd Financial-System

# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate
```

### Database Setup

**Option 1: Using Docker**
```bash
docker compose up postgres -d
```

**Option 2: Using a local PostgreSQL instance**

Update `apps/api/.env` with your database credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/financial_db"
```

**Run migrations and seed:**
```bash
pnpm db:migrate
pnpm db:seed
```

### Running the Application

```bash
# Start both API and web dev servers
pnpm dev
```

- API: http://localhost:3000
- Web: http://localhost:5173

**Demo credentials:** `demo@example.com` / `Demo1234!`

### Environment Variables

Create `apps/api/.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_SECRET` | Secret for signing access tokens | — |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens | — |
| `PORT` | API server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |
| `LOG_LEVEL` | Winston logging level | `info` |

Create `apps/web/.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000/api` |

## API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login, returns JWT cookie |
| POST | `/api/auth/logout` | Clear auth cookies |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/refresh` | Refresh access token |

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | List with filters, pagination, sorting |
| POST | `/api/transactions` | Create transaction |
| GET | `/api/transactions/:id` | Get transaction details |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| POST | `/api/transactions/bulk` | Bulk create (CSV import) |

**Query parameters for GET /api/transactions:**
- `page`, `limit` — Pagination
- `type` — Filter by `INCOME`, `EXPENSE`, or `TRANSFER`
- `categoryId`, `accountId` — Filter by category or account
- `startDate`, `endDate` — Date range filter
- `minAmount`, `maxAmount` — Amount range filter
- `search` — Text search in description/notes
- `sortBy` — Sort field (`date`, `amount`, `createdAt`)
- `sortOrder` — Sort direction (`asc`, `desc`)

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List categories (filter by `type`) |
| POST | `/api/categories` | Create category |
| GET | `/api/categories/:id` | Get category details |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |

### Accounts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/accounts` | List accounts |
| POST | `/api/accounts` | Create account |
| GET | `/api/accounts/:id` | Get account details |
| PUT | `/api/accounts/:id` | Update account |
| DELETE | `/api/accounts/:id` | Delete account |

### Budgets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budgets` | List budgets (filter by `month`, `year`) |
| GET | `/api/budgets/summary` | Budget progress summary |
| POST | `/api/budgets` | Create budget |
| PUT | `/api/budgets/:id` | Update budget |
| DELETE | `/api/budgets/:id` | Delete budget |

### Investments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/investments` | List investments |
| GET | `/api/investments/summary` | Portfolio summary with returns |
| POST | `/api/investments` | Add investment |
| PUT | `/api/investments/:id` | Update investment |
| DELETE | `/api/investments/:id` | Delete investment |

### Savings Goals

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/savings-goals` | List goals |
| POST | `/api/savings-goals` | Create goal |
| PUT | `/api/savings-goals/:id` | Update goal |
| DELETE | `/api/savings-goals/:id` | Delete goal |
| POST | `/api/savings-goals/:id/contribute` | Add contribution |

### Recurring Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recurring` | List recurring transactions |
| POST | `/api/recurring` | Create recurring transaction |
| PUT | `/api/recurring/:id` | Update recurring transaction |
| DELETE | `/api/recurring/:id` | Delete recurring transaction |
| POST | `/api/recurring/:id/generate` | Manually generate next occurrence |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | Income, expenses, net flow for period |
| GET | `/api/analytics/cashflow` | Daily/weekly/monthly cash flow data |
| GET | `/api/analytics/categories` | Expense breakdown by category |
| GET | `/api/analytics/trends` | Month-over-month trends |
| GET | `/api/analytics/tax-report` | Deductible transactions summary |

## Database Schema

The application uses 8 core models:

```
User
├── id, email, passwordHash, createdAt, updatedAt
├── categories[]
├── transactions[]
├── budgets[]
├── investments[]
├── accounts[]
├── savingsGoals[]
└── recurring[]

Account
├── id, userId, name, type, balance, currency
└── transactions[]

Category
├── id, userId, name, type, colorHex, icon, parentId
├── transactions[]
├── budgets[]
└── children[] (self-relation)

Transaction
├── id, userId, accountId, categoryId, amount, type, date
├── description, notes, isDeductible, isRecurring, recurringId
└── Indexes: [userId, date], [userId, categoryId, date], [userId, type, date]

RecurringTransaction
├── id, userId, accountId, categoryId, amount, type, frequency
├── startDate, endDate, description, isDeductible, isActive, lastGenerated
└── transactions[]

Budget
├── id, userId, categoryId, monthlyLimit, month, year
└── Unique: [userId, categoryId, month, year]

Investment
├── id, userId, name, type, ticker, principal, currentYield, currentValue
├── purchaseDate, notes

SavingsGoal
├── id, userId, name, targetAmount, currentAmount, targetDate
```

## Deployment

### Docker Compose (Production)

```bash
# Build and start all services
docker compose up -d --build

# View logs
docker compose logs -f
```

The stack includes:
- **postgres** — PostgreSQL 15 database
- **api** — Express.js API server
- **web** — Nginx serving the React frontend

### Manual Deployment

```bash
# Build the frontend
pnpm --filter @financial-system/web build

# Build the API
pnpm --filter @financial-system/api build

# Start the API (serves API only, frontend needs separate hosting)
cd apps/api && node dist/server.js
```

## CI/CD

The GitHub Actions pipeline runs on every push to `main`:

1. **Lint & Type Check** — ESLint and TypeScript validation
2. **Test** — Automated test suite with PostgreSQL service
3. **Build** — Production builds for all packages
4. **Deploy** — Deployment step (configure with your target)

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all dev servers |
| `pnpm build` | Build all packages |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript checks |
| `pnpm test` | Run test suites |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:seed` | Seed demo data |
| `pnpm db:generate` | Generate Prisma client |

## License

MIT
