# Technical Context for AI Assistance

This document provides comprehensive technical context for AI assistants working on this project.

## Project Overview

**fsdAuth** is a production-ready React 19 single-page application (SPA) implementing a comprehensive authentication and authorization system with CRUD functionality. The project serves as a template/starter for building scalable frontend applications with enterprise-grade authentication.

### Key Characteristics
- **Architecture**: Feature-Sliced Design (FSD) methodology
- **Tech Stack**: React 19 + TypeScript + Vite
- **State Management**: Redux Toolkit with RTK Query
- **Authentication**: JWT with refresh tokens, Google OAuth, RBAC
- **UI Framework**: Tailwind CSS v4 + shadcn/ui components
- **Internationalization**: Full i18n support (English, Russian)
- **Mobile-First Design**: Responsive, touch-friendly with optimized mobile UX
- **Infinite Scroll**: Performance-optimized pagination with Intersection Observer

## Technologies and Frameworks

### Core Stack
- **React**: 19.1.1 (with React 19 features)
- **TypeScript**: 5.8.3 (strict mode enabled)
- **Vite**: 7.1.6 (build tool and dev server)
- **React Router**: 7.9.1 (declarative routing)

### Mobile-First Design
- **Responsive Layout**: Mobile-first approach with adaptive breakpoints (sm, md, lg)
- **Touch-Friendly**: Minimum 48px touch targets on mobile devices
- **Collapsible UI**: Drawer-style filters and sorting panels on mobile
- **Optimized Navigation**: Adaptive sidebar with mobile drawer support
- **Infinite Scroll**: Performance-optimized pagination with Intersection Observer

### State Management
- **Redux Toolkit**: 2.9.0 (primary state management)
- **RTK Query**: Built into Redux Toolkit (server state, caching)
- **Zustand**: 4.5.7 (lightweight UI state stores)
- **React Hook Form**: 7.65.0 (form state)

### UI and Styling
- **Tailwind CSS**: 4.1.13 (utility-first CSS)
- **shadcn/ui**: Component library based on Radix UI primitives
- **Radix UI**: Headless accessible components (Dialog, Label, Slot)
- **lucide-react**: 0.544.0 (icon library)
- **next-themes**: 0.4.6 (theme management)
- **class-variance-authority**: 0.7.1 (component variants)
- **tailwind-merge**: 3.3.1 (class merging utility)
- **clsx**: 2.1.1 (conditional classes)
- **sonner**: 2.0.7 (toast notifications)

### Forms and Validation
- **React Hook Form**: 7.65.0
- **Zod**: 4.1.12 (schema validation)
- **@hookform/resolvers**: 5.2.2 (form validation integration)

### Authentication
- **@react-oauth/google**: 0.12.2 (Google OAuth integration)
- JWT tokens (access + refresh)
- Role-Based Access Control (RBAC)

### Internationalization
- **i18next**: 23.11.5
- **react-i18next**: 15.4.0
- Supported languages: English (en), Russian (ru)

### Development Tools
- **ESLint**: 9.35.0 (with TypeScript, React Hooks plugins)
- **json-server**: 1.0.0-beta.3 (mock API for development)

