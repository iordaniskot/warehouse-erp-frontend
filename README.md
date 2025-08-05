# Warehouse ERP Frontend

A modern Next.js 15 frontend application for the Unified Retail & Wholesale Warehouse Management System.

## Tech Stack

- **Framework**: Next.js 15 with App Router & React Server Components
- **Language**: TypeScript (strict mode)
- **UI Library**: shadcn/ui (built on Radix UI)
- **Styling**: Tailwind CSS 4.x with dark/light theme support
- **Data Fetching**: TanStack Query for caching & optimistic updates
- **Validation**: Zod for schema validation
- **Internationalization**: next-intl for SSR-compatible translations (Greek & English)

## Features

Based on the Product Requirements Document (PRD), this frontend supports:

### MVP Features
- Product catalog CRUD with variants, images, and pricing tiers
- Stock movements tracking (inbound, outbound, adjustments, multi-warehouse)
- Point of Sale (POS) module for retail sales
- Wholesale order entry with tiered pricing & invoices
- Basic reports (stock on hand, daily sales)
- User authentication & role-based access control (RBAC)

### Architecture
- Modern component-based architecture
- Type-safe API communication
- Optimistic UI updates
- Responsive design with 8-point grid system
- Accessible components following WCAG guidelines

## Getting Started

### Prerequisites
- Node.js 20 LTS or higher
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── providers.tsx   # Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
│   ├── api.ts         # API client
│   ├── schemas.ts     # Zod validation schemas
│   └── utils.ts       # Utility functions
└── messages/           # Internationalization files
```

## Development Guidelines

### Code Quality
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for code formatting
- Component-driven development

### UI/UX Guidelines
- Consistent spacing using Tailwind scale (4, 8, 12...)
- 8-point grid system
- Rounded corners (rounded-2xl) for cards
- Soft shadows for depth
- Keyboard shortcuts support (especially for POS)

### Performance Targets
- API response p95 < 200ms
- POS checkout completion < 3s
- Support for 100,000 SKUs
- 50 concurrent POS terminals

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The frontend communicates with the Express.js backend API. Configure the API base URL in your environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## Internationalization

The application supports Greek and English languages with:
- SSR-compatible translations
- Currency formatting (EUR default)
- Date/time localization for Europe/Athens timezone

## Contributing

1. Follow the existing code style and patterns
2. Write TypeScript with strict type checking
3. Use shadcn/ui components for consistency
4. Implement responsive designs
5. Add proper error handling and loading states

## License

This project is part of the Warehouse ERP System and is proprietary software.
