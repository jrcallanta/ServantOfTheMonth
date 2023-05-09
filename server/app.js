import { config } from "dotenv";
config();

import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

import express, { urlencoded } from "express";
const app = express();

import api from "./api/router.js";

// Attach Middleware
app.use(urlencoded({ extended: true }));

// Attach API Routes
app.use("/api", api);

// Attach React App
app.use(express.static(path.resolve(__dirname, "../client/build/")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