## Development Commands

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
# Starts Vite dev server on http://localhost:5173
# Auto-proxies /api requests to backend (default: https://localhost:7294/)
```

### Mock API Server (Optional)
```bash
npm run server
# Starts json-server on port 5000
# Use for local development without backend
```

### Production Build
```bash
npm run build
# 1. Runs TypeScript type checking (tsc -b)
# 2. Builds optimized bundle to dist/
```

### Preview Production Build
```bash
npm run preview
# Serves production build locally for testing
```

### Linting
```bash
npm run lint
# Runs ESLint across entire codebase
# Strict TypeScript checks enabled
```

## Project Structure

The project follows **Feature-Sliced Design (FSD)** methodology with clear layer separation:

```
src/
├── app/                    # Application initialization layer
│   ├── index.tsx          # Root component with all providers
│   ├── providers/         # App-level providers
│   │   ├── AuthProvider/  # Auth initialization and session management
│   │   ├── ErrorBoundaryProvider/  # React error boundary
│   │   ├── GoogleOAuthProvider/    # Google OAuth wrapper
│   │   ├── StoreProvider/  # Redux store provider
│   │   ├── ThemeProvider/  # Theme (dark/light mode) provider
│   │   └── ToastProvider/  # Toast notification provider
│   ├── router/            # Routing configuration
│   │   ├── AppRouter.tsx  # Route definitions
│   │   ├── ProtectedRoute.tsx  # Auth + permission guards
│   │   └── PublicRoute.tsx     # Redirect if authenticated
│   ├── stores/            # Redux store configuration
│   │   └── mainStore/     # Combined store with slices
│   └── styles/            # Global styles and Tailwind imports
├── entities/              # Business entities (5 total)
│   ├── account/          # User account management (minimal)
│   ├── auth/             # Authentication entity (JWT, OAuth, session)
│   ├── role/             # Role management (CRUD + permissions)
│   ├── template/         # Template CRUD entity (reference implementation)
│   └── user/             # User management (CRUD + roles + status)
│   # Each entity contains:
│   #   ├── api/          # RTK Query endpoints
│   #   ├── model/        # Types, interfaces, state slices
│   #   └── ui/           # Entity-specific UI components
├── features/              # User features and interactions (34 total)
│   # Authentication Features (8)
│   ├── auth-login/       # Login form and logic
│   ├── auth-register/    # Registration form
│   ├── auth-logout/      # Logout functionality
│   ├── auth-google/      # Google OAuth button
│   ├── password-forgot/  # Forgot password flow
│   ├── password-reset/   # Reset password with token
│   ├── password-change/  # Change password (authenticated)
│   └── password-set/     # Set password (for OAuth users)
│   # Account & Profile Features (3)
│   ├── account-delete/   # Account deletion flow
│   ├── profile-edit/     # Edit user profile
│   └── profile-photo/    # Profile photo upload/management
│   # Template Features (9) - Reference Implementation
│   ├── template/         # Template drawer form (create/edit/view)
│   ├── template-create/  # Create template
│   ├── template-update/  # Update template
│   ├── template-delete/  # Delete template (soft delete)
│   ├── template-restore/ # Restore deleted template
│   ├── template-search/  # Search templates
│   ├── template-filters/ # Filter & sort templates
│   └── template-pagination/ # Pagination controls
│   # User Features (8)
│   ├── user/             # User drawer form (create/edit/view)
│   ├── user-create/      # Create user
│   ├── user-update/      # Update user
│   ├── user-delete/      # Delete user
│   ├── user-search/      # Search users
│   ├── user-filters/     # Filter & sort users
│   ├── user-roles/       # Assign/remove roles from users
│   └── user-status/      # Enable/disable user account
│   # Role Features (5)
│   ├── role/             # Role drawer form (create/edit/view)
│   ├── role-create/      # Create role
│   ├── role-update/      # Update role
│   ├── role-delete/      # Delete role
│   └── role-permissions/ # Manage role permissions (assign/remove)
│   # UI Features (2)
│   ├── theme-switcher/   # Dark/light mode toggle (mobile-optimized)
│   └── language-switcher/# Language selection (mobile-optimized)
│   # Each feature contains:
│   #   ├── ui/           # Feature UI components
│   #   ├── model/        # Feature logic, hooks, validation
│   #   └── index.ts      # Public API (barrel export)
├── widgets/               # Composite UI blocks (7 total)
│   ├── header/           # App header with navigation, theme/language switchers
│   ├── sidebar/          # Sidebar navigation with collapsible groups (Zustand)
│   ├── crudPage/         # Reusable CRUD page layout (mobile-optimized)
│   ├── crudList/         # Generic list rendering component
│   ├── templateList/     # Template list with infinite scroll
│   ├── userList/         # User list with infinite scroll
│   └── roleList/         # Role list widget
├── pages/                 # Route pages (16 total)
│   # Authentication Pages (5)
│   ├── LoginPage/        # Login with email/password and Google OAuth
│   ├── RegisterPage/     # User registration
│   ├── VerifyEmailPage/  # Email verification from token
│   ├── ForgotPasswordPage/ # Initiate password reset
│   └── ResetPasswordPage/  # Reset password with token
│   # Main Application Pages (6)
│   ├── HomePage/         # Welcome page
│   ├── ProfilePage/      # User profile viewing and editing
│   ├── TemplatesPage/    # Full CRUD for templates with filters/sorting
│   ├── TemplateUpdatePage/ # Dedicated template edit page
│   ├── UsersPage/        # Full CRUD for users with filters/sorting
│   └── RolesPage/        # Full CRUD for roles with permissions
│   # Informational Pages (2)
│   ├── PrivacyPolicyPage/ # Privacy policy content
│   └── TermsOfUsePage/   # Terms of use content
│   # Error Pages (3)
│   └── errors/
│       ├── NotFoundPage/     # 404 error
│       ├── ForbiddenPage/    # 403 access denied
│       └── ServerErrorPage/  # 500+ server errors
└── shared/                # Shared utilities and components
    ├── api/              # API configuration
    │   ├── baseApi.ts         # RTK Query base API
    │   ├── baseQueryWithReauth.ts  # Auto token refresh
    │   └── apiUtils.ts        # API utilities
    ├── config/           # App configuration
    │   ├── routes.ts          # Route constants
    │   ├── i18n/              # i18n configuration
    │   └── navigation.ts      # Navigation structure
    ├── lib/              # Shared utilities
    │   ├── hooks/             # Custom hooks
    │   ├── utils/             # Utility functions
    │   ├── stores/            # Zustand stores
    │   └── guards/            # Permission guards
    └── ui/               # Reusable UI components (30+ components)
        ├── button/            # Button with variants
        ├── input/             # Input, PasswordInput, PhoneInput
        ├── dialog/            # Modal dialog
        ├── drawer/            # Slide-out drawer
        ├── form-drawer/       # Form inside drawer pattern
        ├── card/              # Card container
        ├── badge/             # Badge/label component
        ├── form/              # Form field wrapper (FormField)
        ├── tabs/              # Tab navigation (NEW - used for filters/sorting)
        ├── dropdown-menu/     # Dropdown menu
        ├── pagination/        # Pagination component + controls
        ├── loader/            # Loading spinner
        ├── skeleton/          # Skeleton loading placeholder
        ├── ProtectedContent/  # Permission-based content visibility
        └── ...                # 15+ more components
