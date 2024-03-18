import React from 'react';
import {Route, Routes} from "react-router-dom";
import HomePage from "./screens/HomePage/HomePage";
import SignUp from "./screens/SignUp/SignUp";
import Login from "./screens/Login/Login";

function App() {

    return (
        <Routes>
            <Route path={'/'} element={<HomePage/>}/>
            <Route path={'/sign-up'} element={<SignUp/>}/>
            <Route path={'/login'} element={<Login/>}/>
        </Routes>
    );
}

export default App;
