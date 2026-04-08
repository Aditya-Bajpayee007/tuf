# Interactive Wall Calendar

A modern, animated wall-calendar component built with React, Vite and Framer Motion.

This project is a compact interactive calendar that supports month navigation (mouse-wheel 3D flip and button slide), day and range selection, and editable notes that persist to localStorage.

**Key features**
- **Animated navigation:** Smooth 3D flip on scroll and horizontal slide on button clicks (framer-motion).
- **Notes:** Per-month and per-range notes persisted to localStorage.
- **Theming:** Monthly themed images and color accents (centralized in `src/components/calendarThemes.js`).
- **Modular:** Split into reusable components for readability and maintainability.

**Tech stack**
- React + Vite
- date-fns
- framer-motion
- lucide-react (icons)
- Tailwind-style utility classes (used throughout components)

**Project structure (important files)**
- [src/components/Calendar.jsx](src/components/Calendar.jsx)
- [src/components/HeroHeader.jsx](src/components/HeroHeader.jsx)
- [src/components/CalendarGrid.jsx](src/components/CalendarGrid.jsx)
- [src/components/NotesColumn.jsx](src/components/NotesColumn.jsx)
- [src/components/calendarThemes.js](src/components/calendarThemes.js)
- [src/components/calendarUtils.js](src/components/calendarUtils.js)

**Design note**

Instead of using CSS `clip-path` or other clipping techniques, this project uses an SVG Bezier curve path to create the decorative header shape and mask over the cover image. The SVG path provides a smooth, resolution-independent curve that is easy to animate or adjust — see [src/components/HeroHeader.jsx](src/components/HeroHeader.jsx) for the implementation.

**Installation**

Requirements: Node.js (18+ recommended)

Install dependencies:

```bash
npm install
```

**Development**

Start the dev server:

```bash
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

**Build / Preview**

```bash
npm run build
npm run preview
```

**Notes & tips**
- Notes are saved under the `localStorage` key `calendar-master-notes`.
- If you change or customize CSS, ensure Tailwind (or your utility system) is configured in the project.

If you'd like, I can also:
- Run the dev server now and confirm the app boots locally.
- Convert components to TypeScript or add tests.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
