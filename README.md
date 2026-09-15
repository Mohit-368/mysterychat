# MysteryChat

A full-stack anonymous-room chat application built with React, Tailwind CSS, Express, MongoDB and Socket.IO.

## Features

- Account registration and login with HTTP-only JWT cookies
- Protected chat workspace
- Create and browse rooms
- Join rooms
- Persistent message history with a 100-message window
- Realtime-ready Socket.IO backend
- REST fallback for sending/loading messages
- Responsive dark UI
- Basic validation and authorization checks

## Run locally

### 1. Backend

```bash
cd backend
cp .env.example .env
# Set MONGO_URI and JWT_SECRET in .env
npm install
npm run dev
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`.

## Environment

Backend requires `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT`, and `NODE_ENV`.

Frontend uses `VITE_API_URL`.

## Important privacy note

This project stores registered account data and chat messages in MongoDB. Therefore claims such as "zero tracking", "end-to-end secure", or "messages vanish when a room closes" should not be presented as guarantees unless the storage and logging model is changed accordingly.
