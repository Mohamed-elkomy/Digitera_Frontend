# Golden Reference Specifications (Products CRUD): Next.js + TypeScript

## 1. Overview
The **Products Feature** serves as the **GOLDEN CRUD REFERENCE** for all future feature implementations in this repository.

## 2. Reference Capabilities Matrix
Every Products CRUD implementation must demonstrate all 18 capabilities:

1. **List View**: Paginated tabular and grid layout.
2. **Search**: Debounced keyword search via URL search params.
3. **Filtering**: Category and status filtering synchronized with URL state.
4. **Sorting**: Multi-column sorting (e.g., price, name, date) via URL state.
5. **Pagination**: Page size selection and page navigation via URL state.
6. **Create**: Modal/page form with schema validation and server error mapping.
7. **Update**: Pre-filled form with dirty state tracking and unsaved changes confirmation.
8. **Delete**: Destructive action confirmation dialog (`ConfirmDialog`).
9. **Form Validation**: Real-time client-side and server-side validation error mapping.
10. **Permission-Aware Actions**: Buttons disabled or hidden based on user permissions (`products:create`, `products:delete`).
11. **Loading State**: Skeleton placeholders during data fetching.
12. **Empty State**: Engaging empty state UI with "Create Product" CTA when list is empty.
13. **No Search Results State**: Clear state when search returns no matching records.
14. **Error State**: Actionable error boundary with a "Retry" button.
15. **Success Feedback**: Concise toast notification upon successful create/update/delete.
16. **Responsive Layout**: Seamless experience across Mobile, Tablet, and Desktop.
17. **Accessibility (a11y)**: Full keyboard navigation, visible focus indicators, screen reader labels.
18. **Testing Baseline**: Unit tests for schema/services and integration tests for UI flows.
