import { Router, json } from "express";

import UserController from "../database/controllers/userController.js";
import UserValidator from "../database/validators/userValidator.js";
import accessToken from "../middleware/accessToken.js";
import refreshToken from "../middleware/refreshToken.js";

/*** Initialize and Attach Middleware to Router ***/
const router = Router();
router.use(json());

/*** Attach User Controllers ***/
// router.get("/", UserController.getUsers);
router.post("/", UserValidator.onCreateUser, UserController.createUser);

/*** Attach Protected User Controllers ***/
router.use(
    "/:id",
    refreshToken,
    accessToken,
    UserValidator.onEditUser,
    UserController.editUser
);

export { router };