```

### Folder Organization Principles (FSD)

1. **Layers** (top to bottom, strict dependency):
   - `app` - Application initialization (can import from all layers)
   - `pages` - Route pages (can import: widgets, features, entities, shared)
   - `widgets` - Composite UI blocks (can import: features, entities, shared)
   - `features` - User interactions (can import: entities, shared)
   - `entities` - Business entities (can import: shared only)
   - `shared` - No dependencies on other layers

2. **Slices**: Each folder within a layer (e.g., `auth`, `template`)

3. **Segments**: Each slice contains segments:
   - `ui/` - UI components
   - `model/` - Business logic, types, state
   - `api/` - API integration
   - `lib/` - Utilities
   - `config/` - Configuration
   - `index.ts` - Public API (barrel export)

## Important Patterns and Conventions

### FSD Pattern Enforcement
- Lower layers CANNOT import from higher layers
- Each slice exposes public API via `index.ts`
- Cross-slice imports only through public API
- Shared layer has no dependencies on other layers

### Mobile-First Development Pattern
**The project follows mobile-first responsive design:**

1. **Breakpoints** (Tailwind defaults):
   - Base styles: Mobile (< 640px)
   - `sm:` Small devices (≥ 640px)
   - `md:` Medium devices (≥ 768px)
   - `lg:` Large devices (≥ 1024px)

2. **Touch-Friendly Targets**:
   - Minimum 48px height for interactive elements on mobile
   - Example: `min-h-[48px] md:min-h-0`
   - Larger padding/spacing on mobile, tighter on desktop

3. **Collapsible UI Elements**:
   - Filters and sorting in drawer-style panels on mobile
   - Expanded inline on desktop
   - Use Tabs component for filter/sort switching

4. **Responsive Typography**:
   - Base: `text-sm` on mobile → `text-base` on desktop
   - Headings: Scale appropriately with breakpoints

5. **Hidden/Visible Elements**:
   - Hide text labels on mobile: `hidden sm:block`
   - Show icons only on mobile, icon+text on desktop
   - Responsive grid columns: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

6. **Navigation Patterns**:
   - Drawer sidebar on mobile
   - Fixed sidebar on desktop
   - Collapsible navigation groups (state persisted in Zustand)

**Example Mobile-First Component:**
```typescript
<Button className="min-h-[48px] md:min-h-0 w-full sm:w-auto">
  <Icon className="h-5 w-5" />
  <span className="hidden sm:inline">{t('action.label')}</span>
