import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    vote: { type: String, required: true },
    reason: { type: String, required: true },
    valid: { type: Boolean, required: true, default: true },
    date: {
        _id: false,
        type: {
            year: { type: Number, requred: true },
            month: { type: Number, required: true },
            ms: { type: Number, required: true },
        },
        required: true,
        default: () => {
            let now = new Date();
            return {
                year: now.getFullYear(),
                month: now.getMonth(),
                ms: now.getTime(),
            };
        },
    },
});

voteSchema.static("findByMonth", function (month, year) {
    return this.aggregate([
        {
            $match: {
                "date.month": month,
                "date.year": year,
            },
        },
    ]);
});

const Vote = new mongoose.model("vote", voteSchema);
export default Vote;
