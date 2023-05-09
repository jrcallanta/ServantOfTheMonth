import { Router, json } from "express";
const router = Router({ mergeParams: true });

import VoteController from "../database/controllers/voteController.js";
import VoteValidator from "../database/validators/voteValidator.js";
import accessToken from "../middleware/accessToken.js";
import refreshToken from "../middleware/refreshToken.js";

router.use(json());

/*** Attach Controllers ***/
router.get("/count", VoteController.getVoteCount);
router.post("/", VoteValidator.onCreateVote, VoteController.createVote);

/*** Attach Authorized Controllers ***/
router.get("/", refreshToken, accessToken, VoteController.getVotes);
router.get(
    "/:month",
    refreshToken,
    accessToken,
    VoteValidator.onGetVotesByMonth,
    VoteController.getVotesByMonth
);
router.get(
    "/:month/:year",
    refreshToken,
    accessToken,
    VoteValidator.onGetVotesByMonth,
    VoteController.getVotesByMonth
);
router.patch(
    "/:voteId",
    refreshToken,
    accessToken,
    VoteValidator.onUpdateVoteValidity,
    VoteController.updateVoteValidity
);
router.delete(
    "/:voteId",
    refreshToken,
    accessToken,
    VoteValidator.onDeleteVote,
    VoteController.deleteVote
);

export { router };
