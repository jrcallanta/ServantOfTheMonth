import { config } from "dotenv";
config();

import mongoose from "mongoose";
mongoose.set("strictQuery", false);

/***************************
 * Export Database Connection Shortcut
 */
export const connect = async (res) => {
    try {
        console.log(
            `[devmode=${process.env.DEV_MODE === "true"}], `,
            process.env.DEV_MODE === "true"
                ? "using local db..."
                : "using cloud db..."
        );

        const uri =
            process.env.DEV_MODE === "true"
                ? "mongodb://localhost:27017/sotmDB"
                : `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9xwkr8c.mongodb.net/sotmDB`;

        const connection = mongoose
            .connect(uri, {
                useNewUrlParser: true,
            })
            .catch((error) => {
                if (res && !res.writableEnded)
                    return res.status(500).send({
                        message: "There was an error",
                        error: "ConnectionError",
                    });
            });
        return connection;
    } catch (error) {
        if (res && !res.writableEnded)
            return res.status(500).send({
                message: "There was an error",
                error: "ConnectionError",
            });
        else throw error;
    }
};
