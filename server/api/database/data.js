import { config } from "dotenv";
config();

import mongoose from "mongoose";
mongoose.set("strictQuery", false);

/***************************
 * Export Database Connection Shortcut
 */
export const connect = async (res) => {
    try {
        // const uri = "mongodb://localhost:27017/sotmDB";
        const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9xwkr8c.mongodb.net/sotmDB`;
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
