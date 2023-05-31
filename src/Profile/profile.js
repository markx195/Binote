import React, {useState, useEffect} from "react";
import HomePage from "../HomePage/homePage";
import "../App.css"
import axios from 'axios';

const Profile = () => {
    const [profileDetails, setProfileDetails] = useState(null);
    const storedAccessToken = localStorage.getItem('accessToken');
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [level, setLevel] = useState('');
    const [team, setTeam] = useState('');
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (storedAccessToken) {
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
                    setProfileDetails(data.data);
                    setLevel(data.data.level)
                    setName(data.data.name)
                    // setPosition(data.data.position)
                    // setTeam(data.data.team)
                    console.log(data.data);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchData();
        }
    }, [storedAccessToken]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        // Create a form data object to send the file
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://192.168.3.150:8055/files', formData, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${storedAccessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            const imageUrl = response.data.data.id;
            const updateResponse = await axios.patch('http://192.168.3.150:8055/users/me', {
                avatar: imageUrl,
            }, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${storedAccessToken}`,
                    "Content-Type": "application/json",
                },
            });
            if (updateResponse.status === 200) {
                const updatedProfileDetails = {...profileDetails, avatar: imageUrl};
                setProfileDetails(updatedProfileDetails);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (<>
        <HomePage/>
        <div className="pt-10 px-[5%] mx-auto flex justify-between items-center">
            <div className="bg-white rounded-2xl p-4"
                 style={{boxShadow: "0px 0px 8px rgba(51, 51, 51, 0.1)"}}>
                <div className="flex items-center justify-center">
                    <div className="profile-pic">
                        <label className="-label" htmlFor="file">
                            <span className="glyphicon glyphicon-camera"></span>
                            <span>Change Image</span>
                        </label>
                        <input id="file" type="file" onChange={handleFileUpload}/>
                        {profileDetails && (
                            <img
                                src={`https://binote-api.biplus.com.vn/assets/${profileDetails?.avatar}`}
                                id="output"
                                width="500"
                                alt="Profile"
                            />
                        )}
                    </div>
                </div>
                {/*///////// Profile Details*/}
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setEditMode(!editMode)}
                    >
                        {editMode ? 'Save' : 'Edit'}
                    </button>
                    <div className="mt-4">
                        {editMode ? (
                            <input
                                placeholder="Enter your name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full px-2 py-1 rounded border border-gray-400"
                            />
                        ) : (
                            <label className="block text-gray-700 text-sm font-bold mb-2 pl-2 text-left">
                                Name: {name}
                            </label>
                        )}
                    </div>
                    <div className="mt-4">
                        {editMode ? (
                            <input
                                placeholder="Enter your level"
                                type="text"
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                className="block w-full px-2 py-1 rounded border border-gray-400"
                            />
                        ) : (
                            <label className="block text-gray-700 text-sm font-bold mb-2 pl-2 text-left">
                                Level: {level}
                            </label>
                        )}
                    </div>
                    <div className="mt-4">
                        {editMode ? (
                            <input
                                type="text"
                                placeholder="Enter your team"
                                value={team}
                                onChange={(e) => setLevel(e.target.value)}
                                className="block w-full px-2 py-1 rounded border border-gray-400"
                            />
                        ) : (
                            <label className="block text-gray-700 text-sm font-bold mb-2 pl-2 text-left">
                                Team: {team}
                            </label>
                        )}
                    </div>
                    <div className="mt-4">
                        {editMode ? (
                            <input
                                placeholder="Enter your position"
                                type="text"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                className="block w-full px-2 py-1 rounded border border-gray-400"
                            />
                        ) : (
                            <label className="block text-gray-700 text-sm font-bold mb-2 pl-2 text-left">
                                Position: {position}
                            </label>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </>)
}
export default Profile;
