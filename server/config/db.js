import mongoose from "mongoose";
const connectDb = async () => {
    try {
        const url = process.env.MongoDB_URL;
        if (!url) {
            console.error("Error: MongoDB_URL is not defined in environment variables.")
            process.exit(1)
        }
        await mongoose.connect(url, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        })
        console.log("db connected successfully")
    } catch (error) {
        console.error("DB connection error:", error.message)
        console.log("Retrying connection in 5 seconds...")
        setTimeout(() => connectDb(), 5000)
    }
}
export default connectDb