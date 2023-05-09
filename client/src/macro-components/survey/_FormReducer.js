import { useReducer } from "react";

export const useFormReducer = (props) => {
    const initialState = {
        values: {
            name: "",
            vote: "",
            reason: "",
        },
        isValid: false,
        reasonLineCount: props.initialLineCount,
    };

    const reducer = (state, action) => {
        switch (action.type) {
            case "INC_REASON_LINE_COUNT": {
                return { ...state, reasonLineCount: ++state.reasonLineCount };
            }
            case "CHANGE_NAME": {
                state = { ...state };
                state.values.name = action.payload;
                break;
            }
            case "CHANGE_VOTE": {
                state = { ...state };
                state.values.vote = action.payload;
                break;
            }
            case "CHANGE_REASON": {
                state = { ...state };
                state.values.reason = action.payload;
                break;
            }

            default: {
                return state;
            }
        }

        state.isValid = Object.entries(state.values)
            .map(([_, value]) => value.trim().length > 0)
            .reduce((result, current) => result && current, true);

        console.log(state);
        return state;
    };

    return useReducer(reducer, initialState);
};
