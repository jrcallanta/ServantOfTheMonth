import _ from "lodash";
import { loremIpsum } from "lorem-ipsum";
import Vote from "../database/models/voteModel.js";

const FIRST_NAMES = [
    "Chaewon",
    "Siri",
    "selena",
    "Cyrene",
    "Seleste",
    "Tim",
    "maven",
    "Taehyung",
    "Jimin",
    "Suzu",
    "piech",
    "jesus",
    "Leon",
    "lyla",
    "Liliyan",
    "Jeico",
];

const LAST_NAMES = [
    "Chin",
    "plur",
    "mint",
    "Grey",
    "neha",
    "Hyu",
    "Gomez",
    "Rodrigo",
    "Pogo",
    "renner",
];

export const getName = () => {
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const last =
        Math.floor(Math.random() * 2) % 2 == 0
            ? LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
            : null;

    return `${first}${last ? ` ${last}` : ""}`;
};

export const getReason = () => {
    return loremIpsum({
        count: 1 + Math.floor(Math.random() * 3),
        units: "sentences",
        sentenceUpperBound: "20",
    });
};

export const fillDummyData = async (count) => {
    const votes = Array(count)
        .fill({})
        .map(() => {
            let date = new Date();
            date.setMonth(Math.floor(Math.random() * 12));
            date.setDate(Math.floor(Math.random() * 31));

            return {
                name: _.startCase(getName()),
                vote: _.startCase(getName()),
                reason: getReason(),
                date: {
                    ms: date.getTime(),
                    month: date.getMonth(),
                    year: date.getFullYear(),
                },
            };
        });

    // return;

    await Promise.all(
        votes.map(async (vote) => {
            let newVote = new Vote(vote);
            await newVote.save();
            return newVote;
        })
    );
};
