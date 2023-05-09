import { Routes, Route } from "react-router-dom";

import Frame from "./layout/Frame/Frame.js";
import Survey from "./macro-components/survey/Survey.js";

import { useAppLogic } from "./_AppLogic.js";

function App() {
    const {
        state: { isAuthorized, isUpdating },
        routeElements: { loginRouteElement, adminRouteElement },
    } = useAppLogic();

    return (
        <Routes>
            <Route path={"/"} element={<Frame showTitle={!isUpdating} />}>
                <Route path={""} element={<Survey initialLineCount={5} />} />
            </Route>

            <Route
                path={"/"}
                element={
                    <Frame showTitle={!isUpdating} isFull={isAuthorized} />
                }
            >
                <Route path={"login/*"} element={loginRouteElement} />
                <Route path={"admin/*"} element={adminRouteElement} />
            </Route>
        </Routes>
    );
}

export default App;
