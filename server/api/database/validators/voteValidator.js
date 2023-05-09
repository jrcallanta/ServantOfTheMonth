import _ from "lodash";
import { Types } from "mongoose";

/***************************
 * Validator called to verify and
 * sanatize inputs before creating
 * a new vote document.
 */
export const onCreateVote = (req, res, next) => {
    console.log("[VoteValidator.onCreateVote]:");

    let { name, vote, reason } = req.body;
    const voteRequirements = { name, vote, reason };

    let invalids = {};
    // Check each field for empty strings
    Object.entries(voteRequirements).forEach(([key, value]) => {
        if (value === "") {
            invalids[key] = {
                message: `Invalid value passed for ${key}`,
                error: "Empty string is not valid",
                value: value,
            };
        }
    });

    // If any input is invalid, deny request
    if (Object.entries(invalids).length > 0) {
        return res.status(400).send({
            message: "One or more inputs were invalid. Please try again.",
            errors: invalids,
        });
    }

    req.body.name = _.capitalize(name);
    req.body.vote = _.capitalize(vote);
    next();
};

/***************************
 * Validator called to verify and
 * sanatize inputs before querying
 * votes from specific month.
 */
export const onGetVotesByMonth = async (req, res, next) => {
    console.log("[VoteValidator.onGetVotesByMonth]:");

    const { month } = req.params;
    if (!(0 <= month && month < 12))
        return res.status(401).send({
            message: "Invalid month given. Try again.",
            error: "Month must be an integer in range [0, 12)",
        });

    // If valid, sanatize
    // req.params.month = Number(month) + 1;
    next();
};

export const onUpdateVoteValidity = async (req, res, next) => {
    console.log("[VoteValidator.onUpdateVoteValidity]:");

    const { voteId } = req.params;
    const { validUpdate } = req.body;
    console.log(voteId, validUpdate, typeof validUpdate);

    if (!voteId)
        return res.status(401).send({
            message: "No vote id value given. Try again.",
            error: "Id value must be a valid document vote id",
        });

    try {
        if (validUpdate === undefined) throw Error();

        if (
            typeof validUpdate !== "boolean" &&
            typeof validUpdate === "string" &&
            !["true", "false"].includes(validUpdate.toLowerCase())
        )
            throw Error();
    } catch (error) {
        return res.status(401).send({
            message: "Invalid validity value given. Try again.",
            error: "Validity value must be either true or false",
        });
    }

    if (typeof validUpdate === "string")
        req.body.validUpdate = validUpdate.toLowerCase() === "true";
    next();
};

export const onDeleteVote = (req, res, next) => {
    console.log("[VoteValidator.onDeleteVote]:");

    const { voteId } = req.params;

    try {
        new Types.ObjectId(voteId);
    } catch (error) {
        res.status(401).send({
            message: "Provided id is not valid",
            error: "InvalidIdError",
        });
    }

    next();
};

export default {
    onCreateVote,
    onGetVotesByMonth,
    onUpdateVoteValidity,
    onDeleteVote,
};
