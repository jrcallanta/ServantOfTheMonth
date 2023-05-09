import mongoose from "mongoose";
import { config } from "dotenv";
config();

const sessionSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        expires: 3600,
        default: Date.now,
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
});

const Session = new mongoose.model("session", sessionSchema);
export default Session;