</Button>
```

### Component Patterns
1. **Functional Components**: All components use function syntax
2. **TypeScript Interfaces**: Props defined with interfaces (e.g., `ComponentNameProps`)
3. **Named Exports**: Components exported as named exports (not default)
4. **Composition**: Prefer composition over inheritance
5. **Hooks First**: Logic extracted to custom hooks when reusable

### Naming Conventions
- **Components**: PascalCase (e.g., `LoginForm`, `TemplateCard`)
- **Files**: kebab-case for multi-word (e.g., `login-form.tsx`), PascalCase for single component files
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth`, `useTemplateList`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `PERMISSIONS`, `ROUTES`)
- **Types/Interfaces**: PascalCase (e.g., `User`, `Template`, `ApiResponse`)

### State Management Pattern
1. **Server State**: RTK Query (API data, caching)
2. **Global App State**: Redux Toolkit (auth, user, filters)
3. **UI State**: Zustand (modals, loading indicators)
4. **Form State**: React Hook Form
5. **Component State**: useState for local state

### Custom Hooks Pattern
```typescript
// Export from feature's model/
export const useFeatureName = () => {
  // RTK Query hooks
  const [mutation, { isLoading }] = useMutationMutation();

  // Redux hooks
  const dispatch = useAppDispatch();

  // Handlers
  const handleAction = async (data: Data) => {
    await mutation(data).unwrap();
    toast.success('Success message');
  };

  return { handleAction, isLoading };
};
```

## API Integration Details

### Base Configuration
- **Base URL**: `import.meta.env.VITE_API_URL` (default: `/api`)
- **HTTP Client**: RTK Query (primary), Axios (fallback)
- **Response Format**: Result envelope pattern

### Result Envelope
All API responses follow this structure:
```typescript
interface ApiResponse<T> {
  data: T | null;
  message?: string;
  errorCode?: string;
  errorDetails?: object;
  traceId?: string;
}
```

### Authentication Headers
Automatically injected by RTK Query base query:
```
Authorization: Bearer {accessToken}
Content-Type: application/json
Accept-Language: {currentLanguage}
```

### Token Refresh Flow
1. Any API call returns 401
2. Interceptor catches error
3. POST `/auth/refresh-token` with refresh token
4. Update access token in Redux state
5. Retry original request
6. If refresh fails: logout and redirect to login

### RTK Query Pattern
```typescript
// Define endpoints
export const entityApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEntity: build.query<Entity, string>({
      query: (id) => `/entity/${id}`,
      providesTags: ['Entity']
    }),
    createEntity: build.mutation<Entity, CreateDto>({
      query: (data) => ({ url: '/entity', method: 'POST', body: data }),
      invalidatesTags: ['Entity']
    })
  })
});

// Auto-generated hooks
export const { useGetEntityQuery, useCreateEntityMutation } = entityApi;
```

### Cache Tags
RTK Query uses tags for cache invalidation:
- `Template` - Template data (list and individual)
- `User` - User data (list and individual)
- `UserPermissions` - User permission data
- `Role` - Role data (list and individual)
- `CurrentUser` - Current authenticated user profile
- `Auth` - Authentication-related data

## Routing Structure

