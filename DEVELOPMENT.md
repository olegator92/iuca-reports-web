# Development Rules and Patterns

This document defines mandatory development rules and patterns for this project. All contributions must follow these guidelines.

## Table of Contents
- [Existing Patterns to Follow](#existing-patterns-to-follow)
- [Feature Development Checklists](#feature-development-checklists)
- [State Management Rules](#state-management-rules)
- [Form Validation Rules](#form-validation-rules)
- [Drawer vs Dialog Pattern](#drawer-vs-dialog-pattern)
- [Styling Rules](#styling-rules)
- [Mobile-First Development Rules](#mobile-first-development-rules)
- [Sorting and Filtering Rules](#sorting-and-filtering-rules)
- [Infinite Scroll Pattern](#infinite-scroll-pattern)
- [Error Handling Rules](#error-handling-rules)
- [Localization Rules](#localization-rules)
- [Legal Documents](#legal-documents)
- [Git Rules](#git-rules)
- [Documentation Update Requirements](#documentation-update-requirements)
- [TypeScript Strict Mode Rules](#typescript-strict-mode-rules)

---

## Existing Patterns to Follow

### Template Functionality as Reference
The **Template** entity is fully implemented and serves as the reference pattern for all future CRUD implementations.

**When adding new CRUD entities, you MUST:**
- Study and replicate the Template entity structure exactly
- Follow the same folder organization (entities, features, widgets, pages)
- Use the same UI components and layout patterns
- Implement the same CRUD operations (create, update, delete, list, restore, permanent delete)
- Follow the same state management approach (Redux slice + RTK Query)
- Use the same form patterns (Drawer forms with validation)
- Implement the same filtering and pagination patterns
- Use the same confirmation dialogs and user feedback patterns
- Follow the same permission-based access control patterns

**Reference Implementation Locations:**
- Entity: `src/entities/template/`
- Features: `src/features/template-*/` (9 features total)
- Widget: `src/widgets/templateList/`
- Page: `src/pages/TemplatesPage/`
- Redux: `src/entities/template/model/templateSlice.ts`

**Key Template Patterns:**
- Drawer-based create/edit forms (not modal dialogs)
- Search with debounced input
- **Multi-field sorting** with ascending/descending toggle
- **Infinite scroll** pagination with Intersection Observer
- Soft delete with "Show Deleted" toggle
- Card-based grid view with action dropdowns
- Confirmation dialogs for destructive actions
- Toast notifications for all operations
- Loading states with disabled buttons during operations
- Permission checks on all actions
- **Mobile-optimized** collapsible filter/sort panels with tabs
- **Touch-friendly** button sizes (min-h-[48px] on mobile)

### Branded Color Usage
**IMPORTANT**: Use branded colors (`bg-brand`, `text-brand`, `border-brand`) subtly and sparingly.
- Apply for accents only: logo, active navigation, key CTAs, badges
- Do NOT use for general buttons, inputs, body text, or large backgrounds
- See [Styling Rules](#styling-rules) for complete guidelines

### Legal Documents Maintenance
Privacy Policy and Terms of Use must be updated IMMEDIATELY when adding features that:
- Collect user data (analytics, tracking, cookies)
- Integrate third-party services (social login, payment processors)
- Change authentication methods or data handling

See [Legal Documents](#legal-documents) section for complete update requirements and checklist

---

## Feature Development Checklists

### Adding a New Page

- [ ] Create page component in `src/pages/PageName/`
- [ ] Create `index.ts` barrel export for the page
- [ ] Add route constant to `src/shared/config/routes.ts`
- [ ] Add route to `src/app/router/AppRouter.tsx` with appropriate guard (ProtectedRoute/PublicRoute)
- [ ] If route requires permissions, specify `requiredPermissions` prop
- [ ] Add navigation link to `src/shared/config/navigation.ts` if needed
- [ ] Add translations for page title and labels to all language files
- [ ] Update Header or Sidebar widget if navigation menu needs updating
- [ ] Test route protection and permissions
- [ ] Update [CLAUDE.md](CLAUDE.md) routing section with new route

### Adding a New Component

- [ ] Determine correct FSD layer (shared/ui, widgets, features, entities)
- [ ] Create component folder in appropriate layer
- [ ] Create component file with `.tsx` extension
- [ ] Define TypeScript interface for props (e.g., `ComponentNameProps`)
- [ ] Use named exports for the component
- [ ] Extract reusable logic to custom hooks in `model/` folder
- [ ] Add prop validation with TypeScript
- [ ] Ensure component is accessible (ARIA labels, keyboard navigation)
- [ ] Create `index.ts` barrel export
- [ ] Test component in isolation
- [ ] If component uses translations, add translation keys to all language files

### Adding a New API Integration

- [ ] Create or locate entity in `src/entities/EntityName/`
- [ ] Create `api/` folder within entity if not exists
- [ ] Define TypeScript types for request/response in `model/types.ts`
- [ ] Create API endpoints using `baseApi.injectEndpoints()`
- [ ] Define query or mutation methods
- [ ] Specify cache tags for invalidation (`providesTags`, `invalidatesTags`)
- [ ] Export auto-generated hooks from endpoint definition
- [ ] Create barrel export in entity's `index.ts`
- [ ] Handle API errors using global error handling
- [ ] Test API integration with both success and error scenarios
- [ ] Update [CLAUDE.md](CLAUDE.md) API integration section with new endpoints

### Adding a New Feature (User Interaction)

- [ ] Create feature folder in `src/features/feature-name/`
- [ ] Create `ui/` folder for UI components
- [ ] Create `model/` folder for logic, hooks, validation, types
- [ ] Define Zod schema for form validation if feature has forms
- [ ] Create custom hook for feature logic (e.g., `useFeatureName`)
- [ ] Implement UI components using shared UI components
- [ ] Add translations for all UI text to all language files
- [ ] Handle loading and error states
- [ ] Show success/error feedback via toast notifications
- [ ] Create barrel export in `index.ts`
- [ ] Ensure feature respects permissions (use `ProtectedContent` if needed)
- [ ] Test feature with different user roles and permissions
- [ ] Update [DEVELOPMENT.md](DEVELOPMENT.md) if feature introduces new patterns

### Adding a New CRUD Entity

**IMPORTANT: Use Template entity as reference implementation for all patterns below**

- [ ] Study Template entity implementation (`src/entities/template/`, `src/features/template-*/`, `src/widgets/templateList/`)
- [ ] Create entity folder in `src/entities/entity-name/` following Template structure
- [ ] Define TypeScript types in `model/types.ts` (Entity, CreateDto, UpdateDto, ListResponse)
- [ ] Create API endpoints in `api/entityApi.ts` using same RTK Query patterns as Template
- [ ] Define CRUD operations: getAll (with pagination/sort/filter), getById, create, update, delete, restore
- [ ] Configure cache tags for invalidation (same pattern as Template)
- [ ] Create Redux slice in `model/entitySlice.ts` for state (replicate Template slice structure):
  - [ ] Include: page, pageSize, searchQuery
  - [ ] Include sorting: sortBy (field name), sortDescending (boolean)
  - [ ] Include entity-specific filters (e.g., includeDeleted, filterIsActive)
- [ ] Add slice to main store reducer
- [ ] Create features for CRUD operations in `src/features/` (9+ features like Template):
  - [ ] `entity/` - Main drawer form component (create/edit/view modes)
  - [ ] `entity-create/` - Creation feature (opens drawer)
  - [ ] `entity-update/` - Update feature (opens drawer with data)
  - [ ] `entity-delete/` - Delete confirmation with soft delete
  - [ ] `entity-restore/` - Restore soft-deleted items
  - [ ] `entity-search/` - Search with debounced input
  - [ ] `entity-filters/` - Filter and sort UI with tabs (mobile-optimized)
  - [ ] `entity-pagination/` - Pagination controls (optional - can use shared)
- [ ] Create widget in `src/widgets/entityList/` for list display:
  - [ ] Implement infinite scroll with Intersection Observer
  - [ ] Use card-based grid layout (responsive)
  - [ ] Add mobile-optimized filter panel with tabs
  - [ ] Implement touch-friendly button sizes
- [ ] Create page in `src/pages/EntityPage/` using CrudPageLayout widget
- [ ] Add route and navigation as per "Adding a New Page" checklist
- [ ] Add translations for all entity-related text (including sort/filter labels)
- [ ] Define permissions constants for entity operations (View, Create, Edit, Delete)
- [ ] Implement permission checks on routes and actions (same as Template)
- [ ] Use branded colors subtly (NOT for all buttons, only for accents)
- [ ] Ensure mobile-first responsive design (test on mobile viewport)
- [ ] Test all CRUD operations with different user roles
- [ ] Test sorting and filtering functionality
- [ ] Test infinite scroll behavior
- [ ] Update Privacy Policy and Terms of Use if entity stores user data

### Adding a New Permission

- [ ] Add permission constant to `src/shared/lib/guards/permissions.ts`
- [ ] Document permission in backend API documentation
- [ ] Coordinate with backend team to add permission to database
- [ ] Use permission in route guards via `requiredPermissions` prop
- [ ] Use permission in component guards via `ProtectedContent`
- [ ] Test permission with users who have and don't have the permission
- [ ] Update role assignments if needed

### Adding a New Translation Language

- [ ] Create new language folder in `src/shared/config/i18n/locales/`
- [ ] Copy `translation.json` from existing language
- [ ] Translate all keys to new language
- [ ] Import language in `src/shared/config/i18n/i18n.ts`
- [ ] Add language to resources object
- [ ] Test language switching
- [ ] Coordinate with backend to support language in `Accept-Language` header

---

## State Management Rules

### Choosing State Management Solution
- **Server state (API data)**: Always use RTK Query
- **Global app state**: Use Redux Toolkit (auth, filters, pagination)
- **Simple UI state**: Use Zustand (modals, loading indicators, theme)
- **Form state**: Always use React Hook Form
- **Component-local state**: Use useState

### Redux Toolkit Rules
- Create slices in entity or feature `model/` folder
- Slice name must match entity/feature name
- Use `createSlice` for all reducers
- Export actions and reducer separately
- Add slice to main store in `src/app/stores/mainStore/`
- Use typed hooks: `useAppSelector`, `useAppDispatch`
- Avoid deeply nested state; prefer normalized state

### RTK Query Rules
- All API endpoints must use RTK Query (do not use Axios directly in components)
- Inject endpoints into `baseApi` using `injectEndpoints`
- Use query for GET requests, mutation for POST/PUT/DELETE
- Always specify cache tags (`providesTags`, `invalidatesTags`)
- Use `transformResponse` to unwrap envelope if needed
- Export auto-generated hooks from API definition
- Handle loading/error states using hook return values

### Zustand Rules
- Create store in `src/shared/lib/stores/`
- Export hook with `use` prefix (e.g., `useGlobalErrorStore`)
- Keep stores small and focused on single concern
- Use `persist` middleware for localStorage persistence when needed
- Avoid using Zustand for server state

### React Hook Form Rules
- Use for all forms with more than one input
- Combine with Zod for validation (use `zodResolver`)
- Define schema in feature's `model/validation.ts`
- Use `useForm` hook with typed schema
- Use controlled components with `Controller` for custom inputs
- Handle submission with `handleSubmit`
- Display field errors using `formState.errors`

---

## Form Validation Rules

### Schema Definition
- All forms must use Zod for validation
- Define schema in feature's `model/validation.ts`
- Schema name must be descriptive (e.g., `loginSchema`, `createTemplateSchema`)
- Infer TypeScript type from schema using `z.infer<typeof schema>`

### Validation Rules
- Required fields: Use `.min(1)` for strings, `.refine()` for custom rules
- Trim all string inputs: Use `.trim()` on all string fields
- Email validation: Use `.email()` for email fields
- Password validation: Minimum 6 characters, custom requirements via `.refine()`
- Number validation: Use `.min()` and `.max()` for ranges
- Custom error messages: Provide user-friendly messages for all validations

### Form Submission
- Prevent default form submission
- Use `handleSubmit` wrapper for validation
- Show loading state during submission
- Disable submit button during submission
- Clear form after successful submission (if appropriate)
- Show success toast on successful submission
- Handle errors and display via toast or form errors

### Field Errors
- Display field errors below input field
- Use `formState.errors` to access errors
- Error messages must be translated (use `t()` hook)
- Show errors on blur or submit, not on every keystroke

---

## Drawer vs Dialog Pattern

### Critical Rule: Drawers for Forms, Dialogs for Confirmations

**IMPORTANT**: This project uses a strict pattern for Drawer and Dialog components:

- **Drawer (Right Sidebar)**: For ALL CRUD forms (create, edit, view)
- **Dialog (Modal)**: ONLY for confirmations and alerts

### When to Use Drawer (Right Sidebar)

**ALWAYS use Drawer for:**
- Creating new entities (template, user, role, etc.)
- Editing existing entities
- Viewing entity details (read-only mode)
- Multi-field forms with validation
- Forms that may need to reference list data simultaneously

**Why Drawer for Forms:**
- Allows users to see the list while filling out the form
- Provides more vertical space for longer forms
- Better UX for create/edit workflows
- Consistent pattern across the entire application
- Mobile-friendly with full-screen overlay

### When to Use Dialog (Modal)

**ONLY use Dialog for:**
- Delete confirmations
- Destructive action confirmations
- Simple alerts or notifications
- Quick yes/no questions
- Single-purpose actions with 1-2 buttons

**Why Dialog for Confirmations:**
- Forces user attention for critical actions
- Simpler, centered layout for short content
- Clear distinction from forms
- Standard pattern for confirmations

### Drawer Implementation Pattern

**Reference Implementation Files:**
- **Drawer Form Wrapper**: `src/features/template/ui/TemplateDrawerForm.tsx`
- **Form Component**: `src/features/template/ui/TemplateForm.tsx`
- **Drawer State Hook**: `src/features/template/model/useTemplateDrawer.ts`
- **Validation Schema**: `src/features/template/model/validation.ts`
- **Usage in Page**: `src/pages/TemplatesPage/TemplatesPage.tsx`

**Feature Structure:**
```
features/
  entity/
    ui/
      EntityForm.tsx          # Form component (reusable)
      EntityDrawerForm.tsx    # Drawer wrapper with form
    model/
      useEntityDrawer.ts      # Drawer state management
      validation.ts           # Zod schema
```

**Key Implementation Details:**
Study the Template implementation to understand:
- How to structure the drawer component with header, content, footer
- How to handle three modes: create, edit, view
- How to integrate react-hook-form with Zod validation
- How to use RTK Query mutations (create vs update)
- How to show loading states during submission
- How to handle success callbacks and drawer closing
- How to set responsive max-width (`sm:max-w-[600px]`)
- How to handle form reset after drawer closes

### Drawer State Management

**Pattern 1: Feature-level state (Recommended)**

See implementation: `src/features/template/model/useTemplateDrawer.ts`

This hook manages:
- Drawer open/closed state
- Current mode (create/edit/view)
- Selected entity for edit/view
- Functions to open drawer in different modes (`openCreate`, `openEdit`, `openView`)
- Close function with cleanup after animation (300ms timeout)

**Pattern 2: URL-based state (For dedicated edit pages)**

See implementation: `src/pages/TemplateUpdatePage/TemplateUpdatePage.tsx`

This approach uses:
- React Router params for entity ID
- RTK Query to fetch entity data
- Useful for shareable URLs to edit pages

### Drawer Modes

**Three modes supported (see `TemplateDrawerForm.tsx` for implementation):**

1. **Create Mode** (`mode="create"`)
   - Empty form with default values
   - Primary action: "Create" button
   - Title: "Create [Entity]"
   - No entity prop needed

2. **Edit Mode** (`mode="edit"`)
   - Form pre-filled with entity data
   - Primary action: "Save" button
   - Title: "Edit [Entity]"
   - Requires entity prop
   - See how Template handles defaultValues in edit mode

3. **View Mode** (`mode="view"`)
   - All fields read-only/disabled
   - No primary action button
   - Only "Close" button
   - Title: "View [Entity]"
   - Used when user lacks edit permission
   - See how Template passes `isReadOnly` to form component

### Drawer Responsive Behavior

**Desktop (≥ 640px):**
- Drawer slides in from right side
- Max width: 600px
- Page content remains visible (dimmed overlay)
- User can see list while editing

**Mobile (< 640px):**
- Drawer takes full screen
- Slides up from bottom
- Back button or overlay click to close
- Optimized for touch input

### Dialog Implementation Pattern

**For confirmations only - see these examples:**
- **Delete confirmation**: `src/features/template-delete/ui/TemplateDeleteButton.tsx`
- **Restore confirmation**: `src/features/template-restore/ui/TemplateRestoreButton.tsx`
- **Account deletion**: `src/features/account-delete/ui/DeleteAccountButton.tsx`
- **User deletion**: `src/features/user-delete/ui/UserDeleteButton.tsx`
- **Role deletion**: `src/features/role-delete/ui/RoleDeleteButton.tsx`

**Key patterns to follow:**
- Use Dialog component (from `@/shared/ui/dialog`), NOT Drawer
- Include descriptive DialogTitle and DialogDescription
- Show entity name or details in confirmation message
- Use "Cancel" button with `variant="outline"`
- Use action button with appropriate variant (`destructive` for delete)
- Show loading spinner on action button during operation
- Disable action button while operation is in progress
- Use i18n translations for all text (title, message, buttons)
- Handle dialog state with local useState

### Common Mistakes to Avoid

❌ **DON'T:**
- Use Dialog for forms (always use Drawer)
- Use Drawer for confirmations (use Dialog)
- Mix patterns within the same entity
- Forget to handle drawer close animation cleanup
- Hardcode mode - always pass as prop

✅ **DO:**
- Use Drawer for all create/edit/view forms
- Use Dialog for all confirmations and alerts
- Follow Template entity pattern exactly
- Handle loading states in forms
- Show success toast on submission
- Clean up state after drawer closes
- Support all three modes (create/edit/view)
- Check permissions before showing edit mode

### Checklist for New Entity Forms

When implementing a new entity's CRUD forms:

- [ ] Create `EntityForm.tsx` component (form fields only, no Drawer)
- [ ] Create `EntityDrawerForm.tsx` wrapper (adds Drawer + header + footer)
- [ ] Create `useEntityDrawer.ts` hook for state management
- [ ] Support all three modes: create, edit, view
- [ ] Add validation schema in `model/validation.ts`
- [ ] Use RTK Query mutations for API calls
- [ ] Show loading state during submission
- [ ] Disable submit button while submitting
- [ ] Show success toast after successful submission
- [ ] Close drawer after success
- [ ] Handle edit mode with permission check
- [ ] Use read-only view mode if user lacks edit permission
- [ ] Add translations for all drawer text
- [ ] Test on mobile (full screen) and desktop (sidebar)
- [ ] Ensure form resets when drawer closes
- [ ] Use Dialog for delete confirmation (NOT drawer)

---

## Styling Rules

### Tailwind Usage
- Use Tailwind utility classes for all styling
- Do not write custom CSS unless absolutely necessary
- Use design tokens (CSS variables) defined in `src/app/styles/index.css`
- Organize classes: layout → spacing → sizing → colors → typography → effects
- Use responsive modifiers sparingly (mobile-first approach)

### Component Variants
- Use `class-variance-authority` (CVA) for component variants
- Define variants in component file
- Export variant function for reuse (e.g., `buttonVariants`)

### Class Management
- Use `cn()` utility (clsx + tailwind-merge) for conditional classes
- Import from `src/shared/lib/utils/cn.ts`
- Never concatenate Tailwind classes manually

### Color Usage

**Semantic Colors (Primary Usage):**
- Use semantic color tokens: `bg-background`, `text-foreground`, `border-border`
- Use `primary` for general buttons and actions: `bg-primary`, `text-primary-foreground`
- Use destructive for delete/error: `bg-destructive`, `text-destructive-foreground`
- Avoid hardcoded color values (e.g., `bg-blue-500`)

**Branded Colors (Accent Usage Only):**
- **IMPORTANT**: Branded colors exist but must be used subtly and sparingly
- Use `bg-brand`, `text-brand`, `border-brand` ONLY for:
  - Logo and branding elements
  - Active navigation items (current page indicator)
  - Key call-to-action buttons (when appropriate, not all buttons)
  - Important badges or status indicators
  - Hover states for emphasis (very sparingly)
- **DO NOT** use branded colors for:
  - General buttons (use `primary` instead)
  - All form inputs (use `border`)
  - Body text (use `foreground`)
  - Large background sections (use `background` or `card`)
  - Error states (use `destructive`)
- Branded colors must be non-intrusive and used as accents only
- When in doubt, use semantic colors instead of branded colors

### Dark Mode
- All components must support dark mode
- Use CSS variables that change with `.dark` class
- Test all UI in both light and dark mode
- Do not use Tailwind's `dark:` modifier; rely on CSS variables

### Spacing and Layout
- Use consistent spacing scale: `space-y-4`, `gap-4`, `p-4`
- Use flexbox and grid for layouts
- Avoid absolute positioning unless necessary
- Use `max-w-*` for content width constraints

### Typography
- Use semantic font sizes: `text-sm`, `text-base`, `text-lg`
- Use font weight modifiers: `font-medium`, `font-semibold`
- Line height: Use default or `leading-tight`, `leading-relaxed`
- Text color: Use `text-foreground`, `text-muted-foreground`

---

## Error Handling Rules

### API Errors
- All API errors automatically handled by `baseQueryWithReauth`
- Errors displayed via `globalErrorStore` modal
- Do not manually show error toasts for API errors (unless specific to form)

### Form Errors
- Validation errors shown as field errors
- Submission errors shown as toast notifications
- Use `setError` to set manual errors if needed

### React Errors
- All React errors caught by `ErrorBoundaryProvider`
- Fallback UI shown to user
- Errors logged to console

### User Feedback
- Success actions: Show success toast with descriptive message
- Destructive actions: Show confirmation dialog before proceeding
- Long operations: Show loading state (button spinner, skeleton, etc.)

### Error Messages
- All error messages must be user-friendly
- Translate error messages using `resolveApiError` utility
- Avoid technical jargon in user-facing errors
- Provide actionable guidance when possible

---

## Localization Rules

### Translation Keys
- All user-facing text must be translatable
- Define keys in `src/shared/config/i18n/locales/{lang}/translation.json`
- Use dot notation for namespacing (e.g., `common.save`, `auth.loginButton`)

### Key Naming
- Use camelCase for translation keys
- Group related keys under common namespace
- Be specific and descriptive (e.g., `templates.createButton`, not `button.create`)

### Using Translations
- Use `useTranslation` hook in components
- Destructure `t` function: `const { t } = useTranslation()`
- Call `t('key')` to get translated string
- Pass variables using interpolation: `t('greeting', { name: 'User' })`

### Adding Translations
- Add key to all language files simultaneously
- Keep keys in sync across languages
- Use placeholders for dynamic values (e.g., `{{count}}`)

### Language Detection
- Language persisted in localStorage (`app.language`)
- Language sent in `Accept-Language` header for API calls
- User can switch language via `LanguageSwitcher` component

---

## Legal Documents

### Privacy Policy and Terms of Use

**Locations:**
- Privacy Policy: `src/pages/PrivacyPolicyPage/PrivacyPolicyPage.tsx`
- Terms of Use: `src/pages/TermsOfUsePage/TermsOfUsePage.tsx`

### When Updates Are REQUIRED

You MUST update these documents IMMEDIATELY when implementing features that:

**Data Collection:**
- Add analytics or tracking (Google Analytics, Mixpanel, etc.)
- Implement cookies or local storage for user tracking
- Add user behavior monitoring
- Implement A/B testing with user data

**Third-Party Services:**
- Add social login providers (Google, Facebook, GitHub, etc.)
- Integrate payment processors (Stripe, PayPal, etc.)
- Add third-party analytics or monitoring services
- Integrate email services (SendGrid, Mailchimp, etc.)
- Add cloud storage providers for user files

**Authentication Changes:**
- Add biometric authentication
- Implement SSO or SAML
- Add new OAuth providers
- Change password policies

**User-Generated Content:**
- Add comment systems
- Allow file uploads by users
- Implement user profiles with public information
- Add social features (sharing, following, etc.)

**Communication Features:**
- Add newsletter subscriptions
- Implement push notifications
- Add email notifications
- Add in-app messaging

**Data Handling:**
- Change data retention policies
- Add data export/import features
- Change backup procedures
- Modify how user data is stored or processed

### Update Checklist

When updating legal documents:

- [ ] Review Privacy Policy for data privacy implications
- [ ] Review Terms of Use for usage terms implications
- [ ] Update "Last Modified" date in both documents
- [ ] Update all translations (English, Russian, etc.)
- [ ] Review changes with legal counsel if making significant modifications
- [ ] Document what changed and why in git commit message
- [ ] Notify users of material changes (if required by law)

### What to Update

**Privacy Policy sections to review:**
- Information We Collect
- How We Use Your Information
- Third-Party Services
- Data Storage and Security
- Your Rights
- Changes to This Policy

**Terms of Use sections to review:**
- Use of Service
- User Accounts
- Acceptable Use
- User Content
- Third-Party Services
- Limitation of Liability
- Changes to Terms


## Git Rules

- **NEVER** use git commands except reading (git status, git log, git diff)
- Commit often with logical units of work
- Each commit should be atomic (single purpose)
- Avoid committing half-finished features

---

## Documentation Update Requirements

### When to Update Documentation
- **CLAUDE.md**: Update when adding new API endpoints, routes, major features, or architectural changes
- **DEVELOPMENT.md**: Update when introducing new patterns, rules, or development workflows
- **README.md**: Update when project setup changes or new scripts are added
- **TASKS.md**: Update continuously as tasks are completed (clear completed tasks)

---

## Mobile-First Development Rules

### General Principles
- Always write styles for mobile first (base classes without breakpoint prefix)
- Add desktop enhancements with `sm:`, `md:`, `lg:` breakpoints
- Test all features on mobile viewport (< 640px) first
- Ensure touch targets are minimum 48px on mobile

### Responsive Layout Rules
- Use responsive grid columns: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Stack elements vertically on mobile, arrange horizontally on desktop
- Use `flex-col` on mobile, `sm:flex-row` on desktop when appropriate
- Container padding: `p-4` on mobile, `md:p-6` or `lg:p-8` on desktop

### Touch-Friendly Targets
- All interactive elements (buttons, links) must be minimum 48px height on mobile
- Use `min-h-[48px] md:min-h-0` pattern for buttons
- Larger padding on mobile: `px-4 py-3` mobile → `md:px-3 md:py-2` desktop
- Adequate spacing between touch targets: minimum `gap-2` or `space-y-2`

### Collapsible UI Components
- Use Drawer component for mobile panels, inline display for desktop
- Filters and sorting: Drawer on mobile, inline on desktop
- Navigation: Drawer sidebar on mobile, fixed sidebar on desktop
- Example pattern: `<Drawer>` wrapper with conditional rendering

### Responsive Typography
- Body text: `text-sm` on mobile → `text-base` on desktop
- Headings: Scale appropriately (e.g., `text-lg sm:text-xl lg:text-2xl`)
- Line height: Use `leading-relaxed` for readability on small screens

### Hidden/Visible Elements
- Hide labels on mobile, show on desktop: `<span className="hidden sm:inline">`
- Show icons only on mobile: `<Icon className="sm:hidden" />`
- Responsive navigation text: Show icon always, text on desktop only
- Example: `<Icon /><span className="hidden sm:block">Text</span>`

### Mobile Testing Checklist
When implementing mobile-first features, verify:
- [ ] All touch targets are minimum 48px height
- [ ] Text is readable without zooming
- [ ] Forms are usable with on-screen keyboard
- [ ] Dropdowns and modals work correctly on small screens
- [ ] Infinite scroll works smoothly on touch devices
- [ ] Filter/sort panels are accessible via drawer
- [ ] Navigation is accessible via hamburger menu or drawer
- [ ] Images scale correctly on small screens

---

## Sorting and Filtering Rules

### Sorting Implementation
- All list pages with multiple items MUST support sorting
- Use Redux slice to store sort state (sortBy, sortDescending)
- Provide UI for sort field selection and direction toggle
- Sort fields should be entity-appropriate (e.g., name, email, createdAt, updatedAt)

### Sort State Structure
```typescript
// In entity slice
interface EntityState {
  sortBy: 'field1' | 'field2' | 'field3' | null;
  sortDescending: boolean;
  // ... other state
}
```

### Sort UI Pattern
- Use Tabs component to switch between Filters and Sorting
- Provide radio buttons or select for sort field selection
- Provide toggle for sort direction (ascending/descending)
- Show clear visual indication of current sort (e.g., "Name (A→Z)")
- Example: See `src/features/template-filters/ui/TemplateFilters.tsx`

### Filtering Implementation
- Store all filter values in Redux slice
- Debounce search input (300ms-500ms)
- Provide "Clear Filters" button to reset all filters
- Show filter count indicator when filters are active

### Filter UI Pattern (Mobile-First)
```typescript
// Desktop: Inline filters
<div className="hidden md:block">
  <FilterInputs />
</div>

// Mobile: Drawer with tabs
<Drawer>
  <Tabs defaultValue="filters">
    <TabsList>
      <TabsTrigger value="filters">Filters</TabsTrigger>
      <TabsTrigger value="sorting">Sorting</TabsTrigger>
    </TabsList>
    <TabsContent value="filters"><FilterInputs /></TabsContent>
    <TabsContent value="sorting"><SortInputs /></TabsContent>
  </Tabs>
</Drawer>
```

### Integration with API
- Pass sort/filter params to RTK Query endpoint
- Backend should handle sorting and filtering
- Return paginated results based on current page + filters + sort

---

## Infinite Scroll Pattern

### When to Use
- Use for all list pages with more than 20 items
- Provides better mobile UX than traditional pagination
- Reduces initial load time

### Implementation Rules
- Use Intersection Observer API (NOT scroll event listeners)
- Create sentinel element at bottom of list to trigger loading
- Show skeleton placeholders while loading next page
- Show "No more items" message when all items loaded
- Handle errors gracefully with retry button

### Implementation Pattern
```typescript
// 1. Create observer ref
const observerRef = useRef<HTMLDivElement>(null);

// 2. Get data and loading state
const { data, isLoading, isFetching } = useGetEntitiesQuery(params);

// 3. Setup intersection observer
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isFetching && hasMore) {
      dispatch(setPage(page + 1));
    }
  }, { threshold: 0.1 });

  if (observerRef.current) {
    observer.observe(observerRef.current);
  }

  return () => observer.disconnect();
}, [isFetching, hasMore, page]);

// 4. Render list with sentinel
return (
  <>
    {items.map(item => <ItemCard key={item.id} item={item} />)}
    {hasMore && <div ref={observerRef}><Skeleton /></div>}
    {!hasMore && <p>No more items</p>}
  </>
);
```

### Best Practices
- Start with page size of 12-20 items for optimal performance
- Increment page number when sentinel is visible
- Reset page to 1 when filters/sort changes
- Keep previous data visible while fetching next page (no full-page loading)
- Use skeleton placeholders (3-5 skeletons) for loading state
- Disconnect observer on component unmount

---

---

## TypeScript Strict Mode Rules

The project uses `verbatimModuleSyntax` and strict TypeScript. The rules below address recurring build errors that break `docker compose up` and CI. Violations cause type errors that do **not** surface during `vite dev` (which skips `tsc`), but fail at build time.

### Type-Only Imports

When importing only types (no runtime value), use `import { type X }` syntax. This is required by `verbatimModuleSyntax`.

```typescript
// ❌ WRONG — fails build
import { ReactNode } from "react";

// ✅ CORRECT
import { type ReactNode } from "react";
```

**Applies to:** `ReactNode`, interface/type imports across layers. If TypeScript reports `error TS1484: 'X' is a type and must be imported using a type-only import`, add the `type` keyword.

---

### RTK Query — `refetchOnMountOrArgChange` Placement

`refetchOnMountOrArgChange` is **not** a valid property at the endpoint builder level in RTK Query 2.x. It must be passed to the hook call at the component level instead.

```typescript
// ❌ WRONG — causes TS2353 at build
getDailyReportByDate: builder.query({
    query: ...,
    providesTags: [...],
    refetchOnMountOrArgChange: true  // NOT here
})

// ✅ CORRECT — pass at the call site
const { data } = useGetDailyReportByDateQuery(date, {
    refetchOnMountOrArgChange: true
});
```

---

### Barrel Exports — Keep Indexes in Sync

Every type and value defined in `model/types.ts` and used outside the entity **must** be re-exported through the entity's `model/index.ts` and the entity's root `index.ts`.

**Checklist when adding a new type:**
- [ ] Defined in `model/types.ts`
- [ ] Exported from `model/index.ts`
- [ ] Exported from `entities/<entity>/index.ts` (if consumed by other layers)

Failure to do this causes `TS2305: Module has no exported member` at build time even though your editor may resolve it via path aliases.

---

### Zod Schemas + `zodResolver` — Avoid `.default()` in Schema

In `@hookform/resolvers` v5.x with Zod 4, `zodResolver` uses the **input** type (before transformation) for `TFieldValues`. Fields with `.default()` have input type `T | undefined`, which conflicts with the form's generic type and causes a `Resolver` type assignment error.

**Rule:** Do not use `.default()` or `.optional().default()` in Zod schemas passed to `zodResolver`. Instead, provide default values in `useForm`'s `defaultValues` option (which is already required for controlled inputs).

```typescript
// ❌ WRONG — causes TS2322 on zodResolver
const schema = z.object({
    rememberMe: z.boolean().default(false),
    reason: z.string().optional().default("")
});

// ✅ CORRECT — schema defines shape only; defaults live in useForm
const schema = z.object({
    rememberMe: z.boolean(),
    reason: z.string()
});

useForm({
    resolver: zodResolver(schema),
    defaultValues: { rememberMe: false, reason: "" }
});
```

---

### React 19 — `useRef` Returns `RefObject<T | null>`

In React 19, `useRef<T>(null)` returns `RefObject<T | null>`, not `RefObject<T>`. Component prop types that accept refs must reflect this.

```typescript
// ❌ WRONG — causes TS2322 when a React 19 ref is passed
interface Props {
    containerRef: React.RefObject<HTMLDivElement>;
}

// ✅ CORRECT
interface Props {
    containerRef: React.RefObject<HTMLDivElement | null>;
}
```

---

### API Request Types — Only Pass Fields the Type Declares

When calling an RTK Query mutation, only pass properties that exist on the request type. Do not pass extra fields from form state (e.g., `confirmPassword`) that are only needed for frontend validation.

```typescript
// ❌ WRONG — ChangePasswordRequest has no confirmPassword field
await changePassword({
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
    confirmPassword: data.confirmPassword  // frontend-only field
}).unwrap();

// ✅ CORRECT — strip frontend-only fields before the API call
await changePassword({
    currentPassword: data.currentPassword,
    newPassword: data.newPassword
}).unwrap();
```

---

### Avoid Duplicate Keys in Object Spreads

When building a fallback object that includes a spread of `args`, do not also explicitly include a field that already exists in `args`.

```typescript
// ❌ WRONG — 'id' appears twice (TS2783)
const fallback = { id: args.id, ...args };

// ✅ CORRECT — args already contains id
const fallback = { ...args };
```

---

### Remove Unused Declarations Before Committing

The following patterns cause `TS6133` errors and fail the build:
- Variables declared but never read (e.g., `const isDrawerOpen = ...`)
- Imported names that are never used in the file
- Callback parameters that are not read (prefix with `_` to signal intentional discard)

```typescript
// ❌ WRONG — isDrawerOpen declared but never used
const isDrawerOpen = drawerState.type !== "closed";

// ❌ WRONG — unused import
import { Button, Input, PasswordInput } from "@/shared/ui"; // Input unused

// ❌ WRONG — unused callback param causes TS6133
const handleDeleted = useCallback((roleId: string) => { refetch(); }, [refetch]);

// ✅ CORRECT — prefix with _ to indicate intentional discard
const handleDeleted = useCallback((_roleId: string) => { refetch(); }, [refetch]);
```

---

### Verify Store Property Names Before Using

When selecting from a Zustand store, verify the property name against the store's type definition. Accessing a non-existent property silently returns `undefined` in JS but fails TypeScript build.

```typescript
// ❌ WRONG — 'resolvedTheme' does not exist on ThemeStoreState
const theme = useThemeStore((state) => state.resolvedTheme);

// ✅ CORRECT — check the store definition in shared/lib/stores/
const theme = useThemeStore((state) => state.theme);
```

---

### Shared Layout Components — Make Optional What Isn't Always Used

When adding required props to shared layout widgets (e.g., `CrudPageLayout`), consider whether every consumer of that widget will always need that prop. If any page omits the prop (e.g., a list page without search), the prop must be optional.

```typescript
// ❌ WRONG — forces every page to pass a search handler even if irrelevant
interface CrudPageLayoutProps {
    searchValue: string;           // required
    onSearchChange: (v: string) => void;  // required
}

// ✅ CORRECT — optional props, rendered conditionally inside the component
interface CrudPageLayoutProps {
    searchValue?: string;
    onSearchChange?: (v: string) => void;
}
```

---

### Pre-commit Build Check

`vite dev` does **not** run `tsc`. Type errors are invisible during development but break `npm run build` (and therefore Docker). Before pushing or opening a PR, always run:

```bash
npm run build
```

This runs `tsc -b` followed by the Vite build. Fix all TypeScript errors before committing. If CI or Docker fails with TypeScript errors, they will never appear during local `vite dev`.

---

## Enforcement

All rules in this document are **mandatory**. Pull requests that violate these rules will not be approved until corrected.

If you need to deviate from a rule, discuss with the team first and document the exception in this file.
