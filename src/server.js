import express from "express";
import http from "http";
// import WebSocket from "ws";
import SocketIO from "socket.io";
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
const io = SocketIO(httpServer);

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

io.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket event : ${event}`);
  });
  socket.on("enter_room", (msg, done) => {
    socket.join(msg);
    done();
  });
});

httpServer.listen(3000, handleListen);