### Route Definitions
See [src/shared/config/routes.ts](src/shared/config/routes.ts) for route constants:

```typescript
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  TEMPLATES: '/templates',
  TEMPLATE_EDIT: '/templates/:id/edit',
  ROLES: '/roles',
  USERS: '/users',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_USE: '/terms-of-use',
  FORBIDDEN: '/forbidden',
  NOT_FOUND: '*'
};
```

### Protected Routes
Routes require authentication + optional permissions:
```typescript
<ProtectedRoute requiredPermissions={[PERMISSIONS.TEMPLATE_VIEW]}>
  <TemplatesPage />
</ProtectedRoute>
```

### Public Routes
Routes redirect authenticated users to home:
```typescript
<PublicRoute>
  <LoginPage />
</PublicRoute>
```

### Navigation Guards
- **ProtectedRoute**: Checks `isAuthenticated` + permissions
- **PublicRoute**: Redirects if `isAuthenticated`
- **ProtectedContent**: Component-level permission check

## State Management Approach

### Redux Store Structure
Located at [src/app/stores/mainStore/](src/app/stores/mainStore/):

```typescript
RootState = {
  auth: {
    user: CurrentUser | null;
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  },
  template: {
    page: number;
    pageSize: number;
    searchQuery: string;
    includeDeleted: boolean;
    sortBy: 'name' | 'createdAt' | 'updatedAt' | null;
    sortDescending: boolean;
  },
  user: {
    page: number;
    pageSize: number;
    searchQuery: string;
    filterIsActive: boolean | null;
    filterRoleName: string | null;
    sortBy: 'fullName' | 'email' | 'createdAt' | null;
    sortDescending: boolean;
  },
  role: {
    page: number;
    pageSize: number;
    searchQuery: string;
  },
  [rtkApi.reducerPath]: {
    // RTK Query cache with all API endpoints
  }
}
```

### Zustand Stores
Lightweight stores for UI state:
- `globalErrorStore` - Global error modal state
- `navigationLoadingStore` - Loading indicator during navigation
- `themeStore` - Theme preference (synced with localStorage)
- `sidebarStore` - Sidebar collapsible groups state (persisted to localStorage)

### Typed Hooks
Always use typed hooks from store:
```typescript
import { useAppDispatch, useAppSelector } from '@/app/stores/mainStore';
```

## Configuration

### Environment Variables
See [.env.example](.env.example) for available variables:

```bash
# API Configuration
VITE_API_URL=https://localhost:7294/api

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Development Proxy
Vite proxy configuration (dev only):
- All `/api` requests proxied to backend
- Default target: `https://localhost:7294/`
- Override with `VITE_API_PROXY_TARGET` env variable

### Theme Configuration
Located at [src/app/styles/index.css](src/app/styles/index.css):
- CSS variables for colors (OKLCH color space)
- Light and dark mode variants
- Semantic color tokens

## Important Features and Flows

### Authentication Flow
1. **Login**: Email/password or Google OAuth → JWT tokens → Fetch user
2. **Registration**: Email/password → Verification email sent
3. **Email Verification**: Token-based verification
4. **Password Recovery**: Email → Reset token → New password
5. **Auto-refresh**: Transparent token refresh on 401 errors
6. **Logout**: Revoke refresh token → Clear state → Redirect to login

### Authorization (RBAC)
- **Permissions**: Defined in `PERMISSIONS` constant
- **System Roles**: Admin, Manager, User
- **Permission Checks**:
  - Route-level: `ProtectedRoute` with `requiredPermissions`
  - Component-level: `ProtectedContent` wrapper
  - Programmatic: `hasPermission`, `hasAnyPermission`, `hasAllPermissions` hooks
- **Wildcard Permission**: `"*"` grants all access

### CRUD Pattern (Template as Reference Implementation)
All CRUD entities (Template, User, Role) follow this pattern:

1. **List**:
   - Infinite scroll with Intersection Observer
   - Search with debounced input
   - Multi-field sorting (ascending/descending)
   - Advanced filtering (entity-specific)
   - Mobile-optimized collapsible filter panel
   - "Show Deleted" toggle for soft-deleted items

