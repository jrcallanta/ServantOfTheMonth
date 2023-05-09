import { config } from "dotenv";
config();

import { expressjwt as ejwt } from "express-jwt";
import cookieParser from "cookie-parser";
import { Router, json } from "express";
import { verify } from "../tools/customJWT.js";
import sessionController from "../database/controllers/sessionController.js";

/*********************************
 * Helper middleware called upon when
 * any errors are thrown due to token
 * authorization issues.
 */
const _errorHandler = (err, req, res, next) => {
    console.log("[AccessToken.errorHandler]:");
    if (err) {
        return res.status(401).send({
            message: "There was a token error",
            error: err.message,
        });
    }

    try {
        next();
    } catch (error) {
        return res.status(401).send({
            message: "There was a token error",
            error: error.message,
        });
    }
};

/*********************************
 * Helper middleware called upon when
 * reaching routes that require
 * a valid login token.
 */
const _validator = async (req, res, next) => {
    console.log("[AccessToken.validator]:");

    try {
        const { accessToken } = req.cookies;
        const decodedAccess = verify(accessToken);

        const remainingTime = decodedAccess.exp - Math.floor(Date.now() / 1000);
        const remainingMins = Math.floor(remainingTime / 60);
        const remainingSecs = remainingTime % 60;

        console.log(
            `Access token will expire in ${remainingMins}m and ${remainingSecs}s`
        );

        const { id } = req.params;
        console.log(id);
        if (id && id !== decodedAccess.currentUser.id)
            throw new Error("You are not authorized for this action.");

        if (id) req.body.userId = decodedAccess.currentUser.id;

        next();
    } catch (error) {
        if (error.expiredAt) {
            sessionController.refreshAccess(req, res, next);
        } else
            return res.status(401).send({
                message: "There was a token error.",
                error: error.message,
            });
    }
};

const router = Router({ mergeParams: true });
router.use(json());
router.use(cookieParser());
router.use(_errorHandler);
router.use(_validator);
router.use(
    ejwt({
        secret: process.env.ACCESS_TOKEN_SECRET,
        algorithms: ["HS256"],
        getToken: (req) => req.cookies.accessToken,
    })
);
export default router;
