import { ReactComponent as OptionsIcon } from "../../assets/OptionsIcon.svg";
import "../../styles/css/macro-components/voteCard/VoteCard.css";
import { useVoteCardLogic } from "./_VoteCardLogic";

function VoteCard(props) {
    const { vote } = props;
    const {
        state: { isExpanded, isOptionsShown },
        handlers: {
            handleToggleOptions,
            handleToggleValidity,
            handleDeleteVote,
            handleCardClick,
        },
        refs: { voteCardRef, optionsRef },
    } = useVoteCardLogic(props);

    return (
        <div
            className='VoteCard'
            data-aria-expanded={isExpanded}
            data-aria-valid={vote.valid}
            data-deleted={vote.deleted}
            data-cell-view={props.cellView}
            style={{ "--i": props.number }}
            onMouseDown={handleCardClick}
            ref={voteCardRef}
        >
            <div className='VoteCard__header'>
                <div className='VoteCard__header__start'>
                    <h3 className='nominee'>{vote.vote}</h3>

                    <h3 className='number'>
                        {"#" + `${props.number}`.padStart(3, "0")}
                    </h3>

                    {!vote.valid && <h3 className='invalid'>invalid</h3>}

                    <div className='options' ref={optionsRef}>
                        <div
                            className='options__button'
                            onClick={handleToggleOptions}
                        >
                            <div className='options__icon'>
                                <OptionsIcon />
                            </div>
                        </div>

                        {isOptionsShown && (
                            <ul className='options__menu'>
                                <li
                                    className='options__menu__item'
                                    onClick={handleToggleValidity}
                                >
                                    <p>
                                        {vote.valid
                                            ? "mark invalid"
                                            : "mark valid"}
                                    </p>
                                </li>
                                <li
                                    className='options__menu__item '
                                    onClick={handleDeleteVote}
                                >
                                    <p>delete vote</p>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>

                <div className='VoteCard__header__end'>
                    <h3 className='voter'>by {vote.name}</h3>
                    <h3 className='date'>
                        {new Date(vote.date.ms).toLocaleString("en-us", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                        })}
                    </h3>
                </div>
            </div>

            <div className='VoteCard__body'>
                <p className='reason'>{vote.reason}</p>
            </div>
        </div>
    );
}

export default VoteCard;
