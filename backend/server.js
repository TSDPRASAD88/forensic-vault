require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

/* ================================
   CREATE HTTP SERVER
================================ */
const server = http.createServer(app);

/* ================================
   SOCKET.IO SETUP
================================ */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// make io accessible in routes/controllers
app.set("io", io);

/* ================================
   SOCKET CONNECTION
================================ */
io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  socket.on("joinUserRoom", (userId) => {
    socket.join(userId);
    console.log(`👤 User joined room: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

/* ================================
   MIDDLEWARE
================================ */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

/* ================================
   DATABASE
================================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* ================================
   ROUTES
================================ */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/evidence", require("./routes/evidenceRoutes"));
app.use("/api/audit", require("./routes/auditRoutes"));
app.use("/api/blockchain", require("./routes/blockchainRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

/* ================================
   START SERVER
================================ */
const PORT = 8070;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
