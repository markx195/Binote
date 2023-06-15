import './App.css';
import {Route, Routes, Navigate, useNavigate} from "react-router-dom";
import Login from "./Login/login";
import React, {useEffect, useState} from "react";
import HomePage from "./HomePage/homePage"
import CourseCard from "./HomePage/courseCard"
import NoteDetails from "./NoteDetails/noteDetails"
import {ToastContainerComponent} from './common/Toast';
import "react-toastify/dist/ReactToastify.css"
import Profile from "./Profile/profile";
import Statistical from "./DashBoard/statistical"
import VCard from "./Profile/V-card";
import i18next from "i18next";

const storedAccessToken = localStorage.getItem('accessToken');

function App() {
    const isLoggedIn = localStorage.getItem('loggedIn');
    const navigate = useNavigate();
    const handleSignOut = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("loggedIn");
        navigate("/");
    };
    const [userId, setUserId] = useState("")
    const [infoData, setInfoData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = 'https://binote-api.biplus.com.vn/users/me';

                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${storedAccessToken}`
                    }
                });

                const data = await response.json();
                setInfoData(data)
                const userID = data.data.id
                setUserId(userID)
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);
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
                <Route path='/NoteDetails/:id' element={<NoteDetails handleSignOut={handleSignOut} userId={userId}/>}/>
                <Route path='/Profile' element={<Profile infoData={infoData}/>}/>
                <Route path='/bicard/:id' element={<VCard/>}/>
                <Route path='/Statistical' element={<Statistical/>}/>
            </Routes>
        </div>
    );
}

export default App;
