import { config } from "dotenv";
config();

import jwt from "jsonwebtoken";

/*********************************
 * Helper method acts as a wrapper
 * for thw jwt.sign api using
 * pre-defined configurations for
 * less repetitive method calls.
 */
export const sign = (data, type) => {
    if (type === "refresh") {
        return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
    } else {
        return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: parseInt(process.env.ACCESS_TOKEN_EXP),
        });
    }
};

/*********************************
 * Helper method acts as a wrapper
 * for thw jwt.verify api using
 * pre-defined configurations for
 * less repetitive method calls.
 */
export const verify = (data, type) => {
    let secret =
        type === "refresh"
            ? process.env.REFRESH_TOKEN_SECRET
            : process.env.ACCESS_TOKEN_SECRET;

    return jwt.verify(data, secret);
};

export default {
    sign,
    verify,
};
