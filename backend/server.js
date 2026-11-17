require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const { setIO } = require("./socket.js");
const express = require("express");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const cors = require("cors");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const repoRoutes = require("./routes/repoRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const app = express();
const server = http.createServer(app);
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
    },
});
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    },
});
io.engine.use(sessionMiddleware);
setIO(io);
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(sessionMiddleware);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/repos", repoRoutes);
app.get("/", (req, res) => {
    res.send("backend running");
});
connectDB()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Backend running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
        process.exit(1);
    });
