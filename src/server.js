import express from "express";
import http from "http";
// import WebSocket from "ws";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () =>
  console.log("🚀 Listening Server:http,ws://localhost:3000");

const httpServer = http.createServer(app);
// const wsServer = new WebSocket.Server({ server }); wsSocket version
const io = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
  namespaceName: "/custom",
});

/*
const sockets = [];
wsServer.on("connection", (socket) => {
  sockets.push(socket);
  sockets["nickname"] = "Anonymus";
  console.log("Connected to Browser ✅");
  socket.on("close", () => console.log("disconected to browser"));
  socket.on("message", (m) => {
    const message = JSON.parse(m);
    switch (message.type) {
      case "new_message":
        sockets.forEach((a) => {
          return a.send(`${sockets.nickname} : ${message.payload}`);
        });
        break;
      case "nickname":
        sockets["nickname"] = message.payload;
        break;
    }
  });
});
*/

const publicRooms = () => {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
};

const countPeople = (roomName) => {
  return io.sockets.adapter.rooms.get(roomName)?.size;
};

io.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket event : ${event}`);
  });
  socket.on("enter_room", (roomName, nick, done) => {
    socket.join(roomName);
    socket["nickname"] = nick;
    done();
    socket.to(roomName).emit(`welcome`, socket.nickname, countPeople(roomName));
    io.sockets.emit("room_status", publicRooms());
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countPeople(room) - 1)
    );
  });
  socket.on("disconnect", () => io.sockets.emit("room_status", publicRooms()));
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

httpServer.listen(3000, handleListen);
