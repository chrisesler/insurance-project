# AutoQuote - Insurance Quote Application

A modern auto insurance quote application built with Next.js, featuring a 5-step wizard, real-time vehicle data integration, and secure user authentication.

## 🚀 Features

- **5-Step Quote Wizard**: Streamlined insurance quote process
- **Real-time Vehicle Data**: Integration with NHTSA API for accurate vehicle information
- **Secure Authentication**: Clerk-powered user management
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Quote Management**: Save and manage multiple insurance quotes
- **Live Calculations**: Dynamic premium calculations based on user data

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Authentication**: Clerk
- **Database**: PGlite server (file-based PostgreSQL)
- **ORM**: Drizzle ORM
- **Validation**: Zod + React Hook Form
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Clerk account for authentication keys

## 🏗 Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd insurance-project
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Database (PGlite server connection)
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/postgres

# NHTSA Vehicle API (no key required - public API)
# Base URL: https://vpic.nhtsa.dot.gov/api/
```

### 3. Database Setup

```bash
# Start PGlite server and generate migrations
npm run db:generate

# Reset/initialize database (creates tables and runs migrations)
npm run db:reset
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

**Note**: The application uses PGlite server for the database. The server starts automatically with `npm run dev` and the database file (`local.db`) is created in the project root.

## 🔐 Clerk Authentication Setup

1. Sign up at [Clerk.com](https://clerk.com/)
2. Create a new application
3. Copy your publishable key and secret key
4. Update `.env.local` with your keys
5. Configure sign-in/sign-up URLs in Clerk dashboard:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/profile`
   - After sign-up URL: `/profile`

## 📱 Application Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   │   ├── quote/          # Quote submission & retrieval
│   │   └── vehicles/       # Vehicle data endpoints
│   ├── quote/              # Quote wizard page
│   ├── profile/            # User dashboard
│   ├── sign-in/            # Authentication pages
│   └── sign-up/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── quote/              # Quote wizard components
│   │   ├── quote-wizard.tsx
│   │   └── steps/          # Individual step components
│   └── navbar.tsx
├── lib/
│   ├── services/           # Business logic
│   │   ├── quote-service.ts
│   │   └── vehicle-service.ts
│   └── providers/          # Context providers
└── types/                  # TypeScript definitions
```

## 🧪 Available Scripts

```bash
npm run dev              # Start development server (includes PGlite server)
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run db:generate     # Generate Drizzle migrations
npm run db:migrate      # Run database migrations
npm run db:reset        # Reset database and apply migrations
npm run db:studio       # Open Drizzle Studio
```

## 🚗 Quote Wizard Flow

1. **Personal Information**: Name, email, phone, date of birth
2. **Address**: Street address, city, state, ZIP code
3. **Vehicle Information**: Year, make, model (with NHTSA API integration)
4. **Coverage Options**: Liability, Standard, or Full coverage with customizable limits
5. **Review & Quote**: Summary and premium calculation

## 🔧 Key Features Explained

### Vehicle API Integration
- Hybrid approach: Pre-cached popular makes for instant loading
- Real-time model data from NHTSA API with smart caching
- Deduplication and fallback data for reliability

### Quote Calculation Engine
- Risk-based premium calculation
- Factors: age, location, vehicle type, coverage level
- Configurable deductibles and liability limits

### Database & State Management
- PGlite: File-based PostgreSQL database with Drizzle ORM
- No external database server required - perfect for demos
- React Context for quote wizard state with local storage persistence
- Automatic schema creation and data persistence via migrations

## 📊 Production Considerations

This prototype demonstrates core functionality. For production deployment, consider adding:

### Monitoring & Analytics
- **Sentry**: Error tracking and performance monitoring
- **PostHog**: Product analytics and feature flags
- **LogTail**: Structured logging and observability

### Development Experience
- **Storybook**: Component documentation and testing
- **Husky**: Git hooks and commit enforcement
- **Playwright**: End-to-end testing
- **Semantic Release**: Automated versioning

### Code Quality & Security
- **Knip**: Unused code detection
- **@t3-oss/env-nextjs**: Type-safe environment variables
- **Arcjet**: Rate limiting and bot protection
- ESLint + Prettier with stricter configurations

### Performance & UX
- React Query/SWR for better data fetching
- Framer Motion for polished animations
- Next.js bundle analyzer for optimization
- Lighthouse CI for performance monitoring

### Internationalization & Accessibility
- next-intl or react-i18next for multi-language support
- @axe-core/react for accessibility testing
- WCAG compliance validation

### Infrastructure
- Docker containerization for consistent deployments
- CI/CD pipelines with GitHub Actions
- Vercel Analytics for web vitals tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues:

Consult the Next.js and Clerk documentation

---

Demonstrating modern React patterns, TypeScript best practices, and production-ready architecture.
