import './App.css';
import {Route, Routes, Navigate, useNavigate} from "react-router-dom";
import Login from "./Login/login";
import React from "react";
import HomePage from "./HomePage/homePage"
import CourseCard from "./HomePage/courseCard"
import NoteDetails from "./NoteDetails/noteDetails"
import {ToastContainerComponent} from './common/Toast';
import "react-toastify/dist/ReactToastify.css"

function App() {
    const isLoggedIn = localStorage.getItem('loggedIn');
    const navigate = useNavigate();
    const handleSignOut = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("loggedIn");
        navigate("/");
    };

    return (
        <div className="App">
            <ToastContainerComponent/>
            <Routes>
                {isLoggedIn ? (
                    <Route path="/" element={<Navigate to="/HomePage" replace/>}/>
                ) : (
                    <Route path="/" element={<Login/>}/>
                )}
                <Route path="/HomePage" element={<HomePage handleSignOut={handleSignOut}/>}>
                    <Route path="" element={<CourseCard/>}/>
                </Route>
                <Route path='/NoteDetails/:id' element={<NoteDetails/>}/>
            </Routes>
        </div>
    );
}

export default App;
