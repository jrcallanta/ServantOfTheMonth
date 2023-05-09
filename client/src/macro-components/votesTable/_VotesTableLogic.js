import { ReactComponent as CollapseIcon } from "../../assets/CollapseIcon.svg";
import { ReactComponent as CollapseIconS } from "../../assets/CollapseIconSmall.svg";
import { ReactComponent as ExpandIcon } from "../../assets/ExpandIcon.svg";
import { ReactComponent as ExpandIconS } from "../../assets/ExpandIconSmall.svg";
import { useCallback, useMemo, useEffect, useState } from "react";
import { useVotesTableQueryReducer } from "./_VotesTableQueryLogic";
import { useAuthorizedApi } from "../../tools/useAuthorizedAPI";

export const useVotesTableLogic = ({
    filters: { year, month, bin, sort, direction },
}) => {
    const [state, dispatch] = useVotesTableQueryReducer({
        month,
        bin,
        sort,
        direction,
    });
    const api = useAuthorizedApi();
    const [collapseAll, setCollapseAll] = useState(false);

    /********************************
     * Handler called when sending a
     * requst to API to retrieve votes
     * for a specified month.
     */
    const handleGetVotes = useCallback(
        async (year, month, controller) => {
            try {
                const response = await api.get(`/api/vote/${month}/${year}`, {
                    signal: controller.signal,
                });

                if (response.data) {
                    dispatch({
                        type: "SET_VOTES_LIST",
                        payload: response.data.votes,
                    });
                }
            } catch (error) {
                dispatch({
                    type: "SET_FEEDBACK_CLEAR_LIST",
                    payload: "There was an issue. Please try again.",
                });
            }
        },
        [api, dispatch]
    );

    /********************************
     * Handler called when a vote card
     * is removed from the list, works as
     * a pre-method called by VoteCard
     */
    const handleRemoveFromList = useCallback(() => {
        // console.log("removing from list");
    }, []);

    /********************************
     * Handler called when a vote card
     * is toggled for its validity, works as
     * a pre-method called by VoteCard. Triggers
     * dispatch/api request for patching
     * vote document in database
     */
    const handleToggleValidity = useCallback(
        async (id, validity) => {
            // console.log(id, validity);

            dispatch({ type: "SET_FEEDBACK", payload: null });
            dispatch({ type: "SET_VALIDITY", payload: { id, validity } });

            await api
                .patch(`/api/vote/${id}`, {
                    validUpdate: validity,
                })
                .then((response) => {
                    if (response && response.data.vote.valid !== validity)
                        throw new Error();
                })
                .catch((error) => {
                    dispatch({
                        type: "SET_VALIDITY",
                        payload: { id, validity: !validity },
                    });
                    dispatch({
                        type: "SET_FEEDBACK",
                        payload: "Could not update. Please try again.",
                    });
                });
        },
        [api, dispatch]
    );

    /********************************
     * Handler called when a vote card
     * is marked for deletion, works as
     * a pre-method called by VoteCard,
     * Triggers dispatch/api request for
     * deleting vote document in database.
     */
    const handleDeleteVote = useCallback(
        async (id) => {
            // console.log(id);

            dispatch({ type: "SET_FEEDBACK", payload: null });
            dispatch({ type: "SET_DELETE", payload: { id, delete: true } });

            await api
                .delete(`/api/vote/${id}`)
                .then((response) => {})
                .catch((error) => {
                    dispatch({
                        type: "SET_DELETE",
                        payload: { id, delete: false },
                    });
                    dispatch({
                        type: "SET_FEEDBACK",
                        payload: "Could not delete. Please try again.",
                    });
                });
        },
        [api, dispatch]
    );

    /********************************
     * Handler called to force all vote
     * cards to collapse/expand via collapseAll
     * value.
     */
    const handleToggleCollapse = useCallback(() => {
        // console.log("collapsing...");
        setCollapseAll((prev) => !prev);
    }, [setCollapseAll]);

    /********************************
     * Handler called when wanting to
     * clear feedback. Used as passble
     * function to child components.
     */
    const handleClearFeedback = useCallback(() => {
        dispatch({ type: "SET_FEEDBACK", payload: null });
    }, [dispatch]);

    /********************************
     * useEffect to listen to new month
     * selection, triggering dispatch/api
     * request for new vote list
     */
    useEffect(() => {
        let timer;

        dispatch({ type: "SHOW_SPINNER" });
        const controller = new AbortController();

        timer = setTimeout(async () => {
            setCollapseAll(false);
            await handleGetVotes(year, month, controller);
            dispatch({ type: "HIDE_SPINNER" });
        }, 0);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [year, month, dispatch, handleGetVotes]);

    /********************************
     * useEffect to listen to state of
     * voteList (when a validity is changed),
     * triggering a refresh dispatch
     */
    useEffect(() => {
        dispatch({ type: "REFRESH_QUERY_LIST" });
    }, [state.votesList, bin, sort, direction, dispatch]);

    /********************************
     * Value containing dynamic list
     * of tools the user can use to
     * manipulate votes. Each tool item
     * required to have text and
     * onClick attributes.
     */
    const TOOLS = useMemo(
        () => [
            {
                name: "collapse",
                onClick: handleToggleCollapse,
                icon: collapseAll ? <ExpandIcon /> : <CollapseIcon />,
                iconSmall: collapseAll ? <ExpandIconS /> : <CollapseIconS />,
                iconClip: collapseAll
                    ? "url(#expand-clip"
                    : "url(#collapse-clip)",
                iconSmallClip: collapseAll
                    ? "url(#expand-clip-small)"
                    : "url(#collapse-clip-small)",
            },
        ],
        [collapseAll, handleToggleCollapse]
    );

    return {
        state: { ...state, collapseAll },
        handlers: {
            handleRemoveFromList,
            handleToggleValidity,
            handleDeleteVote,
            handleClearFeedback,
        },
        constants: {
            TOOLS,
        },
    };
};
