# Onyx Frontend

A modern React application built with TypeScript and Vite, following Feature-Sliced Design architecture.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Styled Components** - CSS-in-JS styling
- **React Hook Form + Zod** - Form handling and validation
- **Axios** - HTTP client
- **Recharts** - Charting library
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

## Project Structure

The project follows Feature-Sliced Design architecture:

```
src/
├── app/           # Application-wide providers, styles, layouts, routes
├── entities/      # Business entities and domain logic
├── features/      # User-facing features (e.g., authentication)
├── pages/         # Page components
├── shared/        # Reusable UI components and utilities
├── widgets/       # Composed UI components for specific sections
├── tests/         # Test files
├── assets/        # Static assets
├── App.tsx        # Root component
└── main.tsx       # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Configure the API base URL in `.env`:

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Testing

Run tests:

```bash
npm run test
```

Run tests with UI:

```bash
npm run test:ui
```

Run tests in watch mode:

```bash
npm run test:watch
```

### Testing Stack

- **Vitest** - Test runner
- **Testing Library** - React testing utilities
- **MSW** - API mocking
- **jsdom** - DOM simulation

## Code Quality

### Linting

Run ESLint:

```bash
npm run lint
```

### Formatting

Prettier is configured for code formatting.

## Environment Variables

| Variable            | Description                    | Default                         |
| ------------------- | ------------------------------ | ------------------------------- |
| `VITE_API_BASE_URL` | Base URL for the backend API   | `http://localhost:8000/api/v1`  |

## Architecture

This project uses Feature-Sliced Design (FSD), a methodology for structuring frontend applications. Key principles:

- **Layered architecture** - Each layer has a specific responsibility
- **Slices** - Logical grouping by business domain
- **Segments** - Technical separation within a slice (ui, api, model, etc.)
- **Unidirectional dependencies** - Higher layers depend on lower layers, never the reverse

### Layers (top to bottom)

1. **app** - Application initialization, providers, global styles, routing
2. **pages** - Page-level components composing features and widgets
3. **widgets** - Self-contained UI blocks for specific page sections
4. **features** - User interactions and business features
5. **entities** - Business domain models and logic
6. **shared** - Reusable UI components, utilities, and API clients