2. **Create**:
   - Drawer form (not modal dialog)
   - React Hook Form + Zod validation
   - Toast notification on success

3. **Update**:
   - Same drawer form with pre-filled data
   - View-only mode for users without edit permission
   - Toast notification on success

4. **Delete**:
   - Soft delete with confirmation dialog
   - Item moved to "deleted" state
   - Can be restored later

5. **Restore**:
   - Restore soft-deleted items
   - Confirmation dialog
   - Item returns to active state

6. **Permanent Delete**:
   - Hard delete with strong confirmation
   - Only for already soft-deleted items
   - Irreversible action

**Additional Patterns (User Entity):**
- **Status Management**: Enable/disable user accounts with status switcher
- **Role Assignment**: Assign/remove roles to/from users
- **Permission Viewing**: View all permissions for a user

**Additional Patterns (Role Entity):**
- **Permission Management**: Assign/remove permissions to/from roles with checkbox UI

### Form Validation Pattern
All forms use React Hook Form + Zod:
```typescript
// 1. Define schema
const schema = z.object({
  name: z.string().min(1, 'Required').trim()
});

// 2. Infer type
type FormData = z.infer<typeof schema>;

// 3. Use in form
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { name: '' }
});

// 4. Submit handler
const onSubmit = form.handleSubmit(async (data) => {
  await mutation(data).unwrap();
  toast.success('Success');
});
```

### Internationalization Flow
1. User selects language via `LanguageSwitcher`
2. i18next changes language
3. New language saved to localStorage
4. `Accept-Language` header updated for API calls
5. All UI text re-rendered with new translations

### Error Handling Strategy
1. **API Errors**: Auto-displayed via `globalErrorStore`
2. **Form Errors**: Field-level validation errors
3. **React Errors**: Caught by `ErrorBoundaryProvider`
4. **Toast Notifications**: Success/error feedback via `sonner`

### Theme Switching
1. User clicks theme toggle
2. `next-themes` changes theme
3. Theme saved to localStorage (`fsdAuth-theme`)
4. CSS variables updated (`.dark` class)
5. Brand color utility syncs theme colors

### Infinite Scroll Pattern
All list pages use infinite scroll for better performance:

1. **Implementation**: Intersection Observer API
2. **Trigger**: "Load more" sentinel element at bottom of list
3. **Loading State**: Skeleton placeholders during fetch
4. **Error Handling**: Error message with retry button
5. **End of List**: "No more items" message
6. **Benefits**:
   - Better performance than traditional pagination
   - Mobile-friendly scrolling experience
   - Reduced initial load time
   - Smooth user experience

**Example Pattern (TemplateList Widget):**
```typescript
const observerRef = useRef<HTMLDivElement>(null);
const { data, isLoading, isFetching } = useGetTemplatesQuery(params);

useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isFetching && hasMore) {
      // Load next page
      dispatch(setPage(page + 1));
    }
  });

  if (observerRef.current) {
    observer.observe(observerRef.current);
  }

  return () => observer.disconnect();
}, [isFetching, hasMore, page]);
```

### Sorting and Filtering Pattern
Templates and Users support multi-field sorting:

1. **Tabbed UI**: Tabs component for switching between filters and sorting
2. **Sort Fields**:
   - Template: name, createdAt, updatedAt
   - User: fullName, email, createdAt
3. **Sort Direction**: Ascending (A→Z, oldest→newest) or Descending (Z→A, newest→oldest)
4. **State Management**: Sort preferences stored in Redux slice
5. **Mobile Optimization**: Collapsible panel with tabs for filter/sort selection

## Key Design Decisions

### Why Feature-Sliced Design?
- **Scalability**: Clear layer separation prevents spaghetti code
- **Maintainability**: Easy to locate and modify features
- **Team Collaboration**: Parallel development without conflicts
- **Testability**: Isolated features are easier to test

### Why RTK Query?
- **Built-in Caching**: Reduces unnecessary API calls
- **Optimistic Updates**: Better UX during mutations
- **Auto-generated Hooks**: Less boilerplate
- **Cache Invalidation**: Tag-based invalidation is declarative
- **Token Refresh**: Easy to implement with custom base query

