import { hash } from "../../tools/customBCrypt.js";

/***************************
 * Validator called to verify and
 * sanatize inputs before creating
 * a new user document.
 */
export const onCreateUser = async (req, res, next) => {
    console.log("[UserValidator.onCreateUser]:");

    if (!req.body.password || !req.body.name || !req.body.email)
        res.status(422).send({
            message:
                "The inputs give were invalid. Please give a name, email, and password",
            error: "InvalidInputError",
        });

    req.body.hash = hash(req.body.password);
    req.body.password = undefined;
    next();
};

/***************************
 * Validator called to verify and
 * sanatize inputs before editing
 * an existing user document.
 */
export const onEditUser = async (req, res, next) => {
    console.log("[UserValidator.onEditUser]:");

    const changes = Object.entries(req.body);
    if (changes.length === 0) throw new Error("No changes given");

    if (req.body.password) {
        req.body.hash = hash(req.body.password);
        req.body.password = undefined;
    }
    next();
};

/***************************
 * Validator called to verify and
 * sanatize inputs before deleting
 * an existing user document.
 */
export const onDeletedUser = async (req, res, next) => {
    console.log("[UserValidator.onDeleteUser]:");
    next();
};

export default {
    onCreateUser,
    onEditUser,
    onDeletedUser,
};
