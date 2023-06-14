import React, {useState, useEffect} from "react";
import HomePage from "../HomePage/homePage";
import "../App.css"
import axios from 'axios';
import {useTranslation} from "react-i18next";
import {Progress, Space} from 'antd';
import EditableText from "../common/EditableText"
import {debounce} from 'lodash';

const noiticeIcon = <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M7.99992 11.8335C8.18881 11.8335 8.34725 11.7695 8.47525 11.6415C8.60325 11.5135 8.66703 11.3553 8.66659 11.1668V8.50016C8.66659 8.31127 8.60259 8.15283 8.47459 8.02483C8.34659 7.89683 8.18836 7.83305 7.99992 7.8335C7.81103 7.8335 7.65259 7.8975 7.52459 8.0255C7.39659 8.1535 7.33281 8.31172 7.33325 8.50016V11.1668C7.33325 11.3557 7.39725 11.5142 7.52525 11.6422C7.65325 11.7702 7.81147 11.8339 7.99992 11.8335ZM7.99992 6.50016C8.18881 6.50016 8.34725 6.43616 8.47525 6.30816C8.60325 6.18016 8.66703 6.02194 8.66659 5.8335C8.66659 5.64461 8.60259 5.48616 8.47459 5.35816C8.34659 5.23016 8.18836 5.16639 7.99992 5.16683C7.81103 5.16683 7.65259 5.23083 7.52459 5.35883C7.39659 5.48683 7.33281 5.64505 7.33325 5.8335C7.33325 6.02239 7.39725 6.18083 7.52525 6.30883C7.65325 6.43683 7.81147 6.50061 7.99992 6.50016ZM7.99992 15.1668C7.0777 15.1668 6.21103 14.9917 5.39992 14.6415C4.58881 14.2913 3.88325 13.8164 3.28325 13.2168C2.68325 12.6168 2.20836 11.9113 1.85859 11.1002C1.50881 10.2891 1.3337 9.42239 1.33325 8.50016C1.33325 7.57794 1.50836 6.71127 1.85859 5.90016C2.20881 5.08905 2.6837 4.3835 3.28325 3.7835C3.88325 3.1835 4.58881 2.70861 5.39992 2.35883C6.21103 2.00905 7.0777 1.83394 7.99992 1.8335C8.92214 1.8335 9.78881 2.00861 10.5999 2.35883C11.411 2.70905 12.1166 3.18394 12.7166 3.7835C13.3166 4.3835 13.7917 5.08905 14.1419 5.90016C14.4921 6.71127 14.667 7.57794 14.6666 8.50016C14.6666 9.42239 14.4915 10.2891 14.1413 11.1002C13.791 11.9113 13.3161 12.6168 12.7166 13.2168C12.1166 13.8168 11.411 14.2919 10.5999 14.6422C9.78881 14.9924 8.92214 15.1673 7.99992 15.1668ZM7.99992 13.8335C9.48881 13.8335 10.7499 13.3168 11.7833 12.2835C12.8166 11.2502 13.3333 9.98905 13.3333 8.50016C13.3333 7.01127 12.8166 5.75016 11.7833 4.71683C10.7499 3.6835 9.48881 3.16683 7.99992 3.16683C6.51103 3.16683 5.24992 3.6835 4.21659 4.71683C3.18325 5.75016 2.66659 7.01127 2.66659 8.50016C2.66659 9.98905 3.18325 11.2502 4.21659 12.2835C5.24992 13.3168 6.51103 13.8335 7.99992 13.8335Z"
        fill="#979696"/>
</svg>

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
                        <div className="tex-[#979696] text-xs pb-2"> {profileDetails?.email}</div>
                        <div
                            className="text-xl font-bold bg-white">
                            {profileDetails && (
                                <EditableText value={profileDetails.first_name} editClassName="form-control"
                                              onChange={handleSaveProfile}/>
                            )}
                        </div>
                        <span className="text-xs pt-2"> {profileDetails?.position} |</span>
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
                                <div className="flex">
                                    <div
                                        className="font-normal text-sm mb-2 text-left pr-1">{t("averageStudyTime")}</div>
                                    {noiticeIcon}
                                </div>
                                <div className="flex items-center" title="Text to show on hover">
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
                                <div className="font-normal text-sm mb-2 text-left">{t("totalStudyTimes")}</div>
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
                        {t("myCourse")}
                    </div>
                </div>
            </div>
        </div>)
}
export default Profile;
