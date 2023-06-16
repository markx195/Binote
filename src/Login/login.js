import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import '../App.css';
import "./login.css"
import ImageSlider from "./imageSlider"

const LoginForm = () => {
    const navigate = useNavigate();
    const slides = [
        {url: "/Images/pic1.png", title: "Pic1"},
        {url: "/Images/pic2.png", title: "pic2"},
        {url: "/Images/pic3.png", title: "pic3"}
    ]
    const containerStyles = {
        width: "100%",
        height: "100%",
        margin: "0 auto",
    };

    function handleLogin() {
        window.location.href = 'https://binote-api.biplus.com.vn/auth/login/google?redirect=https://localhost:3000/';
    }

    function refreshTokens() {
        return fetch('https://binote-api.biplus.com.vn/auth/refresh', {
            method: 'POST',
            credentials: 'include'
        });
    }

    function handleLoginAndRefreshTokens() {
        handleLogin(); // Call handleLogin function
        setTimeout(() => {
            refreshTokens()
                .then(response => response.json())
                .then(data => {
                    const accessToken = data.data.access_token;
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('loggedIn', true);
                    navigate("/HomePage");
                })
                .catch((error) => {
                    console.error('Token refresh failed', error);
                });
        }, 1000); // Adjust the delay time as needed
    }

    return (
        <>
            <div style={containerStyles} className="">
                <ImageSlider slides={slides}/>
                <div className="text-2xl" id="loginText">
                    <span className="font-bold">BiNote</span> nơi bạn có thể lưu giữ những kiến thức của mình
                </div>

                <div className="login-page">
                    <div className="form rounded-2xl">
                        <button onClick={handleLoginAndRefreshTokens} className="flex justify-evenly">
                            <img src="/Images/googleIcon.svg" alt="Google icon"/>
                            <div>Đăng nhập với Google</div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginForm;
