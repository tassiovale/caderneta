# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Caderneta de notas — a school gradebook system. Monorepo with two independent Node projects: `backend` (Express + Sequelize + SQLite REST API) and `frontend` (React + Vite + MUI SPA). They run as separate dev servers and communicate over HTTP.

Current scope: cadastro (CRUD) of Alunos (students), Turmas (classes), and Disciplinas (subjects). Grade entry, average calculation, and pass/fail status are planned but not yet implemented.

## Commands

Backend (run from `backend/`):
- `npm run dev` — start API server with nodemon (auto-reload), port 3001
- `npm start` — start API server without reload
- No test suite or lint config exists yet.

Frontend (run from `frontend/`):
- `npm run dev` — start Vite dev server, port 5173, proxies `/api/*` to `http://localhost:3001` (see `vite.config.js`)
- `npm run build` — production build
- `npm run lint` — run oxlint
- `npm run preview` — preview production build

Both dev servers must be running simultaneously for the app to work end-to-end.

## Architecture

### Backend (`backend/src`)

- `config/database.js` — Sequelize instance, SQLite dialect, file storage at `backend/database.sqlite` (gitignored, created on first run via `sequelize.sync()` in `server.js`).
- `models/` — one file per model (`Aluno`, `Turma`, `Disciplina`), all built with `sequelize.define`. `models/index.js` is the only place associations are wired up and is the required import point for models elsewhere (routes import `require('../models')`, never the individual model files directly):
  - `Turma.hasMany(Aluno)` / `Aluno.belongsTo(Turma)` via `turmaId` FK — a student belongs to exactly one class.
  - `Turma.belongsToMany(Disciplina)` through implicit join table `TurmaDisciplina` — a class has many subjects and a subject can belong to many classes.
- `routes/` — one router per resource, mounted in `server.js` under `/api/alunos`, `/api/turmas`, `/api/disciplinas`. Routes call model methods directly (no service/controller layer). `turmas.js` routes accept a `disciplinaIds` array in the request body and use `turma.setDisciplinas(disciplinaIds)` to sync the association on create/update.
- Express 5 is in use, which auto-forwards rejected promises from async route handlers to the error middleware — no need for `express-async-errors` or manual try/catch around normal async logic.

### Frontend (`frontend/src`)

- `api.js` — single axios instance (`baseURL: '/api'`) plus three thin per-resource clients (`alunosApi`, `turmasApi`, `disciplinasApi`). All HTTP calls go through this file; pages never call axios directly.
- `App.jsx` — route table only (`/alunos`, `/turmas`, `/disciplinas`), wrapped in `components/Layout.jsx` (MUI AppBar + Tabs synced to the current route).
- `pages/*Page.jsx` — one page per resource, each self-contained: local state for the list, the dialog form, and the delete target; loads data with the matching `*Api.list()` on mount. There is no global state management (no Redux/Context) — each page owns its data.
- `components/ConfirmDialog.jsx` — shared delete-confirmation dialog used by all three pages.
- `TurmasPage.jsx` renders a multi-select of Disciplinas and submits `disciplinaIds`; `AlunosPage.jsx` renders a single-select of Turmas and submits `turmaId`.

### MUI version note

This project uses **MUI v9**, which renamed several `TextField` prop APIs. Use `slotProps` instead of the deprecated per-feature props:
- `slotProps={{ select: { multiple: true, renderValue: ... } }}` instead of `SelectProps`
- `slotProps={{ inputLabel: { shrink: true } }}` instead of `InputLabelProps`

Passing the old prop names silently renders them as invalid DOM attributes (React logs a console warning) and multi-select value handling breaks silently — this bit the initial implementation of the Turmas form. When adding new form fields with `TextField` sub-component customization, check the MUI v9 docs rather than copying patterns from older MUI examples.

## Validação de formulários

Todo campo de formulário (frontend) deve ter validação dos dados inseridos antes do envio — required, tipo, formato e limites coerentes com o campo (ex.: e-mail, datas, campos numéricos, tamanho máximo de texto). Exiba mensagens de erro claras ao usuário e bloqueie o submit enquanto houver campos inválidos.
