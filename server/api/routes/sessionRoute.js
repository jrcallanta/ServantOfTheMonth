import cookieParser from "cookie-parser";
import { Router, json } from "express";
import SessionController from "../database/controllers/sessionController.js";
import SessionValidator from "../database/validators/sessionValidator.js";
import refreshToken from "../middleware/refreshToken.js";
import accessToken from "../middleware/accessToken.js";

const router = Router();
router.use(json());
router.use(cookieParser());

router.get("/access", refreshToken, accessToken, SessionController.getAccess);
router.post(
    "/login",
    SessionValidator.onLoginWithCredentials,
    SessionController.loginWithCredentials
);
router.post(
    "/single-user-login",
    SessionValidator.onSingleUserLogin,
    SessionController.loginWithCredentials
);
router.post(
    "/logout",
    // refreshToken,
    // accessToken,
    SessionValidator.onLogout,
    SessionController.logout
);

export { router };
