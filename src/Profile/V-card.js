import React, {useEffect, useState} from 'react';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import {useTranslation} from "react-i18next";
import i18next from "i18next";
import "../App.css"
import "./profile.css"
import {useParams} from 'react-router-dom';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import QRCode from 'qrcode.react';

const enLogo = <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_63_734)">
        <path
            d="M5.50005 15.075V11.625L2.92505 13.525C3.65005 14.2 4.52505 14.725 5.50005 15.075ZM10.5 15.075C11.475 14.725 12.35 14.2 13.075 13.525L10.5 11.6V15.075ZM0.925049 10.5C1.00005 10.75 1.10005 10.975 1.22505 11.225L2.20005 10.5H0.925049ZM13.8 10.5L14.775 11.225C14.875 11 14.975 10.75 15.075 10.5H13.8Z"
            fill="#2A5F9E"/>
        <path
            d="M5.8749 9.5H0.649902C0.724902 9.85 0.824902 10.175 0.924902 10.5H2.1999L1.2249 11.225C1.4249 11.65 1.6499 12.025 1.9249 12.4L4.4999 10.5H5.4999V11L2.5749 13.15L2.9249 13.5L5.4999 11.625V15.075C5.8249 15.2 6.1499 15.275 6.4999 15.35V9.5H5.8749ZM15.3499 9.5H9.4999V15.35C9.8499 15.275 10.1749 15.175 10.4999 15.075V11.625L13.0749 13.5C13.4249 13.175 13.7249 12.825 14.0249 12.45L11.3499 10.5H13.0499L14.5749 11.625C14.6499 11.5 14.7249 11.35 14.7749 11.225L13.7999 10.5H15.0749C15.1749 10.175 15.2749 9.85 15.3499 9.5Z"
            fill="white"/>
        <path
            d="M1.92505 12.4C2.12505 12.675 2.32505 12.925 2.55005 13.175L5.50005 11.025V10.525H4.50005L1.92505 12.4ZM11.375 10.5L14.05 12.45C14.15 12.325 14.225 12.2 14.325 12.075C14.35 12.05 14.35 12.025 14.375 12.025C14.45 11.9 14.55 11.75 14.625 11.625L13.05 10.5H11.375Z"
            fill="#ED4C5C"/>
        <path
            d="M10.5 0.924999V4.375L13.075 2.475C12.35 1.8 11.475 1.275 10.5 0.924999ZM5.50005 0.924999C4.52505 1.275 3.65005 1.8 2.92505 2.475L5.50005 4.4V0.924999ZM15.075 5.5C15 5.25 14.9 5.025 14.775 4.775L13.8 5.5H15.075ZM2.20005 5.5L1.22505 4.775C1.12505 5.025 1.02505 5.25 0.925049 5.5H2.20005Z"
            fill="#2A5F9E"/>
        <path
            d="M10.1249 6.5H15.3249C15.2499 6.15 15.1499 5.825 15.0499 5.5H13.7749L14.7499 4.775C14.5499 4.35 14.3249 3.975 14.0499 3.6L11.4999 5.5H10.4999V5L13.4249 2.85L13.0749 2.5L10.4999 4.375V0.925002C10.1749 0.800002 9.8499 0.725002 9.4999 0.650002V6.5H10.1249ZM0.649902 6.5H6.4999V0.650002C6.1499 0.725002 5.8249 0.825002 5.4999 0.925002V4.375L2.9249 2.5C2.5749 2.825 2.2749 3.175 1.9749 3.55L4.6499 5.5H2.9499L1.4249 4.375C1.3499 4.5 1.2749 4.65 1.2249 4.775L2.1999 5.5H0.924902C0.824902 5.825 0.724902 6.15 0.649902 6.5Z"
            fill="white"/>
        <path
            d="M14.0749 3.6C13.8749 3.325 13.6749 3.075 13.4499 2.825L10.4999 4.975V5.475H11.4999L14.0749 3.6ZM4.6249 5.5L1.9749 3.55C1.8749 3.675 1.7999 3.8 1.6999 3.925C1.6749 3.95 1.6749 3.975 1.6499 3.975C1.5749 4.1 1.4749 4.25 1.3999 4.375L2.9249 5.5H4.6249Z"
            fill="#ED4C5C"/>
        <path
            d="M15.35 6.5H9.5V0.65C9.025 0.55 8.525 0.5 8 0.5C7.475 0.5 6.975 0.55 6.5 0.65V6.5H0.65C0.55 6.975 0.5 7.475 0.5 8C0.5 8.525 0.55 9.025 0.65 9.5H6.5V15.35C6.975 15.45 7.475 15.5 8 15.5C8.525 15.5 9.025 15.45 9.5 15.35V9.5H15.35C15.45 9.025 15.5 8.525 15.5 8C15.5 7.475 15.45 6.975 15.35 6.5Z"
            fill="#ED4C5C"/>
    </g>
    <defs>
        <clipPath id="clip0_63_734">
            <rect width="16" height="16" fill="white"/>
        </clipPath>
    </defs>
