# AssetDesk

AssetDesk is an IT asset management web app. It helps a company keep track of its laptops, monitors, desktops and accessories: who each device is assigned to, its condition, and whether it is available.

This repository holds **Part 1** of the SE411 course project at Prince Sultan University: a React frontend whose data lives in memory. In **Part 2** the team will connect it to a Java Spring Boot REST API. The data layer already has the same shape as that API, so only one file will change (see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#part-2-plan)).

## Features

- **Dashboard:** totals by status, a bar chart of assets by type, and a "Needs attention" list of devices in repair or in fair/damaged condition.
- **Asset list:** a paginated table (5, 10 or 20 rows per page) with status chips.
- **Find by ID:** opens an asset's details page directly from its ID.
- **Filters:** text search (device name, serial or employee), Type, Condition and Status. Filters combine, and they are kept in the URL so refresh and Back keep them.
- **Details page** for each asset.
- **Add and edit** with one shared form. It shows inline validation messages, and a duplicate serial number is rejected.
- **Delete** with a confirm dialog.
- **Toasts** confirm every change.
- **Menu:** a sidebar that is pinned on desktop and becomes a slide-over drawer on phones.
- **About page** with the team members.
- **Light and dark themes** that follow the system setting. The layout is responsive down to 360 px and works with the keyboard.

## Tech stack

| Area | Tools |
|---|---|
| UI | React 18, React Router 6 |
| Build | Vite |
| Styling | Plain CSS with design tokens (CSS custom properties), IBM Plex Sans and Mono |
| Data (Part 1) | Async in-memory service (`src/services/assetService.js`) |
| Tests | Vitest, React Testing Library, user-event, jest-dom, jsdom |
| Linting | ESLint (Vite's React config) |
| Backend (Part 2) | Java Spring Boot REST API (planned) |

## Getting started

You need [Node.js](https://nodejs.org/) 20.19+ or 22.12+ (npm comes with it).

```bash
npm install        # install dependencies
npm run dev        # start the dev server, then open the URL it prints (usually http://localhost:5173)
```

Other scripts:

| Command | What it does |
|---|---|
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Check the code with ESLint |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build locally |

Data is kept in memory only, so reloading the page restores the 12 sample assets.

## Project structure

```
src/
  pages/        one component per screen (Dashboard, Assets, Details, Add, Edit, About, Not found)
  components/   reusable UI (TopBar, Sidebar, AssetTable, FilterBar, AssetForm, ConfirmDialog, …)
  services/     assetService (the only module that touches data), ApiError, validateAsset
  hooks/        data loading, delete flow, media queries
  data/         enums and labels, seed assets, team list
  styles/       tokens.css (colours) and global.css
  tests/        Vitest + React Testing Library tests
docs/
  REQUIREMENTS.md   functional and non-functional requirements, user stories, validation rules
  ARCHITECTURE.md   component tree, routing, data flow, service contract, Part 2 plan
```

## Documentation

- [Requirements](docs/REQUIREMENTS.md)
- [Architecture](docs/ARCHITECTURE.md)

## Screenshots

_Screenshots will be added here._

| Screen | Image |
|---|---|
| Dashboard | _todo_ |
| Assets list with filters | _todo_ |
| Asset details | _todo_ |
| Add / Edit form | _todo_ |
| Phone menu | _todo_ |
| About | _todo_ |

## Team

| # | Name | Student ID |
|---|---|---|
| 1 | Tala Alothaim | 223410047 |
| 2 | Reema Alsabhan | 222511316 |
| 3 | Norah Aljasser | 222410205 |

SE411 – Course Project · Prince Sultan University

## Note on AI use

The frontend was generated with an AI tool, Claude Code, from the team's written build prompt and an approved HTML mockup. The team reviewed and tested the result. The Part 2 Spring Boot API will be written by hand.
