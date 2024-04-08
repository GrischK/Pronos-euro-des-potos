import React, {useState} from 'react';
import {Route, Routes} from "react-router-dom";
import HomePage from "./screens/HomePage/HomePage";
import SignUp from "./screens/SignUp/SignUp";
import Login from "./screens/Login/Login";
import {useGetProfileQuery} from "./gql/generated/schema";
import Matches from "./screens/Matches/Matches";
import Admin from "./screens/Admin/Admin";

function App() {
    const {data: current, refetch} = useGetProfileQuery({errorPolicy: "ignore",});
    const userIsLogged = current?.profile?.id
    const user = current?.profile

    const [arePredictionOn, setArePredictionOn] = useState(true)

    const handlePrediction = () => {
        setArePredictionOn(!arePredictionOn)
    }

    console.log(arePredictionOn)
    return (
        <Routes>
            <Route path={'/'} element={<HomePage handlePrediction={handlePrediction} predictionStatus={arePredictionOn}/>}/>
            <Route path={'/sign-up'} element={<SignUp/>}/>
            <Route path={'/login'} element={<Login/>}/>
            {
                userIsLogged && (
                    <Route path={'/matches'} element={<Matches userId={current?.profile?.id}/>}/>
                )
            }
            {
                userIsLogged && user?.role === 'admin' && (
                    <Route path={'/admin'} element={<Admin handlePrediction={handlePrediction} predictionStatus={arePredictionOn}/>}/>
                )
            }
        </Routes>
    );
}

export default App;
