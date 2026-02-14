# IucaReportsWeb

A production-ready React 19 single-page application (SPA) for the IUCA (International University of Central Asia) employee reporting system. The system simplifies and automates employee reporting within the university — employees record their completed work daily as short notes, and the system generates structured weekly reports.

## System Goals

- **Simplify** the report preparation process
- **Improve** the quality and consistency of reporting
- **Ensure** transparency of department activities

## Features

### Authentication & Authorization
- Email/password authentication with JWT tokens
- Google OAuth integration
- Automatic token refresh
- Role-Based Access Control (RBAC) with granular permissions
- Protected routes with permission guards
- Email verification and password recovery flows

### User Interface
- Modern, **mobile-first** responsive design with Tailwind CSS v4
- Dark/light mode support with persistent theme preference
- Accessible UI components based on shadcn/ui and Radix UI
- Smooth page transitions and loading states
- Toast notifications for user feedback
- **Touch-friendly** interface with minimum 48px tap targets on mobile
- Collapsible filter/sort panels optimized for mobile devices

### Internationalization
- Multi-language support (English, Russian)
- Easy language switching
- Backend-integrated localization

### CRUD Functionality
- Complete CRUD operations for **templates, users, and roles**
- Advanced filtering, search, and **multi-field sorting**
- **Infinite scroll** pagination for optimal performance
- Soft delete with restore and permanent delete functionality
- Optimistic updates for better UX
- **User account status management** (enable/disable)
- **Role permissions management** (assign/remove permissions)
- **User role assignment** (manage user roles)

### Developer Experience
- Feature-Sliced Design architecture for scalability
- TypeScript with strict mode for type safety
- Redux Toolkit + RTK Query for state management
- React Hook Form + Zod for form validation
- Hot Module Replacement (HMR) with Vite
- ESLint for code quality
- **34 feature modules** covering all common use cases
- **30+ reusable UI components** in design system
- Comprehensive documentation for AI assistance (CLAUDE.md)
- Detailed development patterns and rules (DEVELOPMENT.md)

## Technology Stack

### Core
- **React** 19.1.1 - UI library
- **TypeScript** 5.8.3 - Type safety
- **Vite** 7.1.6 - Build tool and dev server

### State Management
- **Redux Toolkit** 2.9.0 - Global state management
- **RTK Query** - Server state and caching
- **Zustand** 4.5.7 - Lightweight UI state
- **React Hook Form** 7.65.0 - Form state

### UI & Styling
- **Tailwind CSS** 4.1.13 - Utility-first CSS framework
- **shadcn/ui** - Component library (Radix UI + Tailwind)
- **lucide-react** - Icon library
- **next-themes** - Theme management
- **sonner** - Toast notifications

### Routing & Forms
- **React Router** 7.9.1 - Client-side routing
- **Zod** 4.1.12 - Schema validation
- **@hookform/resolvers** - Form validation integration

### Authentication
- **@react-oauth/google** - Google OAuth integration
- JWT tokens (access + refresh)

### Internationalization
- **i18next** 23.11.5 - i18n framework
- **react-i18next** 15.4.0 - React bindings

## Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Backend API** running (default: https://localhost:7294/)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd iuca-reports-web
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```bash
# API Configuration
VITE_API_URL=https://localhost:7294/api

# Google OAuth (optional)
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Running Locally

1. **Start the development server:**
```bash
npm run dev
```
The app will be available at http://localhost:5173

2. **Backend API (required):**
Ensure your backend API is running. The frontend will proxy `/api` requests to the backend (default: https://localhost:7294/)

3. **Mock API Server (optional alternative):**
```bash
npm run server
```
Starts json-server on port 5000 for local development without backend

### Environment Setup

#### Environment Variables

- `VITE_API_URL` - Backend API base URL (default: `/api`)
  - In development, requests to `/api` are proxied to backend
  - In production, set to full backend URL

- `VITE_GOOGLE_CLIENT_ID` - Google OAuth Client ID (optional)
  - Get from [Google Cloud Console](https://console.cloud.google.com/)
  - Required only if using Google OAuth login

#### Development Proxy

In development, Vite proxies API requests:
- All requests to `/api/*` are forwarded to backend
- Default target: `https://localhost:7294/`
- Override with `VITE_API_PROXY_TARGET` environment variable (dev only)

## Project Structure

This project follows **Feature-Sliced Design (FSD)** architecture:

```
src/
├── app/                    # Application initialization
│   ├── providers/         # App-level providers (Auth, Store, Theme, Router)
│   ├── router/            # Routing configuration and guards
│   ├── stores/            # Redux store setup
│   └── styles/            # Global styles
├── entities/              # Business entities (auth, template, role, user)
│   └── {entity}/
│       ├── api/          # RTK Query endpoints
│       ├── model/        # Types, state, logic
│       └── ui/           # Entity-specific components
├── features/              # User features (login, register, CRUD operations)
│   └── {feature}/
│       ├── ui/           # Feature UI components
│       ├── model/        # Hooks, validation, types
│       └── index.ts      # Public API
├── widgets/               # Composite UI blocks (header, sidebar, lists)
├── pages/                 # Route pages (compositions of widgets/features)
└── shared/                # Shared utilities and components
    ├── api/              # API configuration, base query
    ├── config/           # Routes, i18n, navigation
    ├── lib/              # Utilities, hooks, stores, guards
    └── ui/               # Reusable UI components (design system)
```

### Key Principles

- **Layers**: app → pages → widgets → features → entities → shared
- **Dependency Rule**: Lower layers cannot import from higher layers
- **Public API**: Each slice exports public API via `index.ts`
- **Isolation**: Features and entities are isolated and reusable

## Available Scripts

### Development
```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run server       # Start mock API server (http://localhost:5000)
```

### Production
```bash
npm run build        # TypeScript check + production build
npm run preview      # Preview production build locally
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

## Documentation

- **[CLAUDE.md](CLAUDE.md)** - Comprehensive technical context for AI assistance
  - Project architecture and patterns
  - API integration details
  - State management approach
  - Authentication/authorization flows
  - Development commands and configuration

- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development rules and patterns
  - Feature development checklists
  - Component structure rules
  - Naming conventions
  - State management rules
  - API integration rules
  - Form validation rules
  - Git workflow and commit conventions

- **[TASKS.md](TASKS.md)** - Active task tracking
  - Current sprint/iteration tasks
  - Feature development progress

## Key Design Decisions

### Feature-Sliced Design Architecture
- **Scalability**: Clear separation prevents spaghetti code
- **Maintainability**: Easy to locate and modify features
- **Team Collaboration**: Enables parallel development
- **Testability**: Isolated features are easier to test

### Mobile-First Design
- **User Experience**: Optimized for all devices from smallest to largest
- **Performance**: Mobile-optimized assets and layouts reduce load time
- **Accessibility**: Touch-friendly targets improve usability for all users
- **Progressive Enhancement**: Start with core experience, enhance for larger screens

### RTK Query for API Management
- **Built-in Caching**: Reduces unnecessary API calls
- **Optimistic Updates**: Better user experience
- **Auto-generated Hooks**: Less boilerplate code
- **Cache Invalidation**: Tag-based declarative invalidation
- **Token Refresh**: Seamless automatic token refresh on 401 errors

### Tailwind CSS + shadcn/ui
- **Rapid Development**: Utility-first approach
- **Consistency**: Design tokens ensure visual consistency
- **Dark Mode**: Built-in dark mode support
- **Accessibility**: Components built on Radix UI primitives
- **Customizable**: Components copied to project, not npm dependencies

### Hybrid State Management
- **Redux Toolkit**: Complex global state (auth, filters, pagination, sorting)
- **RTK Query**: Server state with automatic caching
- **Zustand**: Simple UI state (modals, loading indicators, sidebar state)
- **React Hook Form**: Form state with validation
- Each solution optimized for specific use cases

### Infinite Scroll Over Traditional Pagination
- **Mobile UX**: Natural scrolling gesture, no button tapping needed
- **Performance**: Load data incrementally, faster initial page load
- **Engagement**: Seamless browsing experience keeps users engaged
- **Implementation**: Intersection Observer API is performant and well-supported

### JWT Authentication with Refresh Tokens
- **Security**: Short-lived access tokens (memory), long-lived refresh tokens (localStorage)
- **User Experience**: Automatic token refresh prevents session expiration
- **Backend Integration**: Standard JWT flow with backend API

### TypeScript Strict Mode
- **Type Safety**: Catch errors at compile time
- **Developer Experience**: Better IntelliSense and refactoring
- **Code Quality**: Self-documenting code with types

## Project Status

### Completed Features ✅
**Authentication & Authorization:**
- ✅ Email/password authentication with JWT tokens
- ✅ Google OAuth integration
- ✅ Automatic token refresh on 401 errors
- ✅ Role-Based Access Control (RBAC) with granular permissions
- ✅ Protected routes with permission guards
- ✅ Email verification flow
- ✅ Password recovery and reset flow
- ✅ Change password (authenticated users)
- ✅ Set password (OAuth users)

**User Management:**
- ✅ Full CRUD operations for users
- ✅ User search with debouncing
- ✅ Multi-field sorting (fullName, email, createdAt)
- ✅ Advanced filtering (active status, role name)
- ✅ User account status management (enable/disable)
- ✅ Assign/remove roles to/from users
- ✅ View user permissions
- ✅ Infinite scroll pagination

**Role Management:**
- ✅ Full CRUD operations for roles
- ✅ Role search functionality
- ✅ Assign/remove permissions to/from roles
- ✅ Permission management with checkbox UI
- ✅ System roles (Admin, Manager, User)

**Template Management (Reference Implementation):**
- ✅ Full CRUD operations for templates
- ✅ Template search with debouncing
- ✅ Multi-field sorting (name, createdAt, updatedAt)
- ✅ Filter by deleted status
- ✅ Soft delete with restore functionality
- ✅ Permanent delete option
- ✅ Infinite scroll pagination

**UI & UX:**
- ✅ Mobile-first responsive design
- ✅ Dark/light mode with persistent preference
- ✅ Touch-friendly interface (48px minimum tap targets)
- ✅ Collapsible filter/sort panels for mobile
- ✅ Drawer-based forms (not modals)
- ✅ Infinite scroll with Intersection Observer
- ✅ Toast notifications for user feedback
- ✅ Loading states and skeleton placeholders
- ✅ Error handling with global error modal

**Internationalization:**
- ✅ Multi-language support (English, Russian)
- ✅ Language switcher component (mobile-optimized)
- ✅ Backend-integrated localization via Accept-Language header
- ✅ Persistent language preference in localStorage

**Profile Management:**
- ✅ View and edit user profile
- ✅ Profile photo upload/management
- ✅ Account deletion flow

**Developer Features:**
- ✅ 34 feature modules implemented
- ✅ 5 business entities (auth, template, user, role, account)
- ✅ 7 composite widgets
- ✅ 16 pages (including error pages)
- ✅ 30+ reusable UI components
- ✅ Comprehensive documentation (CLAUDE.md, DEVELOPMENT.md)
- ✅ Mobile-first development patterns
- ✅ Sorting and filtering patterns
- ✅ Infinite scroll implementation pattern

### Future Enhancements 🚀
- ⏳ Testing framework (Vitest + React Testing Library)
- ⏳ E2E tests (Playwright)
- ⏳ API documentation integration
- ⏳ Error tracking (Sentry)
- ⏳ Analytics integration
- ⏳ Performance monitoring
- ⏳ Additional language support (Spanish, German, French, etc.)

## Contributing

1. Review [DEVELOPMENT.md](DEVELOPMENT.md) for development rules and patterns
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Follow the checklists in [DEVELOPMENT.md](DEVELOPMENT.md) for adding features
4. Ensure linting passes: `npm run lint`
5. Ensure build succeeds: `npm run build`
6. Commit using conventional commits: `feat(scope): description`
7. Create a pull request with detailed description

## Support

For issues or questions:
- Check [CLAUDE.md](CLAUDE.md) for technical context
- Review [DEVELOPMENT.md](DEVELOPMENT.md) for development patterns
- Open an issue on GitHub