### Why Tailwind CSS?
- **Rapid Development**: Utility-first approach speeds up styling
- **Consistency**: Design tokens ensure visual consistency
- **Dark Mode**: Built-in dark mode support
- **Performance**: Purged CSS results in minimal bundle size

### Why shadcn/ui?
- **Accessible**: Built on Radix UI primitives
- **Customizable**: Copy components to project (not npm package)
- **Type-safe**: Full TypeScript support
- **Composable**: Compound component pattern

### Why Multiple State Management Solutions?
- **Right Tool for the Job**: Each solution optimized for specific use case
- **Redux Toolkit**: Complex global state, time-travel debugging
- **RTK Query**: Server state with caching
- **Zustand**: Simple UI state without Redux boilerplate
- **React Hook Form**: Form state with validation

### Why Mobile-First Design?
- **User Experience**: Optimized for all devices from smallest to largest
- **Performance**: Mobile-optimized assets and layouts reduce load time
- **Future-Proof**: Mobile traffic continues to grow
- **Accessibility**: Touch-friendly targets improve usability for all users
- **Progressive Enhancement**: Start with core experience, enhance for larger screens

### Why Infinite Scroll Over Traditional Pagination?
- **Mobile UX**: Natural scrolling gesture, no button tapping needed
- **Performance**: Load data incrementally, faster initial page load
- **Engagement**: Seamless browsing experience keeps users engaged
- **Flexibility**: Still supports filtering, sorting, and search
- **Implementation**: Intersection Observer API is performant and well-supported

## Testing Notes

**Current Status**: No testing framework configured

**Recommendations for Future Testing**:
- **Unit Tests**: Vitest + React Testing Library
- **Integration Tests**: Vitest with MSW (Mock Service Worker)
- **E2E Tests**: Playwright or Cypress
- **Test Location**: `__tests__` folders within each slice
- **Coverage Target**: 80%+ for critical paths (auth, API, forms)

## Common Development Tasks

### Adding a New Feature
See [DEVELOPMENT.md](DEVELOPMENT.md) for complete checklist.

### Adding a New API Endpoint
1. Define endpoint in entity's `api/` folder
2. Inject into `baseApi` using `injectEndpoints`
3. Export auto-generated hooks
4. Use tags for cache invalidation

### Adding a New Route
1. Add route constant to `ROUTES` in [src/shared/config/routes.ts](src/shared/config/routes.ts)
2. Create page component in `pages/`
3. Add route to `AppRouter` with appropriate guard
4. Update navigation config if needed

### Adding a New Permission
1. Add to `PERMISSIONS` constant
2. Update backend permission seeds
3. Use in `ProtectedRoute` or `ProtectedContent`
4. Test with different roles

### Modifying Theme Colors
1. Update CSS variables in [src/app/styles/index.css](src/app/styles/index.css)
2. Use semantic color tokens (e.g., `bg-background`, `text-foreground`)
3. Test in both light and dark modes

### Adding a New Translation
1. Add key to [src/shared/config/i18n/locales/en/translation.json](src/shared/config/i18n/locales/en/translation.json)
2. Add same key to Russian translations
3. Use with `t('your.key')` hook

## Debugging Tips

### Redux DevTools
Redux DevTools extension enabled in development:
- View state changes
- Time-travel debugging
- Inspect RTK Query cache

### React DevTools
Use React DevTools to:
- Inspect component tree
- View props and state
- Profile performance

### Network Tab
Monitor API calls:
- Check request/response format
- Verify token refresh flow
- Debug CORS issues

### Vite Dev Server
Hot Module Replacement (HMR) enabled:
- Changes reflect immediately
- State preserved when possible
- Check console for HMR errors

## Additional Resources

- [Feature-Sliced Design Docs](https://feature-sliced.design/)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [RTK Query Docs](https://redux-toolkit.js.org/rtk-query/overview)
- [React Router v7 Docs](https://reactrouter.com/)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Docs](https://zod.dev/)
