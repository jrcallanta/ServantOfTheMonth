import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "./store/auth-context";
import Spinner from "./micro-components/Spinner.js";
import Login from "./macro-components/login/Login.js";
import AdminRouter from "./macro-components/adminRouter/AdminRouter.js";

export const useAppLogic = () => {
    const ctx = useContext(AuthContext);

    const loginRouteElement = ctx.state.isUpdating ? (
        <Spinner />
    ) : ctx.state.isAuthorized ? (
        <Navigate to={"/admin"} replace={true} />
    ) : (
        <Login onLogin={ctx.handlers.logInHandler} />
    );

    const adminRouteElement = ctx.state.isUpdating ? (
        <Spinner />
    ) : !ctx.state.isAuthorized ? (
        <Navigate to={"/login"} replace={true} />
    ) : (
        <AdminRouter />
    );

    return {
        state: {
            isAuthorized: ctx.state.isAuthorized,
            isUpdating: ctx.state.isUpdating,
        },
        routeElements: {
            loginRouteElement,
            adminRouteElement,
        },
    };
};
