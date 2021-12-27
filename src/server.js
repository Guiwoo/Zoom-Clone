import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () =>
  console.log("🚀 Listening Server:http,ws://localhost:3000");

const server = http.createServer(app);
const wsServer = new WebSocket.Server({ server });

wsServer.on("connection", (socket) => {
  console.log("Connected to Browser ✅");
  socket.on("close", () => console.log("disconected to browser"));
  socket.send("Welcome");
  socket.on("message", (m) => {
    socket.send(m + "from back");
  });
});

server.listen(3000, handleListen);
