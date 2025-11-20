import express from "express";
import cors from "cors";
import {dbSetUp} from "./db/database"
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 2000;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors(
{
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.set("trust proxy", true);

const startServer = async () =>
{
    await dbSetUp();

    app.listen(PORT, () => {
        console.log(`🚀Server is running on http://localhost:${PORT}/apis`);
    });
}

startServer();