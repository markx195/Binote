import './App.css';
import BackgroundSlider from "./Slider/backgroundSlider";
import {Route, Routes} from "react-router-dom";
import Login from "./Login/login";
import React, {useState} from "react";
import HomePage from "./HomePage/homePage"
import CourseCard from "./HomePage/courseCard"
import NoteDetails from "./NoteDetails/noteDetails"

function App() {
    const [access_token, setAccessToken] = useState('');

    const handleAccessTokenChange = (token) => {
        setAccessToken(token);
    };
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<BackgroundSlider/>}/>
                <Route path="/login" element={<Login onAccessTokenChange={handleAccessTokenChange}/>}/>
                <Route path="/HomePage" element={<HomePage/>}>
                    <Route path="" element={<CourseCard access_token={access_token}/>}/>
                </Route>
                <Route path='/NoteDetails/:id' element={<NoteDetails/>}/>
            </Routes>
        </div>
    );
}

export default App;
