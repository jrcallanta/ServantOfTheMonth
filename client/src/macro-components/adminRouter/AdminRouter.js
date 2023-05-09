import { Routes, Route, Navigate } from "react-router-dom";

import NavFrame from "../../layout/NavFrame/NavFrame.js";
import VotesPage from "../../pages/VotesPage/VotesPage.js";
import SettingsPage from "../../pages/SettingsPage/SettingsPage.js";

import "../../styles/css/macro-components/adminRouter/AdminRouter.css";

function AdminRouter(props) {
    return (
        <div className='AdminRouter'>
            <Routes>
                <Route path={"/*"} element={<NavFrame />}>
                    <Route
                        path=''
                        element={<Navigate to={"votes"} replace={true} />}
                    />
                    <Route path='votes/*' element={<VotesPage />} />
                    <Route path='settings/*' element={<SettingsPage />} />
                </Route>
            </Routes>
        </div>
    );
}

export default AdminRouter;
