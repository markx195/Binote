import React, {useState} from "react";
import {GoogleLogin} from '@react-oauth/google';
import jwt_decode from "jwt-decode"
import {useNavigate} from 'react-router-dom'

const LoginForm = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const responseMessage = (response) => {
        var userObject = jwt_decode(response.credential)
        console.log(response.credential)
        console.log(response)
        setUser(userObject)
        document.getElementById("hiddenLogin").hidden = true
        localStorage.setItem('user_info', JSON.stringify(userObject))
        navigate("/HomePage")
    };

    const errorMessage = (error) => {
        console.log(error);
    };

    return (
        <div>
            <h2>React Google Login</h2>
            <br/>
            <br/>
            <div id="hiddenLogin">
                <GoogleLogin onSuccess={responseMessage} icon={false}
                             onError={errorMessage}/>
            </div>
        </div>
    )
}

export default LoginForm
