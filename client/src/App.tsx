import React from 'react';
import {Route, Routes} from "react-router-dom";
import HomePage from "./screens/HomePage/HomePage";

function App() {

    return (
        <Routes>
            <Route path={'/'} element={<HomePage/>}/>
        </Routes>
    );
}

export default App;
