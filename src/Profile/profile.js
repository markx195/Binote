import React, {useState, useEffect} from "react";
import HomePage from "../HomePage/homePage";
import "../App.css"

const storedAccessToken = localStorage.getItem('accessToken');
const Profile = () => {
    const [profileDetails, setProfileDetails] = useState(null);
    const loadFile = (event) => {
        const image = document.getElementById("output");
        image.src = URL.createObjectURL(event.target.files[0]);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = 'https://binote-api.biplus.com.vn/users/me';

                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${storedAccessToken}`
                    }
                });

                const data = await response.json();
                setProfileDetails(data.data)
                console.log(data.data)
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (<>
        <HomePage/>
        <div className="pt-10 px-[5%] mx-auto flex justify-between items-center">
            {profileDetails && (
                <div className="bg-white rounded-2xl p-4"
                     style={{boxShadow: "0px 0px 8px rgba(51, 51, 51, 0.1)"}}>
                    <div className="flex items-center justify-center">
                        <div className="profile-pic">
                            <label className="-label" htmlFor="file">
                                <span className="glyphicon glyphicon-camera"></span>
                                <span>Change Image</span>
                            </label>
                            <input id="file" type="file" onChange={loadFile}/>
                            <img src={`https://binote-api.biplus.com.vn/assets/${profileDetails?.avatar}`} id="output"
                                 width="500" alt="Profile"/>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2 pl-2 text-left">
                            Name: {profileDetails.email.split("@")[0]}
                        </label>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2 pl-2 text-left">
                            Level: Your level goes here
                        </label>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2 pl-2 text-left">
                            Team: Your team goes here
                        </label>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2 pl-2 text-left">
                            Position: Your position goes here
                        </label>
                    </div>
                </div>
            )}
        </div>
    </>)
}
export default Profile;
