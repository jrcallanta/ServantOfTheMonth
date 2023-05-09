import { useReducer } from "react";

export const useSubmitReducer = () => {
    const initialState = {
        success: null,
        feedback: null,
        isSubmitting: false,
    };

    const reducer = (state, action) => {
        switch (action.type) {
            case "SUBMIT_VOTE": {
                return {
                    ...state,
                    success: null,
                    feedback: null,
                    isSubmitting: true,
                };
            }

            case "SUCCESS": {
                return {
                    ...state,
                    success: true,
                    isSubmitting: false,
                    feedback: action.payload,
                };
            }

            case "ERROR": {
                return {
                    ...state,
                    success: false,
                    isSubmitting: false,
                    feedback: action.payload,
                };
            }

            default: {
                return state;
            }
        }
    };

    return useReducer(reducer, initialState);
};
