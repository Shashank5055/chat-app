const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

const rooms = new Map(); // roomName -> Set of clients

wss.on("connection", (ws) => {
  ws.userData = {};

  ws.on("message", (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch {
      return;
    }

    switch (data.type) {
      case "join":
        ws.userData.username = data.username;
        ws.userData.room = data.room;

        if (!rooms.has(data.room)) rooms.set(data.room, new Set());
        rooms.get(data.room).add(ws);

        // Broadcast system message to others in the room
        broadcast(
          data.room,
          JSON.stringify({
            type: "message",
            username: "System",
            content: `${data.username} joined the room`,
            timestamp: new Date().toISOString(),
          }),
          ws
        );
        break;

      case "message":
        // Broadcast message to all in the room
        broadcast(
          data.room,
          JSON.stringify(data)
        );
        break;

      case "typing":
        // Broadcast typing to others in the room except sender
        broadcast(
          data.room,
          JSON.stringify(data),
          ws
        );
        break;
    }
  });

  ws.on("close", () => {
    const { username, room } = ws.userData;
    if (username && room && rooms.has(room)) {
      rooms.get(room).delete(ws);

      // Broadcast system message to others in the room
      broadcast(
        room,
        JSON.stringify({
          type: "message",
          username: "System",
          content: `${username} left the room`,
          timestamp: new Date().toISOString(),
        }),
        ws
      );

      if (rooms.get(room).size === 0) {
        rooms.delete(room);
      }
    }
  });
});

function broadcast(room, data, excludeWs = null) {
  if (!rooms.has(room)) return;

  for (const client of rooms.get(room)) {
    if (client.readyState === WebSocket.OPEN && client !== excludeWs) {
      client.send(data);
    }
  }
}

console.log("WebSocket server running on ws://localhost:8080");
