require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Enable CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/evidence", require("./routes/evidenceRoutes"));
app.use("/api/audit", require("./routes/auditRoutes"));
app.use("/api/blockchain", require("./routes/blockchainRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));


app.listen(8070, () => console.log("Server running on port 8070"));
