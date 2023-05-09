import { createContext, useCallback, useEffect, useReducer } from "react";
import { useAuthorizedApi } from "../tools/useAuthorizedAPI";

/**********************
 * Create Context with initial
 * values/placeholders for
 * autocompletion.
 */
export const AuthContext = createContext({
    state: {
        currentUser: null,
        isAuthorized: false,
        isUpdating: true,
    },
    handlers: {
        logInHandler: () => {},
        logOutHandler: () => {},
    },
});

/**********************
 * Functional component works as a
 * wrapper for the provider of the
 * AuthContext. State management
 * controlled using a reducer.
 */
export const AuthContextProvider = (props) => {
    const api = useAuthorizedApi();
    const [state, dispatch] = useReducer(authorizationReducer, {
        currentUser: null,
        isAuthorized: false,
        isUpdating: true,
        revoked: false,
    });

    useEffect(() => {
        console.log("[AuthContext.init]:");
        api.get("/api/session/access")
            .then((response) => {
                if (response.status !== 200)
                    throw new Error("Could not log in.");

                dispatch({ type: "LOGIN", payload: response.data });
            })
            .catch((error) => {
                dispatch({ type: "LOGOUT" });
            });
    }, [api]);

    /**********************
     * Handler called to make api request
     * to log into user using provided
     * credentials. Response/Error from
     * request is passed back to callee
     * via callback function.
     */
    const logInHandler = useCallback(
        (data, callback) => {
            console.log("[AuthContext.LogInHandler]:");

            api.post("/api/login", data)
                .then((response) => {
                    if (response.status === 200)
                        dispatch({ type: "LOGIN", payload: response.data });
                    if (callback) callback(response);
                })
                .catch((error) => {
                    dispatch({ type: "LOGOUT" });
                    if (callback) callback(null, error);
                });
        },
        [api]
    );

    /**********************
     * Handler called to make api request
     * to log out of user. Response/Error
     * from request is passed back to callee
     * via callback function.
     */
    const logOutHandler = useCallback(
        (callback) => {
            console.log("[AuthContext.LogOutHandler]:");

            api.post("/api/session/logout")
                .then((response) => {
                    if (response.status === 200) dispatch({ type: "LOGOUT" });
                    else throw new Error("Could not log out.");

                    if (callback) callback(response);
                })
                .catch((error) => {
                    console.log(error);
                    if (callback) callback(error);
                });
        },
        [api]
    );

    return (
        <AuthContext.Provider
            value={{
                state,
                handlers: {
                    logInHandler,
                    logOutHandler,
                },
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

const authorizationReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN": {
            if (action.payload) {
                console.log(action.payload);
                state = {
                    ...state,
                    currentUser: action.payload.currentUser,
                    isAuthorized: true,
                    isUpdating: false,
                };
            }
            return state;
        }

        case "LOGOUT": {
            console.log("dispatch: LOGGING_OUT");
            state = {
                ...state,
                currentUser: null,
                isAuthorized: false,
                isUpdating: false,
            };
            return state;
        }
        default: {
            return state;
        }
    }
};