</svg>

const vnLogo = <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_63_730)">
        <path
            d="M8 15.5C12.1421 15.5 15.5 12.1421 15.5 8C15.5 3.85786 12.1421 0.5 8 0.5C3.85786 0.5 0.5 3.85786 0.5 8C0.5 12.1421 3.85786 15.5 8 15.5Z"
            fill="#F42F4C"/>
        <path d="M8 9.75L10.475 11.5L9.55 8.65L12 6.8H8.95L8 4L7.075 6.8H4L6.45 8.65L5.525 11.5L8 9.75Z"
              fill="#FFE62E"/>
    </g>
    <defs>
        <clipPath id="clip0_63_730">
            <rect width="16" height="16" fill="white"/>
        </clipPath>
    </defs>
</svg>

const Vcard = () => {
    const {i18n, t} = useTranslation();
    const storedAccessToken = localStorage.getItem('accessToken');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState("Tiếng Việt");
    const [data, setData] = useState([])
    const params = useParams();
    const id = params.id;
    const imgQr = `http://192.168.3.150:90/V-card/${id}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = `http://192.168.3.150:8055/users/${id}`;

                const response = await fetch(apiUrl, {
                    method: 'GET'
                });
                const data = await response.json();
                setData(data.data)
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language);
        i18next.changeLanguage(language);
        handleMenuClose();
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const [showProfileImage, setShowProfileImage] = useState(true);
    const [showQRCode, setShowQRCode] = useState(false);
    return (
        <div className="flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 h-screen">
            <div
                className={`flex flex-col items-center rounded-lg px-4 pb-[45px] shadow-md w-[90%] max-w-[400px] pt-10 ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                <div className="rounded-2xl h-full w-full px-4 flex flex-col items-center justify-center"
                     style={{
                         backgroundImage: `url(${process.env.PUBLIC_URL}/Images/bgvcard.png)`,
                         backgroundSize: '100% auto'
                     }}>
                    <div className="flex justify-between w-full mb-2">
                        <div className="flex pt-4">
                            {isDarkMode ? (<WbSunnyIcon className="bg-[#E3B100] rounded-full"
                                                        onClick={toggleDarkMode}
                                                        style={{color: 'white'}}
                            />) : (<NightlightRoundIcon className="bg-[#8303E8] rounded-full"
                                                        onClick={toggleDarkMode}
                                                        style={{color: 'white'}}
                            />)}
                        </div>
                        <div>
                            <button
                                className="text-white py-2 rounded border-none flex items-center pt-4 px-0"
                                onClick={handleMenuOpen}
                            >
                                <div className="mr-1">
                                    {selectedLanguage === "en" ? "English" : "Tiếng việt"}
                                </div>
                                <div className="flex items-center">
                                    {selectedLanguage === "en" ? enLogo : vnLogo}
                                </div>
                            </button>
                            <Menu
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={() => handleLanguageSelect("vn")}>
                                    <div className="mr-1">Tiếng Việt</div>
                                    {vnLogo}
                                </MenuItem>
                                <MenuItem
                                    onClick={() => handleLanguageSelect("en")}
                                    className="text-[#2B3F6C]"
                                >
                                    <div className="mr-1">English</div>
                                    {enLogo}
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                    {showProfileImage && (<img
                        src="https://binote-api.biplus.com.vn/assets/d8b473c6-d772-427f-90e4-c6c15ef1436e"
                        alt="Profile"
                        className="w-40 h-40 rounded-full mb-2"
                    />)}
                    {showQRCode && (
                        <QRCode
                            className="rounded-lg"
                            value={imgQr}
                            size={168}
                        />
                    )}
                    <div
                        className="font-bold mb-1 pt-4 text-2xl text-white pb-1">{data.last_name} {data.first_name}</div>
                    <div className="text-base text-white">{data.position}</div>
                    {/* Add your slide component here */}
                    <div className="flex justify-center py-[11px]">
                        <div
                            className="w-2 h-2 rounded-full bg-[#FA9A85] mx-1 cursor-pointer"
                            onClick={() => {
                                setShowProfileImage(true);
                                setShowQRCode(false);
                            }}
                        ></div>
                        <div
                            className="w-2 h-2 rounded-full bg-[#FA9A85] mx-1 cursor-pointer"
                            onClick={() => {
                                setShowProfileImage(false);
                                setShowQRCode(true);
                            }}
                        ></div>
                    </div>
                    {/* End your slide component here */}
                    <div className="flex pb-6 w-full">
                        <button
                            className={`w-full text-[#2B3F6C] bg-white px-4 py-2 rounded-r-none border-none flex items-center ${
                                isDarkMode ? 'dark-mode' : 'light-mode'
                            }`}
                            onClick={() => {
                                window.location.href = `tel:${data.phone_number}`;
                            }}
                        >
                            <PhoneIcon className="mr-2"/>
                            <span>{t("call")}</span>
                        </button>
                        <button
                            className={`w-full text-[#2B3F6C] bg-white px-4 py-2 border-none rounded-none flex items-center ${
                                isDarkMode ? 'dark-mode' : 'light-mode'
                            }`}
                        >
                            <EmailIcon className="mr-2"/>
                            <span>Email</span>
                        </button>
                        <button
                            className={`w-full text-[#2B3F6C] bg-white px-4 py-2 rounded-l-none border-none flex items-center ${
                                isDarkMode ? 'dark-mode' : 'light-mode'
                            }`}
                        >
                            <PersonAddAltIcon className="mr-2"/>
                            <span>{t("add")}</span>
                        </button>
                    </div>
                </div>
                <div className="pt-8">
                    <div className="flex items-center pb-4">
                        <PhoneIcon/>
                        <div className="ml-2">
                            <div className="text-left font-semibold">Email</div>
                            <span>{data.email}</span>
                        </div>
                    </div>
                    <div className="flex items-center pb-4">
                        <EmailIcon/>
                        <div className="ml-2">
                            <div className="text-left font-semibold">{t("tell")}</div>
                            <span>{data.phone_number}</span>
                        </div>
                    </div>
                    <div className="flex items-center pb-4">
                        <BusinessIcon/>
                        <div className="ml-2">
                            <div className="text-left font-semibold">{t("company")}</div>
                            <span>Biplus Vietnam Software Solution JSC</span>
                        </div>
                    </div>
                    <div className="flex items-center pb-4">
                        <BusinessCenterIcon/>
                        <div className="ml-2">
                            <div className="text-left font-semibold">{t("department")}</div>
                            <span>{data.department}</span>

                        </div>
                    </div>
                    <div className="flex items-center pb-4">
                        <LocationOnIcon/>
                        <div className="ml-2">
                            <div className="text-left font-semibold">{t("location")}</div>
                            <span>{data.location}</span>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <LanguageIcon/>
                        <div className="ml-2">
                            <div className="text-left font-semibold">Website</div>
                            <span>https://biplus.com.vn/</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
};

export default Vcard;
