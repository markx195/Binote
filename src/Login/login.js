import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import '../App.css';

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the entered email address ends with "@biplus.com.vn"
        if (!email.endsWith("@biplus.com.vn")) {
            setErrorMessage(
                'Please enter a valid email address ending with "@biplus.com.vn"'
            );
            return;
        }

        try {
            // Send a POST request to the API endpoint with email in the request body
            const response = await fetch(
                "http://onepiecenote.com:8055/flows/trigger/a3a5d7b8-e41a-4530-ae33-c55fefc46cff",
                {
                    method: "POST",
                    body: JSON.stringify({email: email}),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                // If the response is successful, parse the JSON response and retrieve the access token
                const data = await response.json();
                const accessToken = data.data.access_token;
                console.log(accessToken)
                // Set the access token in the state and clear the error message
                localStorage.setItem('accessToken', accessToken);
                navigate("/HomePage");
            } else {
                // If the response is not successful, handle the error
                console.error("Failed to login with email:", response);
            }
        } catch (error) {
            console.error("Failed to login with email:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export default LoginForm;
