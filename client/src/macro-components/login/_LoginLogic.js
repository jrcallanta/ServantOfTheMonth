import { useCallback, useContext, useEffect, useReducer, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/auth-context";

export const useLoginLogic = (props) => {
    const ctx = useContext(AuthContext);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        if (ctx.state.isAuthorized) navigate("../admin");
    }, [ctx.state.isAuthorized, navigate]);

    const [state, dispatch] = useReducer(_formReducer, {
        isValid: false,
        isSubmitting: false,
        isIncorrect: null,
        input: "",
        feedback: "",
        showPassword: false,
    });

    /********************************
     *  Function Handler called
     *  when the submit button is
     *  pressed
     */
    const handleButtonPress = useCallback((event) => {}, []);

    /********************************
     *  Function Handler called view
     *  password button is pressed
     */
    const handleToggleViewPassword = useCallback(
        (event) => {
            dispatch({ type: "TOGGLE_PASSWORD" });
            let input = inputRef.current;
            if (input) {
                setTimeout(() => {
                    input.selectionStart = input.selectionEnd =
                        input.value.length;
                    input.focus();
                }, 1);
            }
        },
        [dispatch, inputRef]
    );

    /********************************
     *  Form Function Handler called
     *  when a key is pressed
     */
    const handleKeyDown = useCallback((event) => {}, []);

    /********************************
     *  Form Function Handler called
     *  when a input value changes
     */
    const handleChangeInput = useCallback(
        ({ target }) => {
            dispatch({ type: "CHANGE_INPUT", payload: target.value });
        },
        [dispatch]
    );

    /********************************
     *  Form Function Handler called
     *  when submitted
     */
    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();
            dispatch({ type: "SUBMIT_INPUT" });

            const formData = Object.fromEntries(new FormData(event.target));

            if (props.onLogin)
                props.onLogin(formData, (response, error) => {
                    console.log(response, error);
                    console.log(error?.response.status);
                    if (error)
                        switch (error.response.status) {
                            case 401: {
                                dispatch({
                                    type: "INCORRECT_WITH_FEEDBACK",
                                    payload:
                                        "Password is incorrect. Try again.",
                                });
                                inputRef.current?.setSelectionRange(
                                    0,
                                    inputRef.current?.value.length
                                );
                                break;
                            }
                            default: {
                                dispatch({
                                    type: "INCORRECT_WITH_FEEDBACK",
                                    payload:
                                        "There was an issue. Try again later.",
                                });
                            }
                        }
                });
        },
        [dispatch, props, inputRef]
    );

    return {
        state,
        handlers: {
            handleButtonPress,
            handleToggleViewPassword,
            handleKeyDown,
            handleChangeInput,
            handleSubmit,
        },
        refs: { inputRef },
    };
};

const _formReducer = (state, action) => {
    switch (action.type) {
        case "CHANGE_INPUT": {
            return {
                ...state,
                isIncorrect: null,
                input: action.payload,
                isValid: action.payload.length > 0,
            };
        }

        case "SUBMIT_INPUT": {
            return {
                ...state,
                isSubmitting: true,
                isIncorrect: null,
                feedback: "",
            };
        }

        case "INCORRECT_WITH_FEEDBACK": {
            return {
                ...state,
                isSubmitting: false,
                isIncorrect: true,
                feedback: action.payload,
            };
        }

        case "TOGGLE_PASSWORD": {
            return { ...state, showPassword: !state.showPassword };
        }

        default: {
            return state;
        }
    }
};
