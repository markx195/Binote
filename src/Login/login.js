import React, {useState} from "react";
import jwt_decode from "jwt-decode";
import {useNavigate} from "react-router-dom";
import {Directus} from "@directus/sdk";
import {GoogleLogin} from '@react-oauth/google';
import '../App.css'

const LoginForm = ({onAccessTokenChange}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const responseMessage = async (response) => {
        try {
            // Authenticate with Directus
            const url = 'http://192.168.3.150:8055/auth/login';
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: "thuctv@biplus.com.vn", // Use the email from the Google login response
                    password: "12345678", // Set a temporary password for Directus login
                })
            };
            const apiResponse = await fetch(url, options);
            const data = await apiResponse.json();
            const access_token = data.data.access_token
            onAccessTokenChange(access_token);
            // Decode the JWT token from Google login response
            const userObject = jwt_decode(response.credential);
            setUser(userObject);
            document.getElementById("hiddenLogin").hidden = true;
            localStorage.setItem("user_info", JSON.stringify(userObject));
            navigate("/HomePage");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="backGroundImgLogin">
            <div className="loginVideo">
            </div>
            <div id="hiddenLogin" className="ggLogin">
                <GoogleLogin onSuccess={responseMessage} icon={false}/>
            </div>
        </div>
    );
};

export default LoginForm;

