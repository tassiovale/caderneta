# Caderneta de Notas

Sistema de caderneta de notas escolar. Monorepo com dois projetos Node independentes que se comunicam via HTTP:

- **backend** — API REST em Express + Sequelize + SQLite
- **frontend** — SPA em React + Vite + MUI

## Escopo atual

Cadastro (CRUD) de Alunos, Turmas e Disciplinas. Lançamento de notas, cálculo de médias e situação de aprovação ainda não foram implementados.

## Funcionalidades

Cada recurso tem sua própria página, com listagem em tabela, formulário em dialog (criar/editar) e exclusão com confirmação.

### Alunos

- Campos: nome, matrícula (única — tentativa de duplicata retorna erro amigável) e data de nascimento (opcional).
- Vínculo com uma única Turma, selecionada em campo `select`.
- Listagem, criação, edição e exclusão via `/api/alunos`.

### Turmas

- Campos: nome e ano/série.
- Vínculo com múltiplas Disciplinas via campo `multi-select`; a associação é sincronizada por completo a cada criação/edição (a lista enviada substitui a anterior).
- Listagem, criação, edição e exclusão via `/api/turmas`.

### Disciplinas

- Campos: nome e carga horária (opcional).
- Pode estar associada a várias Turmas (relação N:N).
- Listagem, criação, edição e exclusão via `/api/disciplinas`.

### Validação e UX

- Todo campo de formulário é validado no frontend antes do envio (obrigatoriedade, tipo, formato e limites coerentes com o campo), com mensagens de erro exibidas ao usuário e submit bloqueado enquanto houver campos inválidos.
- Exclusão de qualquer registro exige confirmação em dialog (`ConfirmDialog`).

## Como rodar

Os dois servidores precisam estar rodando simultaneamente.

### Backend

```bash
cd backend
npm install
npm run dev
```

Sobe em `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Sobe em `http://localhost:5173` e faz proxy de `/api/*` para o backend.

## Scripts

**Backend** (`backend/`):
- `npm run dev` — servidor com auto-reload (nodemon)
- `npm start` — servidor sem auto-reload

**Frontend** (`frontend/`):
- `npm run dev` — servidor de desenvolvimento Vite
- `npm run build` — build de produção
- `npm run lint` — lint com oxlint
- `npm run preview` — preview do build de produção

## Estrutura

```
backend/src/
  config/database.js   # instância Sequelize (SQLite)
  models/               # Aluno, Turma, Disciplina + associações (models/index.js)
  routes/               # um router por recurso, montados em /api/*
  server.js

frontend/src/
  api.js                # instância axios + clients por recurso
  App.jsx               # rotas
  pages/                # uma página por recurso (Alunos, Turmas, Disciplinas)
  components/           # Layout, ConfirmDialog
```

Mais detalhes de arquitetura e convenções em [CLAUDE.md](./CLAUDE.md).
