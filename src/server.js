import express from "express";
import http from "http";
// import WebSocket from "ws";
import { Server } from "socket.io";
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

httpServer.listen(3000, handleListen);
