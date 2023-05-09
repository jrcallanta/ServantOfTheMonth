import { config } from "dotenv";
config();

/***************************
 * Validator called to verify and
 * sanatize inputs before logging
 * into an exising user.
 */
export const onLoginWithCredentials = (req, res, next) => {
    console.log("[SessionValidator.onLoginWithCredentials]:");
    req.body.hash = req.body.password;
    req.body.password = undefined;
    next();
};

/***************************
 * Validator called to verify and
 * sanatize inputs before logging
 * into default user. Only necessary
 * when singleUserLogin route enabled.
 */
export const onSingleUserLogin = (req, res, next) => {
    console.log("[SessionValidator.onSingleUserLogin]:");
    // req.body.id = "6413ee37e5b58c9e01bed2a4"; // Local ID of default User
    req.body.id = String(process.env.SINGLE_ADMIN_ID); // ID of default User
    req.body.hash = req.body.password;
    req.body.password = undefined;
    next();
};

/***************************
 * Validator called to verify and
 * sanatize inputs before logging
 * out of an existing user.
 */
export const onLogout = (req, res, next) => {
    console.log("[SessionValidator.onLogout]:");

    next();
};

export default {
    onLoginWithCredentials,
    onSingleUserLogin,
    onLogout,
};
