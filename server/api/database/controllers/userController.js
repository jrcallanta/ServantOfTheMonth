import { connect } from "../data.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { sign, verify } from "../../tools/customJWT.js";

/***************************
 * Controller called to retrieve
 * all users from database.
 */
export const getUsers = async (req, res, next) => {
    console.log("[UserController.getUsers]:");
    await connect(res);

    try {
        const allUsers = await User.find({}).exec();
        return res.status(200).send({
            message: "Successfully retrieved all users",
            allUsers: allUsers,
        });
    } catch (error) {
        return res.status(500).send({
            message: "There was an error. Try again.",
            error: error.message,
        });
    }
};

/***************************
 * Controller called to create
 * a new user.
 */
export const createUser = async (req, res, next) => {
    console.log("[UserController.createUser]:");
    await connect(res);

    const { name, hash, email } = req.body;

    const newUser = new User({
        name,
        hash,
        email,
    });

    try {
        await newUser.save();
        return res.status(200).send({
            message: "Successfully created user.",
            user: newUser,
        });
    } catch (error) {
        return res.status(500).send({
            message: "There was an error. Try again",
            error: error.message,
        });
    }
};

/***************************
 * Controller called to edit
 * an existing user.
 */
export const editUser = async (req, res, next) => {
    console.log("[UserController.editUser]:");
    await connect(res);

    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) throw new Error("No user found");

        const changes = Object.entries(req.body);
        changes.forEach(([key, value]) => {
            user[key] = value;
        });

        await user.save();

        return res.status(200).send({
            message: "Successfully updated user.",
            user: user.publicProjection,
        });
    } catch (error) {
        return res.status(500).send({
            message: "There was an error",
            error: error.message,
        });
    }
};

/***************************
 * Controller called to delete
 * an existing user.
 */
export const deleteUser = async (req, res, next) => {
    console.log("[UserController.deleteUser]:");
};

/***************************
 * Controller called to attempt
 * a login for an existing user
 * using client-side stored token.
 */
export const loginWithToken = async (req, res, next) => {
    console.log("[UserController.loginWithToken]:");
    await connect(res);

    try {
        const { accessToken } = req.cookies;
        const { currentUser } = verify(accessToken);

        const user = await User.findById(currentUser.id);
        if (!user) throw new Error("No user found");

        let tokenIsInvalid =
            !currentUser ||
            currentUser.id !== user.id ||
            currentUser.hash !== user.hash;

        if (tokenIsInvalid) throw new Error("Token is invalid");

        return res.status(200).send({
            message: "Succesfully signed into user",
            currentUser: user.publicProjection,
        });
    } catch (error) {
        return res.status(500).send({
            message: "There was an error",
            error: error.message,
        });
    }
};

export default {
    getUsers,
    createUser,
    editUser,
    deleteUser,
};
