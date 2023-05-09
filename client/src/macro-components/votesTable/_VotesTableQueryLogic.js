import { useReducer } from "react";

const intialState = {
    feedback: null,
    isUpdating: true,
    votesList: [],
    queryList: [],
};

export const useVotesTableQueryReducer = ({ month, bin, sort, direction }) => {
    const queryReducer = (state, action) => {
        switch (action.type) {
            case "SHOW_SPINNER": {
                return {
                    ...state,
                    feedback: null,
                    isUpdating: true,
                };
            }

            case "HIDE_SPINNER": {
                return {
                    ...state,
                    isUpdating: false,
                };
            }

            case "SET_VOTES_LIST": {
                let newVotesList = [
                    ...action.payload.map((vote) => ({
                        ...vote,
                        deleted: false,
                    })),
                ];

                return {
                    ...state,
                    votesList: newVotesList,
                };
            }

            case "SET_FEEDBACK": {
                return { ...state, feedback: action.payload };
            }

            case "SET_FEEDBACK_CLEAR_LIST": {
                console.log("clearing list...");
                return {
                    ...state,
                    feedback: action.payload,
                    votesList: [],
                    queryList: [],
                };
            }

            case "SET_VALIDITY": {
                const newVotesList = [...state.votesList];
                let updateVote = newVotesList.find(
                    ({ _id }) => _id === action.payload.id
                );

                if (updateVote) updateVote.valid = action.payload.validity;

                return { ...state, votesList: newVotesList };
            }

            case "SET_DELETE": {
                const newVotesList = [...state.votesList];
                let updateVote = newVotesList.find(
                    ({ _id }) => _id === action.payload.id
                );
                if (updateVote) updateVote.deleted = action.payload.delete;

                return {
                    ...state,
                    votesList: newVotesList,
                };
            }

            case "REFRESH_QUERY_LIST": {
                let newQueryList = [...state.votesList];
                newQueryList = newQueryList
                    .filter((vote) => !vote.deleted)
                    .filter((vote) => _filterFunction(vote, bin));
                newQueryList = _sorter(newQueryList, { sort, direction });

                return { ...state, queryList: newQueryList };
            }

            default: {
                return state;
            }
        }
    };

    return useReducer(queryReducer, intialState);
};

const _filterFunction = (vote, bin) => {
    if (bin === "valid") {
        return vote.valid;
    }
    if (bin === "invalid") {
        return !vote.valid;
    }
    return true;
};

const _sortByCount = (list, direction) => {
    const freq = list.reduce((voteMap, currVote) => {
        if (voteMap[currVote.vote.toLowerCase()])
            voteMap[currVote.vote.toLowerCase()]++;
        else voteMap[currVote.vote.toLowerCase()] = 1;

        return voteMap;
    }, {});

    return list.sort((vote1, vote2) =>
        freq[vote1.vote.toLowerCase()] > freq[vote2.vote.toLowerCase()]
            ? direction
            : direction * -1
    );
};

const _sorter = (list, { sort, direction }) => {
    console.log("sorting...", sort);

    const nomineeComparator = (vote1, vote2) => {
        let v1 = vote1["vote"].toLowerCase();
        let v2 = vote2["vote"].toLowerCase();

        if (v1 < v2) return 1 * direction;
        if (v1 > v2) return -1 * direction;
        else return 0;
    };

    const voterComparator = (vote1, vote2) => {
        let v1 = vote1["name"].toLowerCase();
        let v2 = vote2["name"].toLowerCase();

        if (v1 < v2) return 1 * direction;
        if (v1 > v2) return -1 * direction;
        else return 0;
    };

    const dateComparator = (vote1, vote2) => {
        let date1 = new Date(vote1.date.ms).getDate();
        let date2 = new Date(vote2.date.ms).getDate();

        if (date1 < date2) return -1 * direction;
        if (date1 > date2) return 1 * direction;
        return 0;
    };

    const comparator = {
        nominee: nomineeComparator,
        voter: voterComparator,
        date: dateComparator,
    };

    if (comparator[sort]) {
        console.log(
            list
                .sort(comparator[sort])
                .map((vote) => ({ nom: vote.vote, date: vote.postDate }))
        );
        return list.sort(comparator[sort]);
    }

    return sort !== "vote count"
        ? list.sort(comparator["nominee"])
        : _sortByCount(list.sort(comparator["nominee"]), direction);
};
