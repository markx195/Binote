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

// const [popupStyle, showPopup] = useState("hide")
//
// const navigate = useNavigate()
//
// function popup() {
    // navigate("/HomePage")
//     showPopup("login-popup")
//     setTimeout(() => showPopup("hide"), 3000)
// }
//
// const onSuccess = e => {
//     alert("User signed in")
//     console.log(e)
// }
//
// const onFailure = e => {
//     alert("User sign in Failed")
//     console.log(e)
// }
//
// return (
//     <div className="cover">
//         <h1>Login</h1>
//         <input type="text" placeholder="username"/>
//         <input type="password" placeholder="password"/>
//
//         <div className="login-btn" onClick={(e) => popup()}>Login</div>
//
//         <p className="text">Or login using</p>
//
//         <div className="alt-login">
//             <div className="google">
//                 <GoogleLogin className="blue"
//                              clientId="297515811745-hltar6an3cp9uc89ku03sk35s8jqa960.apps.googleusercontent.com"
//                              buttonText=""
//                              onSuccess={onSuccess}
//                              onFailure={onFailure}
//                              cookiePolicy={'single_host_origin'}
//                              isSignedIn={false} // alternative is true, which keeps the user signed in
//                              icon={false}    // alt is true, and this puts the google logo on your button, but I don't like it
//                              theme="dark"  // alternative is light, which is white
//                 />
//             </div>
//         </div>
//
//         <div className={popupStyle}>
//             <h3>Login Failed</h3>
//             <p>Username or password incorrect</p>
//         </div>
//
//     </div>
// )
}

export default LoginForm
