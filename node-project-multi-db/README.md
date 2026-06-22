# Multi DB — Backend + Frontend (React + Docker)

Aplicação fullstack com **Node/Express** no backend, **React + Tailwind CSS** no
frontend e **Docker Compose** orquestrando tudo (MySQL, MongoDB, API e web).

---

## ✨ Funcionalidades

- **Autenticação JWT** (login + cadastro) com senha hasheada (bcrypt).
- **Controle de acesso por papel** (`admin` / `user`).
- **Produtos** (MySQL/Sequelize): listar, criar, editar e remover.
- **Usuários** (MongoDB/Mongoose): listar, criar, editar e remover (admin).
- **Rotas protegidas** no frontend (`ProtectedRoute`) e no backend (middleware).
- Interface **responsiva** (desktop e mobile) com Tailwind CSS.
- Notificações de **sucesso/erro** em todas as operações.

---

## 🧱 Arquitetura

```
┌────────────┐   /api/* (proxy nginx)   ┌────────────┐
│  Frontend  │ ───────────────────────▶ │  Backend   │
│ React+Vite │  http://localhost:8080   │  Express   │ :3000
│  + Tailwind│                          │            │
└────────────┘                          └─────┬──────┴──────┐
                                              │             │
                                         ┌────▼────┐  ┌─────▼─────┐
                                         │  MySQL  │  │  MongoDB  │
                                         │ produtos│  │  usuários │
                                         └─────────┘  └───────────┘
```

| Serviço   | Tecnologia        | Porta | Descrição                          |
|-----------|-------------------|-------|------------------------------------|
| `app`     | Node + Express    | 3000  | API REST com auth JWT              |
| `frontend`| React + Vite + nginx | 8080 | SPA servida por nginx com proxy `/api` |
| `mysql_db`| MySQL 8           | 3306  | Banco de **produtos**              |
| `mongo_db`| MongoDB           | 27017 | Banco de **usuários**              |

---

## 🚀 Subir a aplicação completa (Docker Compose)

> Pré-requisitos: **Docker** e **Docker Compose** instalados.

1. **(Opcional)** Configure variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
   Ajuste `JWT_SECRET`, `ADMIN_EMAIL` e `ADMIN_PASSWORD` conforme necessário.

2. Suba todos os serviços:
   ```bash
   docker compose up --build
   ```
   > Em Docker Compose antigo, use `docker-compose up --build`.

3. Acesse:
   - **Frontend:** http://localhost:8080
   - **Backend (API):** http://localhost:3000
   - **Login padrão:** `admin@example.com` / `admin123`

---

## 🔐 Autenticação & Autorização

- `POST /auth/register` — cadastra novo usuário (o **primeiro** usuário vira `admin` automaticamente).
- `POST /auth/login` — devolve `{ token, user }`.
- `GET /auth/me` — retorna o usuário autenticado.
- Rotas de produtos exigem **autenticação**.
- Rotas de usuários (escrita) exigem papel **`admin`**.
- O token JWT é enviado no header `Authorization: Bearer <token>` (injetado automaticamente pelo `axios`).

---

## 🗂️ Estrutura do projeto

```
.
├── src/                       # Backend (Express)
│   ├── config/db.js
│   ├── controllers/
│   ├── middlewares/           # AuthMiddleware, GlobalMiddleware
│   ├── models/
│   ├── repositories/
│   ├── services/
│   └── app.js
├── frontend/                  # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/        # Button, Input, Layout, ProtectedRoute...
│   │   ├── context/           # AuthContext, ToastContext
│   │   ├── pages/             # Login, Register, Dashboard, Products, Users
│   │   ├── services/          # api (axios), auth/product/user services
│   │   └── App.jsx
│   ├── Dockerfile             # build estático + nginx
│   ├── nginx.conf             # SPA fallback + proxy /api
│   └── package.json
├── docker-compose.yml         # orquestra os 4 serviços
├── .env.example
└── README.md
```

---

## 💻 Execução local (sem Docker, para desenvolvimento)

**Backend:**
```bash
npm install
npm start          # http://localhost:3000 (requer MySQL e MongoDB locais)
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev        # http://localhost:5173 (proxy /api -> :3000)
```

---

## 🧪 Rotas da API

| Método | Rota              | Acesso        | Descrição               |
|--------|-------------------|---------------|-------------------------|
| POST   | `/auth/register`  | público       | Cadastro + token        |
| POST   | `/auth/login`     | público       | Login + token           |
| GET    | `/auth/me`        | autenticado   | Perfil atual            |
| GET    | `/products`       | autenticado   | Listar produtos         |
| POST   | `/products`       | autenticado   | Criar produto           |
| PUT    | `/products/:id`   | autenticado   | Atualizar produto       |
| DELETE | `/products/:id`   | autenticado   | Remover produto         |
| GET    | `/users`          | admin         | Listar usuários         |
| POST   | `/users`          | admin         | Criar usuário           |
| PUT    | `/users/:id`      | admin         | Atualizar usuário       |
| DELETE | `/users/:id`      | admin         | Remover usuário         |
