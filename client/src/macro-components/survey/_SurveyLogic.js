import { useAuthorizedApi } from "../../tools/useAuthorizedAPI.js";
import { useFormReducer } from "./_FormReducer.js";
import { useSubmitReducer } from "./_SubmitReducer.js";

export const useSurveyLogic = (props) => {
    const [formState, formDispatch] = useFormReducer(props);
    const [submitState, submitDispatch] = useSubmitReducer();
    const api = useAuthorizedApi();

    const _handleAdjustTextarea = ({ target }) => {
        if (target.scrollHeight > Number(target.style.height.slice(0, -2))) {
            if (Number(target.style.height.slice(0, -2)) > 0) {
                console.log("adding line...");
                formDispatch({ type: "INC_REASON_LINE_COUNT" });
            }

            target.style.height = target.scrollHeight + "px";
        }

        let surveyPage = document.querySelector(".Survey");
        surveyPage.scrollTo({
            top: surveyPage.scrollHeight,
            behavior: "smooth",
        });
    };

    const _newAbortSignal = (timeMs) => {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), timeMs || 0);
        return controller.signal;
    };

    const handlers = {
        handleSubmit: (event) => {
            event.preventDefault();
            submitDispatch({ type: "SUBMIT_VOTE" });

            const formData = Object.fromEntries(new FormData(event.target));
            formData.signal = _newAbortSignal(3000);

            api.post("/api/vote", formData)
                .then((response) => {
                    if (response.status !== 200)
                        throw Error("Could not submit vote.");

                    console.log(response);
                    submitDispatch({
                        type: "SUCCESS",
                        payload: "Vote submitted",
                    });
                })
                .catch((error) => {
                    console.log(error);
                    submitDispatch({
                        type: "ERROR",
                        payload: "There was an issue. Try again later.",
                    });
                });
        },

        handleKeyDown: (event) => {
            if (event.keyCode === 13) event.preventDefault();
        },

        handleChangeName: ({ target }) => {
            console.log("changing name");
            formDispatch({ type: "CHANGE_NAME", payload: target.value });
        },

        handleChangeVote: ({ target }) => {
            console.log("changing vote");
            formDispatch({ type: "CHANGE_VOTE", payload: target.value });
        },

        handleChangeReason: ({ target }) => {
            _handleAdjustTextarea({ target });
            console.log("changing reason");
            formDispatch({ type: "CHANGE_REASON", payload: target.value });
        },
    };

    return {
        state: { formState, submitState },
        handlers,
    };
};
