import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import config from "config";
import routes from "./routes/index.js";
import chalk from "chalk";
import path from "path";
import { fileURLToPath } from "url";

const PORT = config.get("port");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());
app.use("/upload", express.static("upload"));
app.use("/", routes);

process.env.NODE_ENV === "production" &&
  console.log(chalk.blue("Production environment"));
process.env.NODE_ENV === "development" &&
  console.log(chalk.blue("Development environment"));

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "client")));

  const indexPath = path.join(__dirname, "client", "index.html");

  app.get("*", (req, res) => {
    res.sendFile(indexPath);
  });
}

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || config.get("mongoUri"));
    console.log(chalk.green("MongoDB is connected..."));
    app.listen(process.env.PORT || PORT, () =>
      console.log(chalk.green(`Server has been started on port ${PORT}...`))
    );
  } catch (err) {
    console.log(chalk.red(`Error: ${err.message}`));
    process.exit(1);
  }
}

start();
