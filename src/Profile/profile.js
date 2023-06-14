import React, {useState, useEffect} from "react";
import HomePage from "../HomePage/homePage";
import "../App.css"
import axios from 'axios';
import {useTranslation} from "react-i18next";
import {Progress, Space} from 'antd';
import EditableText from "../common/EditableText"
import {debounce} from 'lodash';

const Profile = () => {
    const {t} = useTranslation()
    const [profileDetails, setProfileDetails] = useState(null);
    const storedAccessToken = localStorage.getItem('accessToken');

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

    const handleEditProfile = (newValue) => {
        const apiUrl = 'http://192.168.3.150:8055/users/me';

        fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedAccessToken}`
            },
            body: JSON.stringify({first_name: newValue})
        })
            .then(response => response.json())
            .then(data => {
                console.log('Update success:', data);
            })
            .catch(error => {
                console.error('Update failed:', error);
            });
    };

    const handleSaveProfile = debounce(handleEditProfile, 1000);

    return (
        <div className="bg-[#F6F6F6ư]">
            <HomePage/>
            <div className="flex pt-[54px] px-[5%] mx-auto flex justify-between">
                <div className="rounded-2xl p-4 bg-white"
                     style={{boxShadow: '0px 8px 18px rgba(46, 45, 40, 0.08)'}}>
                    <div className="bg-[#F6F6F6] p-4 rounded-2xl"
                         style={{boxShadow: "0px 0px 8px rgba(51, 51, 51, 0.1)"}}>
                        <div className="flex items-center justify-center pb-4">
                            <div className="profile-pic px-[50px] pt-[38px]">
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
                        <div className="tex-[#979696] text-xs"> {profileDetails?.email}</div>
                        <div
                            className="text-xl font-bold py-2 bg-white">
                            {profileDetails && (
                                <EditableText value={profileDetails.first_name} editClassName="form-control"
                                              onChange={handleSaveProfile}/>
                            )}
                        </div>
                        <span className="text-xs"> {profileDetails?.position}</span>
                        |
                        <span className="text-xs">{profileDetails?.team}</span>
                    </div>
                    <div className="pt-11">
                        <Progress percent={99.9} showInfo={false} status="active" size={[300, 20]}
                                  strokeColor={{from: '#F0C528', to: '#87d068'}}/>
                    </div>
                </div>
                <div className="w-full pl-[62px]">
                    <div className="grid gap-[24px] md:grid-cols-3">
                        <div className="max-w-full rounded-2xl overflow-hidden border border-solid shadow-sm flex"
                             style={{boxShadow: '0px 0px 8px rgba(46, 45, 40, 0.1)'}}>
                            <div className="py-6 pl-6 flex-1">
                                <div className="font-normal text-sm mb-2 text-left">{t("averageStudyTime")}</div>
                                <div className="flex items-center">
                                    <p className="text-[40px] font-semibold" style={{marginRight: '10px'}}>
                                        40
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center pr-6">
                                <img src="/Images/Time.svg" alt=""/>
                            </div>
                        </div>

                        <div className="max-w-full rounded-2xl overflow-hidden border border-solid shadow-sm flex"
                             style={{boxShadow: '0px 0px 8px rgba(46, 45, 40, 0.1)'}}>
                            <div className="py-6 pl-6 flex-1">
                                <div className="font-normal text-sm mb-2 text-left">{t("numberOfNote")}</div>
                                <div className="flex items-center">
                                    <p className="text-[40px] font-semibold" style={{marginRight: '10px'}}>
                                        4:03
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center pr-6">
                                <img src="/Images/Notes.svg" alt=""/>
                            </div>
                        </div>

                        <div className="max-w-full overflow-hidden border border-solid rounded-2xl shadow-sm flex"
                             style={{boxShadow: '0px 0px 8px rgba(46, 45, 40, 0.1)'}}>
                            <div className="py-6 pl-6 flex-1">
                                <div className="font-normal text-sm mb-2 text-left">{t("numberOfNote")}</div>
                                <div className="flex items-center">
                                    <p className="text-[40px] font-semibold" style={{marginRight: '10px'}}>
                                        4:03
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center pr-6">
                                <img src="/Images/FullClock.svg" alt=""/>
                            </div>
                        </div>
                    </div>
                    <div className="font-bold text-left pt-[37px] pb-4">
                        {t("currentCourse")}
                    </div>
                </div>
            </div>
        </div>)
}
export default Profile;
