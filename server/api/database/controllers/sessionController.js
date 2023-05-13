import { config } from "dotenv";
config();

import { connect } from "../data.js";
import { sign, verify } from "../../tools/customJWT.js";
import User from "../models/userModel.js";
import Session from "../models/sessionModel.js";
import { compare } from "../../tools/customBCrypt.js";

/***************************
 * Controller called to attempt
 * a login for an existing user
 * using userId and hash.
 */
export const loginWithCredentials = async (req, res, next) => {
    console.log("[SessionController.loginWithCredentials]:");
    await connect(res);

    const { id, hash } = req.body;

    try {
        const user = await User.findById(`${id}`);
        if (!user) {
            return res.status(404).send({
                message: "Could not find user.",
                error: "UserFindError",
            });
        }

        if (!compare(hash, user.hash)) {
            return res.status(401).send({
                message: "The password did not match.",
                error: "InvalidPasswordError",
            });
        }

        const newSession = new Session({ userId: id });
        await newSession.save();

        const refreshToken = sign(
            { userId: id, sessionId: newSession.id },
            "refresh"
        );
        const accessToken = sign(
            { currentUser: user.publicProjection },
            "access"
        );

        res.cookie("refreshToken", refreshToken, { httpOnly: true });
        res.cookie("accessToken", accessToken, { httpOnly: true });

        return res.status(200).send({
            message: "Succesfully logged in user",
            currentUser: user.publicProjection,
            accessToken: accessToken,
        });
    } catch (error) {
        if (!res.writableEnded)
            return res.status(500).send({
                message: "There was an error",
                error: error.message,
            });
    }
};

/***************************
 * Controller called to retrieve
 * information encoded in the
 * access token attached as a
 * cookie.
 */
export const getAccess = async (req, res, next) => {
    console.log("[SessionController.getAccess]:");

    try {
        const { accessToken } = req.cookies;
        const decoded = verify(accessToken);

        return res.status(200).send({
            message: "Successfully retreived user data",
            currentUser: decoded.currentUser,
        });
    } catch (error) {
        return res.status(401).send({
            message: "There was an error",
            error: error,
        });
    }
};

/***************************
 * Controller called to refresh
 * the access token attached to
 * req/res if the refresh token
 * is still valid.
 */
export const refreshAccess = async (req, res, next) => {
    console.log("[SessionController.refreshAccess]:");
    await connect(res);

    const { refreshToken } = req.cookies;
    if (!refreshToken)
        return res.status(401).send({
            message: "There was an error",
            error: "UnauthorizedError",
        });

    const { id } = req.params;
    const decodedRefresh = verify(refreshToken, "refresh");
    if (id && id !== decodedRefresh.userId)
        return res.status(401).send({
            message: "There was an error",
            error: "UnauthorizedError",
        });

    const user = await User.findById(decodedRefresh.userId);
    if (!user)
        return res.status(404).send({
            message: "Could not find user.",
            error: "UserNotFoundError",
        });

    const session = await Session.findById(decodedRefresh.sessionId);
    if (!session || (id && id !== session.userId.toString())) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.status(401).send({
            message: "Refresh token revoked.",
            error: "RevokedTokenError",
        });
    }

    const accessToken = sign({ currentUser: user.publicProjection }, "access");

    req.cookies.accessToken = accessToken;
    res.cookie("accessToken", accessToken, { httpOnly: true });

    next();
};

/***************************
 * Controller called to logout
 * current user whether or not
 * the current token is valid.
 */
export const logout = async (req, res, next) => {
    console.log("[SessionController.logout]:");
    await connect(res);

    console.log(req.cookies);
    const { refreshToken } = req.cookies;

    try {
        const decodedRefresh = verify(refreshToken, "refresh");
        await Session.findByIdAndRemove(decodedRefresh.sessionId);
    } catch (error) {
        console.log(error);
    } finally {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.status(200).send({
            message: "Successfully logged out user",
        });
    }
};

export default {
    getAccess,
    refreshAccess,
    loginWithCredentials,
    logout,
};
