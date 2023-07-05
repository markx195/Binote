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

const storedAccessToken = localStorage.getItem('accessToken');

function App() {
    const navigate = useNavigate();
    const handleSignOut = () => {
        fetch('https://binote-api.biplus.com.vn/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${storedAccessToken}`,
            },
            body: JSON.stringify({refresh_token: storedAccessToken}), // Pass the access token in the request body
        })
            .then(response => {
                localStorage.removeItem("accessToken");
                localStorage.setItem("loggedIn", true);
                localStorage.setItem('QA', "logOut");
                navigate("/");
            })
            .catch(error => {
                // handle the error here if needed
            });
    };


    const [infoData, setInfoData] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = 'http://192.168.3.150:8050/users/me';

                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${storedAccessToken}`
                    }
                });

                const data = await response.json();
                setInfoData(data.data)
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="App bg-[#F6F6F6]">
            <ToastContainerComponent/>
            <Routes>
                {localStorage.getItem('QA') === "active" ? (
                    <Route path="/" element={<Navigate to="/home" replace/>}/>
                ) : (
                    <Route path="/" element={<Login/>}/>
                )}
                <Route path="/home" element={<HomePage handleSignOut={handleSignOut}/>}>
                    <Route path="" element={<CourseCard/>}/>
                </Route>
                <Route path='/note/:id' element={<NoteDetails handleSignOut={handleSignOut}/>}/>
                <Route path='/profile'
                       element={<Profile infoData={infoData} handleSignOut={handleSignOut}/>}/>
                <Route path='/bicard/:id' element={<VCard/>}/>
                <Route path='/statistical' element={<Statistical handleSignOut={handleSignOut}/>}/>
            </Routes>
        </div>
    );
}

export default App;
