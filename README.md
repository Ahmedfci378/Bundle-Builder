<div align="center">

# 🛡️ Security System Bundle Builder

A data-driven React application for building and pricing a custom home security system in real time.

**React 19 • TypeScript • Vite • Bootstrap • Context API • useReducer**

</div>

---

# Overview

Bundle Builder is a multi-step product configurator that allows users to build a custom home security system by selecting cameras, sensors, accessories, and a monitoring plan.

The application is completely data-driven. Products, categories, variants, pricing, discount rules, and shipping methods are all loaded from a JSON catalog, allowing business changes without modifying the application code.

---

# Features

- Multi-step bundle builder
- Dynamic JSON-driven catalog
- Product variants
- Quantity management
- Live pricing updates
- Discount engine
- Shipping calculation
- Review panel
- Responsive design
- LocalStorage autosave
- Named saved configurations
- Accessible UI
- Skeleton loading states

---

# Tech Stack

- React 19
- TypeScript
- Vite
- Bootstrap 5
- Sass
- Context API
- useReducer
- LocalStorage

---

# Project Structure

```
src/
│
├── app/
├── components/
├── context/
├── data/
├── domain/
├── hooks/
├── services/
├── state/
├── styles/
├── types/
└── utils/
```

The project follows a layered architecture where UI, business logic, state management, and services are separated to improve maintainability and scalability.

---

# Architecture

The application is organized into four main layers:

```
JSON Catalog
      │
      ▼
 Catalog Provider
      │
      ▼
Builder Context (Reducer)
      │
      ▼
 Custom Hooks
      │
      ▼
Pure Selectors & Domain Logic
      │
      ▼
 UI Components
```

### Main architectural decisions

- JSON is the single source of truth.
- Pricing and discount calculations are pure functions.
- Components contain presentation logic only.
- Business logic lives inside hooks and domain modules.
- Context API + useReducer was chosen instead of Redux because the application has a moderate state size and doesn't require external state libraries.

---

# State Management

The application uses:

- Context API
- useReducer
- Memoized selectors
- Custom hooks

Derived values such as totals, discounts, shipping, and completion status are calculated rather than stored in state.

---

# Performance

Implemented optimizations include:

- React.memo
- useMemo
- useCallback
- Debounced LocalStorage autosave
- Split Contexts (State / Dispatch)
- Pure selectors
- Skeleton loading

---

# Accessibility

- Keyboard accessible controls
- ARIA labels
- Live regions
- Focus-visible styles
- WCAG touch targets
- Accessible accordion

---

# Installation

Clone the repository

```bash
git clone <https://github.com/Ahmedfci378/Bundle-Builder.git>
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Build for production

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

# Decisions

- Chose a data-driven architecture instead of hardcoded products.
- Used Context API + useReducer to avoid unnecessary complexity.
- Separated business logic from UI.
- Implemented a reusable pricing engine that supports multiple discount types.
- Used LocalStorage for persistence instead of introducing a backend.

---

# Tradeoffs

Due to the scope of the assignment:

- Product catalog is loaded from a local JSON file.
- Persistence uses LocalStorage instead of an API.
- Checkout flow is mocked.
- No authentication.
- No automated tests.

---

# Future Improvements

- Backend integration
- User authentication
- Unit & integration tests
- API-driven catalog
- Internationalization (i18n)
- Payment integration

---

# Author

**Ahmed Abdelhameed**

GitHub:
https://github.com/Ahmedfci378

LinkedIn:
https://www.linkedin.com/in/ahmed-abdelhameed-bbb3a8196

Email:
ahmedfci378@gmail.com

---

# License

This project is licensed under the MIT License.