import Spinner from "../../micro-components/Spinner.js";
import VoteCard from "../voteCard/VoteCard.js";

import { useVotesTableLogic } from "./_VotesTableLogic";

import "../../styles/css/macro-components/votesTable/VotesTable.css";
import Toast from "../toast/Toast";

function VotesTable(props) {
    const {
        state: { feedback, queryList, isUpdating, collapseAll },
        handlers: {
            handleToggleValidity,
            handleDeleteVote,
            handleClearFeedback,
        },
        constants: { TOOLS },
    } = useVotesTableLogic(props);

    return (
        <div
            className='VotesTable'
            data-fixed-height={isUpdating || queryList.length === 0}
            data-cell-view={props.cellView}
        >
            {isUpdating && <Spinner />}

            {feedback && (
                <Toast
                    message={feedback}
                    toastType={"error"}
                    closable={true}
                    onClose={handleClearFeedback}
                />
            )}

            {!isUpdating && (
                <div className='VotesTable__header'>
                    <p className='description'>
                        {queryList.length === 0
                            ? `There are currently no ${
                                  props.filters.bin === "all"
                                      ? ""
                                      : `${props.filters.bin} `
                              }votes`
                            : `Total ${queryList.length} Votes`}
                    </p>

                    {queryList.length > 0 && TOOLS && (
                        <div className='tools'>
                            {TOOLS.map((tool, i) => (
                                <button
                                    key={i}
                                    className='tools__item'
                                    onClick={tool.onClick}
                                >
                                    <span
                                        className='icon'
                                        style={{ "--iconClip": tool.iconClip }}
                                    >
                                        {tool.icon}
                                    </span>

                                    {tool.iconSmall && (
                                        <span
                                            className='icon small'
                                            style={{
                                                "--iconClip":
                                                    tool.iconSmallClip,
                                            }}
                                        >
                                            {tool.iconSmall}
                                        </span>
                                    )}

                                    <span className='text'>{tool.text}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {!isUpdating &&
                queryList.length > 0 &&
                queryList.map((vote, i) => {
                    return (
                        <VoteCard
                            number={i + 1}
                            key={vote._id}
                            vote={vote}
                            onToggleValidity={handleToggleValidity}
                            onDeleteVote={handleDeleteVote}
                            isRemovable={props.filters.bin !== "all"}
                            forceCollapse={collapseAll}
                            cellView={props.cellView}
                        />
                    );
                })}
        </div>
    );
}

export default VotesTable;
