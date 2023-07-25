import React, {useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import '../App.css';
import "./login.css"
import ImageSlider from "./imageSlider"
import {showToast} from "../common/Toast";
import wsRef from '../WebSocket/wsRef';

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

        function refreshTokens() {
            return fetch('https://binote-api.biplus.com.vn/auth/refresh', {
                method: 'POST',
                credentials: 'include'
            });
        }

        function handleLogin() {
            window.location.href = 'https://binote-api.biplus.com.vn/auth/login/google?redirect=https://binote.biplus.com.vn/';
            localStorage.setItem('QA', "logIn");
        }

        useEffect(() => {
            if (localStorage.getItem('QA') !== "logOut") {
                const storedAccessToken = localStorage.getItem('accessToken');

                if (storedAccessToken) {
                    navigate("/home");
                    handleConnect();
                } else {
                    if (localStorage.getItem('QA') === "logIn") {
                        refreshTokens()
                            .then(response => response.json())
                            .then(data => {
                                const accessToken = data.data.access_token;
                                localStorage.setItem('accessToken', accessToken);
                                localStorage.setItem('QA', "active");
                                navigate("/home");
                                handleConnect(accessToken);
                            })
                            .catch((error) => {
                                showToast("Hãy đăng nhập lại với mail Biplus của bạn", "error");
                            });
                    }
                }
            }
        }, []);

        const [socketURL] = useState('ws://192.168.3.150:8055/websocket');

        function handleConnect(accessToken) {
            const url = socketURL + (accessToken ? '?access_token=' + accessToken : '');
            const ws = new WebSocket(url);
            wsRef.current = ws;
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
                            <button onClick={handleLogin} className="flex justify-evenly">
                                <img src="/Images/googleIcon.svg" alt="Google icon"/>
                                <div>Đăng nhập với Google</div>
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
;
export default LoginForm;



