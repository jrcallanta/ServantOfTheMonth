import { config } from "dotenv";
config();

import bcrypt from "bcrypt";

export const hash = (somePassword) => {
    console.log(somePassword);
    return bcrypt.hashSync(
        somePassword,
        Number(process.env.BCRYPT_SALT_ROUNDS)
    );
};

export const compare = (someText, someHash) => {
    return bcrypt.compareSync(someText, someHash);
};
