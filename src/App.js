import './App.css';
import {Route, Routes} from "react-router-dom";
import Login from "./Login/login";
import React from "react";
import HomePage from "./HomePage/homePage"
import CourseCard from "./HomePage/courseCard"
import NoteDetails from "./NoteDetails/noteDetails"

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/HomePage" element={<HomePage/>}>
                    <Route path="" element={<CourseCard/>}/>
                </Route>
                <Route path='/NoteDetails/:id' element={<NoteDetails/>}/>
            </Routes>
        </div>
    );
}

export default App;
