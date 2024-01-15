import express from "express";
import { createServer } from 'node:http';
import { Server as WebsocketServer} from "socket.io";

const app = express();
const server = createServer(app);

const ws = new WebsocketServer(server);

app.get('/', (req, res) => {
    res.send("<h1> Hello World </h1>");
});

ws.on('connection', (socket) => {
    console.log("a user connection");
});

server.listen(3001, () => {
    console.log("websocket open");
});