import express from "express";
import cors from "cors";
import {dbSetUp} from "./db/database"
import dotenv from "dotenv";
import router from "./routes/routes";
import { swaggerDocs } from "./docs/swagger";
import { migrateDueDate } from "./utils/migrateDueDate";
// import { seedLoans } from "./utils/ge";


dotenv.config();
const PORT = parseInt(process.env.PORT || "2000");

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

// Swagger
swaggerDocs(app, PORT);

// Routes
app.use('/api', router);
// app.use('/api/loans', router);
// app.use('/api/customers', router);


const startServer = async () =>
{
    await dbSetUp();

    // await seedLoanTypes();

    // await seedLoans();

    // await migrateDueDate();

    app.listen(PORT, () => {
        console.log(`🚀Server is running on http://localhost:${PORT}/apis`);
    });
}

startServer();