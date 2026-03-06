import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import { errorHandler } from "./middlewares/error-handler";

dotenv.config();

const app = express();

const allowedOrigins = process.env.ALLOWED_CLIENT_URLS?.split(",");
if (!allowedOrigins) {
  throw new Error("ALLOWED_CLIENT_URLS environment variable is not defined");
}
app.use(cors({
  origin: allowedOrigins
}));

const port = process.env.PORT;
if (!port) {
  throw new Error("PORT environment variable is not defined");
}

app.use(express.json());

app.use("/api", routes);

app.use(errorHandler);

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.listen(port, () => {
  console.log(`monday-candle-app listening at http://localhost:${port}`);
});

export default app;