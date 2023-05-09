import _ from "lodash";

import { connect } from "../data.js";
import Vote from "../models/voteModel.js";
// import { fillDummyData } from "../../tools/fillerData.js";

/***************************
 * Controller called to retrieve
 * all vote documents in database.
 */
export const getVotes = async (req, res, next) => {
    console.log("[VoteController.getVotes]:");
    await connect(res);

    const allVotes = await Vote.find().exec();
    res.status(200).send({
        message: "Successfully found all votes.",
        votes: allVotes,
    });
};

/***************************
 * Controller called to retrieve
 * all vote documents in database,
 * posted from a specified month.
 */
export const getVotesByMonth = async (req, res, next) => {
    console.log("[VoteController.getVotesByMonth]:");
    await connect(res);
    // await fillDummyData(1 + Math.floor(Math.random() * 20));

    const { month, year } = req.params;
    let allVotes = !year
        ? await Vote.findByMonth(Number(month), new Date().getFullYear())
        : await Vote.findByMonth(Number(month), Number(year));

    const dateStr = new Date(Number(year), Number(month), 1).toLocaleDateString(
        "en-us",
        { month: "long", year: "numeric" }
    );

    res.status(200).send({
        message: `Successfully found all votes in ${dateStr}.`,
        votes: allVotes,
    });
};

/***************************
 * Controller called to retrieve
 * total count of all votes in database.
 */
export const getVoteCount = async (req, res, next) => {
    console.log("[VoteController.getVoteCount]:");
    await connect(res);

    const voteCount = await Vote.find().count();
    console.log(voteCount);

    res.status(200).send({
        message: "Successfully retrieved vote count.",
        voteCount: voteCount,
    });
};

/***************************
 * Controller called to create
 * a new vote document and save
 * to database.
 */
export const createVote = async (req, res, next) => {
    console.log("[VoteController.createVote]:");
    await connect(res);

    const { name, vote, reason } = req.body;
    const newVote = new Vote({
        name,
        vote,
        reason,
    });

    await newVote.save();
    res.status(200).send({
        message: "Successfully saved vote.",
        vote: newVote,
    });
};

/***************************
 * Controller called to update
 * an existing vote document's
 * validity.
 */
export const updateVoteValidity = async (req, res, next) => {
    console.log("[VoteController.updateVoteValidity]:");
    await connect(res);

    const { voteId } = req.params;
    const { validUpdate } = req.body;

    try {
        const vote = await Vote.findByIdAndUpdate(
            voteId,
            { valid: validUpdate },
            { new: true }
        );

        console.log(vote);

        if (vote.valid === validUpdate)
            return res.status(200).send({
                message: "Successfully updated validity",
                vote: vote,
            });
    } catch (error) {
        res.status(401).send({
            message: "There was an issue",
            error: error.message,
        });
    }
};

/***************************
 * Controller called to delete
 * an existing vote document
 * from database
 */
export const deleteVote = async (req, res, next) => {
    console.log("[VoteController.deleteVote]:");
    await connect(res);

    const { voteId } = req.params;

    try {
        const vote = await Vote.findByIdAndRemove(voteId);
        if (vote)
            res.status(200).send({
                message: "Succesfully deleted vote",
                deletedVote: vote,
            });
        else
            res.status(404).send({
                message: "Vote does not exist",
                error: "VoteNotFoundError",
            });
    } catch (error) {
        res.status(401).send({
            message: "There was an issue",
            error: error,
        });
    }
};

export default {
    getVotes,
    getVotesByMonth,
    getVoteCount,
    createVote,
    updateVoteValidity,
    deleteVote,
};
