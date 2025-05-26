# Socket Server Documentation

## Overview

This server provides real-time WebSocket communication using **Socket.IO**, with Express as the HTTP framework. It includes modular event handlers, middleware authentication, and stateful gameplay logic (**like Tic Tac Toe, Checkers, etc**).

---

## 📁 Project Structure (Relevant)

```
src/
├── config/
│   └── env.handler.ts
├── constants/
│   └── ...
├── handlers/
│   ├── handler.ts
│   ├── test.handler.ts
│   └── tic-tac-toe.handler.ts
├── middleware/
│   └── auth.middleware.ts
├── rooms/
│   └── ...
├── services/
│   └── socket.service.ts
├── stores/
│   └── user.store.ts
├── utils/
│   └── ...
├── server.ts
└── index.ts -> entry point

```

---

## 🧩 Middleware

### `authMiddleware`

- Validates the socket connection.
- Injects `socket.data.user` if valid.
- Used globally via `io.use(authMiddleware)`.

---

## ⚙️ SocketService

### File: `socket.service.ts`

Handles:

- Initialization of socket server.
- Middleware registration.
- Global `connection`/`disconnect` listeners.
- Delegates events to modular handlers.

```ts
io.use(authMiddleware);
io.on("connection", this.onConnection.bind(this));
```

---

## 📦 Handlers

Handlers extend a base `EventHandler` and register events in the format:  
**\`\${namespace}:\${subNamespace}:\${event}\`**  
(e.g. `games:tic-tac-toe:create`)

---

### 🔧 `TestHandler`

#### Namespace: `tests`

| Event  | Description                                |
| ------ | ------------------------------------------ |
| `test` | Simple test event for socket functionality |

#### Usage:

```ts
socket.emit("tests:test", {});
```

---

### 🎮 `TicTacToeHandler`

#### Namespace: `games:tic-tac-toe`

##### Common Requirements:

- Socket must be authenticated.
- Player must not already be in a game.

| Event         | Payload                                | Description                                             |
| ------------- | -------------------------------------- | ------------------------------------------------------- |
| `create`      | —                                      | Creates a private Tic Tac Toe room                      |
| `join`        | `{ roomCode: string }`                 | Joins an existing private room by code                  |
| `random`      | —                                      | Joins/creates a random available room                   |
| `start`       | `{ roomId: string }`                   | Starts the game if room is full and player is host      |
| `move`        | `{ roomId: string, cell: number }`     | Makes a move in the game                                |
| `restart`     | `{ roomId: string }`                   | When game end both player have to resrart to play again |
| `leave`       | `{ roomId: string, playerId: string }` | If player leave                                         |
| `player-left` | —                                      | If player left any reson need to clear the room         |

##### Server Emits

| Event                               | Description                            |
| ----------------------------------- | -------------------------------------- |
| `games:tic-tac-toe:opponent-joined` | Sent to opponent when room is full     |
| `games:tic-tac-toe:start`           | Sent to both players to begin the game |
| `games:tic-tac-toe:move`            | Broadcasts every valid move            |
| `games:tic-tac-toe:end`             | If game win or draw                    |

---

## 🧠 User Management

### UserStore

Handles user socket presence and status:

- `idle`
- `waiting`
- `playing`

Status updated on:

- Connection
- Game start/end
- Disconnection

---

## ✅ Event Response Format

Success and failure use a common response pattern:

### `this.success(data)`

```ts
{
  status: "success",
  data: { ... }
}
```

### `this.failure(message)`

```ts
{
  status: "error",
  message: "..."
}
```

---

## 🛠️ Extending Handlers

To add a new feature (e.g., chess):

1. Create `chess.handler.ts` extending `EventHandler`
2. Define `namespace`, `events`, and logic
3. Register in `routesHandler()` inside `SocketService`
