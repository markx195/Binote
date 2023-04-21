import React, {useState, useEffect} from "react";
import jwt_decode from "jwt-decode";
import {useNavigate} from "react-router-dom";
import {Directus} from "@directus/sdk";
import {GoogleLogin} from '@react-oauth/google';
import '../App.css'

const LoginForm = ({onAccessTokenChange}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    {/*const responseMessage = async (response) => {*/
    }
    {/*    try {*/
    }
    {/*        // Authenticate with Directus*/
    }
    {/*        const url = 'http://192.168.3.150:8055/auth/login';*/
    }
    //         const options = {
    //             method: 'POST',
    {/*            headers: {*/
    }
    {/*                'Content-Type': 'application/json'*/
    }
    {/*            },*/
    }
    {/*            body: JSON.stringify({*/
    }
    {/*                email: "thuctv@biplus.com.vn", // Use the email from the Google login response*/
    }
    {/*                password: "12345678", // Set a temporary password for Directus login*/
    }
    {/*            })*/
    }
    //         };
    //         const apiResponse = await fetch(url, options);
    //         const data = await apiResponse.json();
    {/*        const access_token = data.data.access_token*/
    }
    //         onAccessTokenChange(access_token);
    //         // Decode the JWT token from Google login response
    //         const userObject = jwt_decode(response.credential);
    //         setUser(userObject);
    //         document.getElementById("hiddenLogin").hidden = true;
    //         localStorage.setItem("user_info", JSON.stringify(userObject));
    //         navigate("/HomePage");
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

//     return (
//         <div className="backGroundImgLogin">
//             <div className="loginVideo">
//             </div>
//             <div id="hiddenLogin" className="ggLogin">
//                 <GoogleLogin clientId="359374326989-075kko179esh8077viqfshq40mk7f800.apps.googleusercontent.com"
//                              buttonText="Sign in with Google"
//                              onSuccess={responseMessage}
//                              onFailure={(error) => console.log(error)}
//                              cookiePolicy={'single_host_origin'}
//                              icon={false}/>
//             </div>
//         </div>
//     );
// };
    const handleLogin = async () => {
        // Redirect the user to the Google login page
        window.location.href = 'http://onepiecenote.com:8055/auth/login/google?redirect=http://localhost:3000/HomePage';
    };

// Function to extract URL parameters
    const getQueryParam = (param) => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get(param);
    };

// Check if the URL contains an authorization code or access token
    const authorizationCode = getQueryParam('code');
    const accessToken = getQueryParam('access_token');

    if (authorizationCode || accessToken) {
        // Handle the authorization code or access token, e.g., send it to your backend for further processing
        console.log('Authorization code:', authorizationCode);
        console.log('Access token:', accessToken);
    }

    return (
        <div>
            <button onClick={handleLogin}>
                Login
            </button>
        </div>
    );
};

export default LoginForm;

