import { config } from "dotenv";
config();

import { expressjwt as ejwt } from "express-jwt";
import { Router, json } from "express";
import { verify } from "../tools/customJWT.js";
import cookieParser from "cookie-parser";
import Session from "../database/models/sessionModel.js";

const _errorHandler = (err, req, res, next) => {
    console.log("[RefreshToken.errorHandler]:");
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

const _validator = (req, res, next) => {
    console.log("[RefreshToken.validator]:");

    try {
        const { refreshToken } = req.cookies;
        const decoded = verify(refreshToken, "refresh");

        console.log(
            `Refresh token will expired in ${
                decoded.exp - Math.floor(Date.now() / 1000)
            }s`
        );

        next();
    } catch (error) {
        return res.status(401).send({
            message: "There was a token error.",
            error: error.message,
        });
    }
};

const isRevoked = async (req, token) => {
    console.log(token);
    return false;
};

const router = Router();
router.use(json());
router.use(cookieParser());
router.use(_errorHandler);
router.use(_validator);
router.use(
    ejwt({
        secret: process.env.REFRESH_TOKEN_SECRET,
        algorithms: ["HS256"],
        getToken: (req) => req.cookies.refreshToken,
    })
);

export default router;
