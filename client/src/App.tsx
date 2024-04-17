import React from 'react';
import {Route, Routes} from "react-router-dom";
import HomePage from "./screens/HomePage/HomePage";
import SignUp from "./screens/SignUp/SignUp";
import Login from "./screens/Login/Login";
import {useGetAppStatusQuery, useGetProfileQuery} from "./gql/generated/schema";
import Matches from "./screens/Matches/Matches";
import Pronos from "./screens/Pronos/Pronos";
import TestPage from "./screens/TestPage";
import Nav from "./components/Nav/Nav";
import ChangePassword from "./screens/ChangePassword/ChangePassword";
import RequestChangingPassword from "./screens/RequestChangingPassword/RequestChangingPassword";

function App() {
    const {data: current, refetch} = useGetProfileQuery({errorPolicy: "ignore",});
    const userIsLogged = current?.profile?.id
    const userRole = current?.profile?.role
    const profile = current?.profile

    const {data: appStatus, refetch: refetchAppStatus} = useGetAppStatusQuery();
    const app = appStatus?.getAppStatus.predictionsAreActivated || false;

    const handlePredictionSetting = () => {
        // setApp(!app)
        refetchAppStatus()
    }

    return (
        <Routes>
            <Route path={'/'}
                   element={<HomePage handlePredictionSetting={handlePredictionSetting} app={app} userProfile={profile}/>}
            />
            <Route path={'/sign-up'} element={<SignUp/>}/>
            <Route path={'/login'} element={<Login/>}/>
            <Route path={'/change-password/:id/:token'} element={<ChangePassword/>}/>
            <Route path={'/request-changing-password'} element={<RequestChangingPassword/>}/>

            {
                userIsLogged && (
                    <>
                        <Route path={'/matches'}
                               element={<Nav><Matches userId={current?.profile?.id} predictionsAreActivated={app}/></Nav>}
                        />
                        <Route path={'/pronos'} element={<ChangePassword/>}/>
                    </>
                )
            }
            {
                userIsLogged && userRole === "admin" && (
                    <>
                        <Route path={'/matches'}
                               element={<Nav><Matches userId={current?.profile?.id} predictionsAreActivated={app}/></Nav>}
                        />
                        <Route path={'/pronos'} element={<Pronos/>}/>
                        <Route path={'/admin'} element={<TestPage/>}/>
                    </>
                )
            }
        </Routes>
    );
}


export default App;
