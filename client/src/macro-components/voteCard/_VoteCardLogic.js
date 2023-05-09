import { useCallback, useEffect, useRef, useState } from "react";
import { useOnClickOut, useOnLeave } from "../../tools/customHooks";

export const useVoteCardLogic = (props) => {
    const { vote, forceCollapse } = props;
    const { isRemovable, onToggleValidity, onDeleteVote } = props;

    const [isExpanded, setIsExpanded] = useState(!forceCollapse && vote.valid);
    const [isOptionsShown, setIsOptionsShown] = useState(false);
    const voteCardRef = useRef(null);
    const optionsRef = useRef(null);

    /********************************
     * useEffect to listen to prop.forceCollapse
     * in order to trigger state within this
     * component, giving parent control.
     */
    useEffect(() => {
        setIsExpanded(!forceCollapse);
    }, [forceCollapse]);

    /********************************
     * useEffect to listen on clicking outside
     * of optionsMenu to set isOptionsShown
     * to false
     */
    useOnClickOut(optionsRef, isOptionsShown, () =>
        setIsOptionsShown((prev) => false)
    );

    useOnLeave(optionsRef, isOptionsShown, () =>
        setIsOptionsShown((prev) => false)
    );

    /********************************
     * useEffect to listen on props.vote.valid
     * passed from parent to trigger valid
     * on invalid votes
     */
    useEffect(() => {
        if (vote.valid) setIsExpanded((prev) => true);
        else setIsExpanded((prev) => false);
    }, [vote.valid]);

    /********************************
     * Handler called when the options
     * menu is toggled to expand
     */
    const handleToggleOptions = useCallback(
        (event) => setIsOptionsShown((prev) => !prev),
        [setIsOptionsShown]
    );

    /********************************
     * Handler called when the vote card
     * is triggered into valid/invalid state,
     * calls props.onToggleValidity method
     * passed from parent after animation.
     */
    const handleToggleValidity = useCallback(
        (event) => {
            // event.preventDefault();
            handleToggleOptions();
            event.stopPropagation();

            let update = () => {
                onToggleValidity(vote._id, !vote.valid);
            };

            if (isRemovable) {
                voteCardRef.current.addEventListener("animationend", update, {
                    once: true,
                });
                voteCardRef.current.setAttribute("data-removed", "true");
            } else update();
        },
        [
            vote._id,
            vote.valid,
            isRemovable,
            onToggleValidity,
            voteCardRef,
            handleToggleOptions,
        ]
    );

    /********************************
     * Handler called when the vote card
     * is triggered into deletion, calls
     * props.onDeleteVote method
     * passed from parent after animation.
     */
    const handleDeleteVote = useCallback(
        (event) => {
            handleToggleOptions();
            event.stopPropagation();

            if (!vote.deleted) {
                let update = () => onDeleteVote(vote._id);
                voteCardRef.current.addEventListener("animationend", update, {
                    once: true,
                });
                voteCardRef.current.setAttribute("data-deleted", "true");
            }
        },
        [vote._id, vote.deleted, onDeleteVote, voteCardRef, handleToggleOptions]
    );

    /********************************
     * Handler called when vote card
     * is toggled to expand, revaling
     * the vote.reason.
     */
    const handleToggleExpanded = () => setIsExpanded((prev) => !prev);

    /********************************
     * Handler called when vote card
     * is clicked to expand, but only
     * if click is not contained by
     * optionsRef, [for UX]
     */
    const handleCardClick = useCallback(
        (event) => {
            if (voteCardRef.current) {
                let moved = false;

                const moveListener = () => {
                    moved = true;
                };

                voteCardRef.current.addEventListener(
                    "mousemove",
                    moveListener,
                    {
                        once: true,
                    }
                );

                const upListener = () => {
                    if (!moved && !optionsRef.current.contains(event.target))
                        setIsExpanded((prev) => !prev);
                };

                voteCardRef.current.addEventListener("mouseup", upListener, {
                    once: true,
                });

                return () => {
                    if (voteCardRef.current) {
                        voteCardRef.current.removeEventListener(
                            "mousemove",
                            moveListener
                        );
                        voteCardRef.current.removeEventListener(
                            "mouseup",
                            upListener
                        );
                    }
                };
            }
        },
        [voteCardRef, optionsRef, setIsExpanded]
    );

    return {
        state: {
            isExpanded,
            isOptionsShown,
        },
        handlers: {
            handleToggleOptions,
            handleToggleValidity,
            handleDeleteVote,
            handleToggleExpanded,
            handleCardClick,
        },
        refs: {
            voteCardRef,
            optionsRef,
        },
    };
};
