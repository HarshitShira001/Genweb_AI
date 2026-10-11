import crypto from "crypto";
import razorpayInstance from "../config/razorpay.js";
import { PLANS } from "../config/plan.js";
import User from "../model/user.model.js";

export const billing = async (req, res) => {
  try {
    const { planType } = req.body;
    const userId = req.user._id;

    const plan = PLANS[planType];

    if (!plan || plan.price <= 0) {
      return res.status(400).json({ message: "Invalid paid plan" });
    }
    const amount = plan.price * 100;

    const options = {
      amount: amount,
      currency: "INR",
      payment_capture: 1,
      receipt: `receipt_order_${Date.now()}`,
      notes: {
        userId: userId.toString(),
        planType: planType,
      },
    };

    const order = await razorpayInstance.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Payment initiation failed",
    });
  }
};

export const razorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const event = JSON.parse(req.body);

    if (event.event === "payment.captured") {
      const { userId, planType } = event.payload.payment.entity.notes;
      const plan = PLANS[planType];

      if (plan && userId) {
        await User.findByIdAndUpdate(userId, {
          $inc: { credits: plan.credits },
          $set: { plan: planType },
        });
        console.log(`Credits updated for user ${userId}: +${plan.credits}`);
      }
    }

    return res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(200).json({ status: "ok" });
  }
};