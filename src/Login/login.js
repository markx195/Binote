import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import '../App.css';
import "./login.css"
import ImageSlider from "./imageSlider"

const LoginForm = () => {
    const [token, setToken] = useState("");
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

    async function refreshTokens() {
        try {
            const response = await fetch('https://binote-api.biplus.com.vn/auth/refresh', {
                method: 'POST',
                credentials: 'include'
            });

            const data = await response.json();
            setToken(data.data.access_token);

            if (token) {
                navigate('/HomePage');
            }
        } catch (error) {
            console.error('Token refresh failed', error);
        }
    }

// Check if the user has been redirected back from Google login
    const urlParams = new URLSearchParams(window.location.search);
    const reason = urlParams.get('reason');

    if (reason !== 'INVALID_PROVIDER') {
        refreshTokens();
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
                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="Nhập Gmail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button type="submit">Login</button>
                        </form>
                        {errorMessage && <p>{errorMessage}</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginForm;
