/***************************
 * Validator called to verify and
 * sanatize inputs before creating
 * a new user document.
 */
export const onCreateUser = async (req, res, next) => {
    console.log("[UserValidator.onCreateUser]:");
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
        req.body.hash = req.body.password;
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
