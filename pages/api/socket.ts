import { Server } from "socket.io";

export default function handler(req: any, res: any) {
  let announce = '';
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: true,
        credentials: true,
        methods: ["GET", "POST"],
      },
      allowEIO3: true,
    });
    io.on("connection", (socket) => {
      io.emit("announce", announce);
      io.emit("count", io?.engine?.clientsCount);

      socket.on("message", (message) => {
        io.emit("message", message);
      });
      socket.on("announce", (message) => {
        io.emit("announce", message);
        announce = message;
      });
      socket.on("delete", (id) => {
        io.emit("delete", id);
      });
    });

    // io.on("connect", (socket) => {}) // connection 보다 먼저
    res.socket.server.io = io;
  }

  res.end();
}