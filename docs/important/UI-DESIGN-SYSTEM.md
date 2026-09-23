# UI & Design System Governance: Next.js + TypeScript

## 1. Internal UI System Primitives
To maintain visual consistency and lean dependencies, use the following internal primitives from `components/ui/`:
`Button`, `Input`, `Select`, `Textarea`, `Checkbox`, `FormField`, `Modal/Dialog`, `Table`, `Badge`, `Alert`, `Toast`, `Spinner`, `Skeleton`, `EmptyState`, `ErrorState`, `ConfirmDialog`, `Pagination`.

## 2. Toast Policy (Mandatory Rule)
- **Appropriate Toast Usage**: Brief, non-critical global feedback for asynchronous actions (e.g., "Product created successfully", "Export started", "Session expired").
- **Inappropriate Toast Usage**: Toasts MUST NOT be used for inline form field validation errors, page-level fetch failures, or critical destructive action confirmations.
- **Form Error Handling**: Form validation errors must be rendered inline next to their respective form fields using `FormField`.

## 3. UI States Matrix
Every feature view must handle all UI states explicitly:
1. **Loading State**: Skeletons or spinners during initial fetch.
2. **Empty State**: Friendly messaging and call-to-action when data list is empty.
3. **No Results State**: Specific feedback when search/filter yields zero results.
4. **Error State**: Actionable error boundary with retry capability.
5. **Success State**: Clear confirmation of completed operations.
6. **Permission Denied State**: Informative 403 Forbidden message.
