const express = require("express");
const cors = require("cors");

const { initDatabase } = require("./config/database");
const analyzeRoutes = require("./routes/analyze.routes");
const statsRoutes = require("./routes/stats.routes");

const app = express();
app.use(cors({ origin: "*" }));

initDatabase();

app.use("/analyze", analyzeRoutes);
app.use("/stats", statsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
