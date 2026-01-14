# QuistonPe

Lightweight invoice manager built with React and Tailwind CSS.

---

## Setup & Run

### Prerequisites
- React js 
- npm or yarn

### Installation
1. Clone the repo:
   ```bash
   git clone <repo-url>
   cd quistonpe
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Run locally
- Start dev server:
  ```bash
  npm start
  # or
  yarn start
  ```
  App will be available at http://localhost:3000

### Build for production
```bash
npm run build
# or
yarn build
```

---

## Approach

### Component structure
- `src/Components/`
  - `InvoiceContext.js` — central state for invoices (localStorage persistence, helpers for status/days, and actions).
  - `InvoicePage.js` — page that renders the invoice list and add modal.
  - `InvoiceList.js` — search / filter / pagination + renders `InvoiceCard` or `InvoiceRow`.
  - `InvoiceCard.js` / `InvoiceRow.js` — UI for invoice details (card and table layouts respectively).
  - `AddInvoiceModal.js` / `NewInvoicePage.js` — create new invoices flow and validation.
  - `SummaryPage.js`, `SummaryCards.js`, `InvoiceChart.js` — summary dashboard and charts.
  - `ImageCarousel.js` — image/header area (handles dark-mode background corrections).
  - `ExportCSV.js` — CSV export of invoices.

### Optimization techniques used
- useMemo in `InvoiceList` to avoid recalculating filtered & sorted lists on every render.
- useCallback in `InvoiceContext` and components to memoize handlers passed as props.
- Pagination (limits rendered items to a small page size).
- LocalStorage caching to persist invoices and avoid re-fetch operations.
- Simple, focused components for easier rendering boundaries.

### Challenges faced
- Ensuring dark mode styles matched image backgrounds in the carousel and improving readability.
- Invoice/payment logic: handling missing or legacy `amountPaid` values and ensuring totals & summaries reflected actual payments.
- Balancing responsive layout with compact UI elements for both mobile and desktop.

---

## Performance Optimizations

- Memoized expensive derived data:
  - `useMemo` for filtered/sorted invoices so filtering and sorting only run when inputs change.
- Stable callbacks:
  - `useCallback` for functions used as dependencies or passed to child components (reduces needless re-renders).
- Pagination:
  - Limits DOM nodes rendered per page improving responsiveness on large datasets.
- Local data normalization:
  - Normalized invoice data on load (rounding, ensuring `amountPaid`) to prevent incorrect calculations and repeated conversions.

Why these choices:
- They are lightweight, low-risk optimizations that provide real user-visible gains (faster filtering, less layout thrash) without much complexity.

---

## Data & Business Logic

- Invoice status is calculated from `dueDate` and `paymentDate`:
  - `Paid` when `paymentDate` exists
  - `Overdue` if due date is past and unpaid
  - `Pending` otherwise
- Payment tracking:
  - `amountPaid` field added (defaults to `0`) and set to invoice amount when marking as paid (supports future partial payments).
- Summary metrics (`totalOutstanding`, `totalOverdue`, `totalPaidThisMonth`) use `amountPaid` explicitly to avoid double-counting and to reflect partial payments accurately.

---

## Time Breakdown (example estimates)
- Design & Planning: 2 hours
- Development: 6 hours
- Testing & Debugging: 2 hours
- Total: 10 hours

> These are suggested estimates — update them to reflect your actual timeline.

---




