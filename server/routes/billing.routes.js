import express from "express";
import { billing, razorpayWebhook } from "../controllers/billing.controller.js";
import isAuth from "../middlewares/isAuth.js";
const billingRouter = express.Router();
billingRouter.post("/", isAuth, billing)
billingRouter.post("/webhook", razorpayWebhook)
export default billingRouter