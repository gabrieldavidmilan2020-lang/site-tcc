# TCC Server

Backend simples para o projeto TCC.

Instalação e execução:

```bash
cd server
npm install
npm start
```

O servidor roda por padrão em `http://localhost:3000`.

Rotas principais:
- `POST /api/register` { username, password }
- `POST /api/login` { username, password }
- `GET /api/progress` (Authorization: Bearer <token>)
- `POST /api/save` { faseAtual, pontos } (Authorization header)

Observação: em produção troque `JWT_SECRET` e proteja HTTPS.
