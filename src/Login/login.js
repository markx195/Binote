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

//     const [accessToken, setAccessToken] = useState('');
//
//     // Step 2: Redirect to Google login page
//     const handleLogin = () => {
//         window.open('http://onepiecenote.com:8055/auth/login/google', '_blank', 'width=500,height=600');
//     };
//
//     // Step 3: Handle callback from Google
//     const handleCallback = async () => {
//         // Extract authorization code from URL query parameter
//         const urlParams = new URLSearchParams(window.location.search);
//         const authorizationCode = urlParams.get('code');
//
//         // Step 4: Exchange authorization code for access token
//         const response = await fetch('http://onepiecenote.com:8055/auth/login/google', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 code: authorizationCode,
//                 clientId: 'YOUR_CLIENT_ID', // Replace with your client ID
//                 clientSecret: 'YOUR_CLIENT_SECRET' // Replace with your client secret
//             })
//         });
//
//         if (response.ok) {
//             const data = await response.json();
//             const token = data.access_token;
//             setAccessToken(token);
//         } else {
//             console.error('Failed to exchange authorization code for access token');
//         }
//     };
//
//     return (
//         <div>
//             {accessToken ? (
//                 <div>
//                     <p>Access token: {accessToken}</p>
//                     {/* Use the access token to make authenticated API requests */}
//                     {/* Example: <button onClick={fetchDataWithAccessToken}>Fetch Data</button> */}
//                 </div>
//             ) : (
//                 <button onClick={handleLogin}>Login with Google</button>
//             )}
//         </div>
//     );
// };

export default LoginForm
