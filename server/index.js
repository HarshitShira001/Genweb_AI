import "dotenv/config";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import billingRouter from "./routes/billing.routes.js";
import userRouter from "./routes/user.routes.js";
import websiteRouter from "./routes/websites.routes.js";

const app = express();


const PORT = process.env.PORT || 5000;

app.use("/api/billing/webhook", express.raw({ type: "application/json" }));
app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true
}))
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/website", websiteRouter)
app.use("/api/billing", billingRouter)
connectDb()
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})
