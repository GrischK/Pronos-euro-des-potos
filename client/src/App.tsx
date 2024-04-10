import React from 'react';
import {Route, Routes} from "react-router-dom";
import HomePage from "./screens/HomePage/HomePage";
import SignUp from "./screens/SignUp/SignUp";
import Login from "./screens/Login/Login";
import {useGetProfileQuery} from "./gql/generated/schema";
import Matches from "./screens/Matches/Matches";
import Pronos from "./screens/Pronos/Pronos";

function App() {
    const {data: current, refetch} = useGetProfileQuery({errorPolicy: "ignore",});
    const userIsLogged = current?.profile?.id

    return (
        <Routes>
            <Route path={'/'} element={<HomePage/>}/>
            <Route path={'/sign-up'} element={<SignUp/>}/>
            <Route path={'/login'} element={<Login/>}/>
            {
                userIsLogged && (
                    <>
                        <Route path={'/matches'} element={<Matches userId={current?.profile?.id}/>}/>
                        <Route path={'/pronos'} element={<Pronos/>}/>
                    </>
                )
            }
        </Routes>
    );
}



export default App;
