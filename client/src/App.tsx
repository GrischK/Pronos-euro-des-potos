import React, {useState} from 'react';
import {Route, Routes} from "react-router-dom";
import HomePage from "./screens/HomePage/HomePage";
import SignUp from "./screens/SignUp/SignUp";
import Login from "./screens/Login/Login";
import {useGetAppStatusQuery, useGetProfileQuery} from "./gql/generated/schema";
import Matches from "./screens/Matches/Matches";
import Pronos from "./screens/Pronos/Pronos";

function App() {
    const {data: current, refetch} = useGetProfileQuery({errorPolicy: "ignore",});
    const userIsLogged = current?.profile?.id
    const {data: appStatus, refetch: refetchAppStatus} = useGetAppStatusQuery();
    const app = appStatus?.getAppStatus.predictionsAreActivated;

    const handlePredictionSetting = () => {
        // setApp(!app)
        refetchAppStatus()
    }

    return (
        <Routes>
            <Route path={'/'}
                   element={<HomePage handlePredictionSetting={handlePredictionSetting} app={app}/>}/>
            <Route path={'/sign-up'} element={<SignUp/>}/>
            <Route path={'/login'} element={<Login/>}/>
            {
                userIsLogged && (
                    <>
                        <Route path={'/matches'} element={<Matches userId={current?.profile?.id}  predictionsAreActivated={app}/>}/>
                        <Route path={'/pronos'} element={<Pronos/>}/>
                    </>
                )
            }
        </Routes>
    );
}



export default App;
