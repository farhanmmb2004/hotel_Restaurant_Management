import dotenv from "dotenv";
import { createServer } from "http";
import connect from "./Db/index.js";
import { app } from "./app.js";
import { initializeSocket } from "./socket.js";

dotenv.config({path:'./.env'});

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = initializeSocket(httpServer);

connect()
.then(()=>{
    httpServer.listen(process.env.PORT||8000,()=>{
    console.log(`Server running on port ${process.env.PORT || 8000}`);
    console.log(`Socket.IO initialized`);
    });
})
.catch((error)=>{console.error(error)})
