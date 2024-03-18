import React from 'react';
import {Route, Routes} from "react-router-dom";
import HomePage from "./screens/HomePage/HomePage";
import SignIn from "./screens/SignIn/SignIn";

function App() {

    return (
        <Routes>
            <Route path={'/'} element={<HomePage/>}/>
            <Route path={'/sign-in'} element={<SignIn/>}/>
        </Routes>
    );
}

export default App;
