import React, {useEffect, useState} from 'react';
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
import Slider from 'infinite-react-carousel';

const settings = {
    arrows: false, arrowsBlock: false, wheel: true, dots: true, duration: 300
};
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
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState("Tiếng Việt");
    const [data, setData] = useState({})
    const params = useParams();
    const id = params.id;
    const imgQr = `http://192.168.3.150:90/bicard/${id}`;

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

    const moonLogo = <svg onClick={toggleDarkMode} width="24" height="24" viewBox="0 0 24 24" fill="none"
                          xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#E3B100"/>
        <g clip-path="url(#clip0_63_676)">
            <path
                d="M19.3333 11.3333H16.6133C16.5614 10.966 16.4654 10.6063 16.3273 10.262L18.6787 8.89933C18.7573 8.85704 18.8265 8.79941 18.8824 8.72984C18.9383 8.66027 18.9797 8.58019 19.0041 8.49435C19.0284 8.4085 19.0353 8.31863 19.0243 8.23007C19.0133 8.14151 18.9846 8.05606 18.94 7.97879C18.8954 7.90152 18.8357 7.83399 18.7644 7.78022C18.6932 7.72645 18.6119 7.68752 18.5254 7.66575C18.4388 7.64398 18.3488 7.63981 18.2606 7.65348C18.1724 7.66715 18.0879 7.69838 18.012 7.74533L15.6587 9.11C15.4337 8.82581 15.1767 8.56855 14.8927 8.34333L16.2567 5.98933C16.3388 5.8367 16.3583 5.65808 16.3109 5.49134C16.2636 5.3246 16.1532 5.18285 16.0031 5.09615C15.853 5.00944 15.6751 4.9846 15.507 5.02689C15.3389 5.06918 15.1939 5.17527 15.1027 5.32267L13.738 7.67267C13.3937 7.53448 13.034 7.43845 12.6667 7.38667V4.66667C12.6667 4.48986 12.5964 4.32029 12.4714 4.19526C12.3464 4.07024 12.1768 4 12 4C11.8232 4 11.6536 4.07024 11.5286 4.19526C11.4036 4.32029 11.3333 4.48986 11.3333 4.66667V7.38667C10.966 7.43845 10.6063 7.53448 10.262 7.67267L8.89933 5.32133C8.80814 5.17393 8.66313 5.06784 8.49504 5.02556C8.32694 4.98327 8.14899 5.00811 7.99891 5.09482C7.84882 5.18152 7.73841 5.32327 7.69107 5.49001C7.64373 5.65675 7.6632 5.83537 7.74533 5.988L9.10933 8.34333C8.82534 8.56855 8.5683 8.82581 8.34333 9.11L5.99 7.74533C5.91411 7.69838 5.82956 7.66715 5.74138 7.65348C5.65319 7.63981 5.56316 7.64398 5.47661 7.66575C5.39007 7.68752 5.30878 7.72645 5.23755 7.78022C5.16633 7.83399 5.10663 7.90152 5.06199 7.97879C5.01735 8.05606 4.98868 8.14151 4.97768 8.23007C4.96667 8.31863 4.97356 8.4085 4.99793 8.49435C5.0223 8.58019 5.06366 8.66027 5.11956 8.72984C5.17546 8.79941 5.24475 8.85704 5.32333 8.89933L7.67267 10.262C7.53463 10.6063 7.43861 10.966 7.38667 11.3333H4.66667C4.48986 11.3333 4.32029 11.4036 4.19526 11.5286C4.07024 11.6536 4 11.8232 4 12C4 12.1768 4.07024 12.3464 4.19526 12.4714C4.32029 12.5964 4.48986 12.6667 4.66667 12.6667H7.38667C7.43861 13.034 7.53463 13.3937 7.67267 13.738L5.32133 15.1007C5.24275 15.143 5.17346 15.2006 5.11756 15.2702C5.06166 15.3397 5.0203 15.4198 4.99593 15.5057C4.97156 15.5915 4.96467 15.6814 4.97568 15.7699C4.98668 15.8585 5.01535 15.9439 5.05999 16.0212C5.10463 16.0985 5.16433 16.166 5.23555 16.2198C5.30678 16.2736 5.38807 16.3125 5.47461 16.3342C5.56116 16.356 5.65119 16.3602 5.73938 16.3465C5.82756 16.3329 5.91211 16.3016 5.988 16.2547L8.34133 14.89C8.5663 15.1742 8.82334 15.4314 9.10733 15.6567L7.74533 18.0107C7.6632 18.1633 7.64373 18.3419 7.69107 18.5087C7.73841 18.6754 7.84882 18.8171 7.99891 18.9039C8.14899 18.9906 8.32694 19.0154 8.49504 18.9731C8.66313 18.9308 8.80814 18.8247 8.89933 18.6773L10.262 16.326C10.6063 16.4644 10.966 16.5608 11.3333 16.6133V19.3333C11.3333 19.5101 11.4036 19.6797 11.5286 19.8047C11.6536 19.9298 11.8232 20 12 20C12.1768 20 12.3464 19.9298 12.4714 19.8047C12.5964 19.6797 12.6667 19.5101 12.6667 19.3333V16.6133C13.0339 16.5612 13.3936 16.4652 13.738 16.3273L15.1007 18.6787C15.1919 18.8261 15.3369 18.9322 15.505 18.9744C15.6731 19.0167 15.851 18.9919 16.0011 18.9052C16.1512 18.8185 16.2616 18.6767 16.3089 18.51C16.3563 18.3433 16.3368 18.1646 16.2547 18.012L14.8907 15.658C15.1747 15.4328 15.4317 15.1755 15.6567 14.8913L18.01 16.256C18.0859 16.303 18.1704 16.3342 18.2586 16.3479C18.3468 16.3615 18.4368 16.3574 18.5234 16.3356C18.6099 16.3138 18.6912 16.2749 18.7624 16.2211C18.8337 16.1673 18.8934 16.0998 18.938 16.0225C18.9826 15.9453 19.0113 15.8598 19.0223 15.7713C19.0333 15.6827 19.0264 15.5928 19.0021 15.507C18.9777 15.4211 18.9363 15.3411 18.8804 15.2715C18.8245 15.2019 18.7553 15.1443 18.6767 15.102L16.3253 13.7393C16.4642 13.3947 16.5609 13.0345 16.6133 12.6667H19.3333C19.5101 12.6667 19.6797 12.5964 19.8047 12.4714C19.9298 12.3464 20 12.1768 20 12C20 11.8232 19.9298 11.6536 19.8047 11.5286C19.6797 11.4036 19.5101 11.3333 19.3333 11.3333ZM12 15.3333C7.59467 15.1933 7.596 8.806 12 8.66667C16.4053 8.80667 16.404 15.194 12 15.3333Z"
                fill="white"/>
        </g>
        <defs>
            <clipPath id="clip0_63_676">
                <rect width="16" height="16" fill="white" transform="translate(4 4)"/>
            </clipPath>
        </defs>
    </svg>

    const sunLogo = <svg onClick={toggleDarkMode} width="24" height="24" viewBox="0 0 24 24" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#8303E8"/>
        <g clip-clipPath="url(#clip0_63_602)">
            <path
                d="M13.9999 19.9999C12.8795 19.999 11.7718 19.7633 10.7482 19.3079C9.72463 18.8524 8.8079 18.1875 8.05719 17.3559C7.30081 16.5233 6.73013 15.5394 6.38302 14.4694C6.03591 13.3994 5.9203 12.2679 6.04386 11.1499C6.24306 9.40986 7.00212 7.78168 8.20677 6.51042C9.41141 5.23917 10.9964 4.39366 12.7232 4.10119C13.8395 3.92877 14.9786 3.97519 16.0772 4.23785C16.3648 4.31176 16.6275 4.46119 16.8381 4.67068C17.0486 4.88017 17.1993 5.14212 17.2746 5.4294C17.35 5.71669 17.3471 6.01889 17.2665 6.30473C17.1858 6.59056 17.0302 6.84965 16.8159 7.05519C13.7759 9.83252 14.0399 14.1512 17.3539 16.6619C17.5882 16.8458 17.7689 17.0891 17.8773 17.3666C17.9857 17.644 18.0177 17.9455 17.9701 18.2395C17.9224 18.5335 17.7968 18.8094 17.6064 19.0385C17.4159 19.2675 17.1676 19.4413 16.8872 19.5419C15.9551 19.8464 14.9805 20.001 13.9999 19.9999ZM14.0505 5.33319C13.6762 5.33229 13.3024 5.3606 12.9325 5.41785C11.4949 5.661 10.1751 6.36455 9.17187 7.42261C8.16863 8.48067 7.53623 9.83598 7.36986 11.2845C7.26586 12.2179 7.3617 13.1627 7.65102 14.0562C7.94033 14.9496 8.4165 15.7713 9.04786 16.4665C9.97208 17.453 11.1627 18.15 12.4753 18.4731C13.7879 18.7961 15.166 18.7313 16.4425 18.2865C16.4976 18.2659 16.5461 18.2311 16.5834 18.1857C16.6206 18.1402 16.6452 18.0857 16.6546 18.0277C16.664 17.9697 16.6579 17.9103 16.637 17.8554C16.616 17.8005 16.5809 17.7521 16.5352 17.7152C12.5825 14.7299 12.2685 9.39119 15.9032 6.08252C15.9449 6.0438 15.975 5.99421 15.9901 5.93933C16.0051 5.88445 16.0046 5.82645 15.9885 5.77185C15.9747 5.71391 15.9452 5.66086 15.9034 5.61844C15.8616 5.57602 15.8089 5.54585 15.7512 5.53119C15.1944 5.39687 14.6233 5.33039 14.0505 5.33319Z"
                fill="white"/>
        </g>
        <defs>
            <clipPath id="clip0_63_602">
                <rect width="16" height="16" fill="white" transform="translate(4 4)"/>
            </clipPath>
        </defs>
    </svg>

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
        };

        handleResize(); // Check on initial render

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (<>
        {!isMobile && (<div
            className="flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 h-screen font-nunito">
            <div
                className={`flex flex-col items-center rounded-lg px-4 pb-[45px] shadow-md w-[90%] max-w-[400px] pt-10 ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                <div className="rounded-2xl h-full w-full px-4 flex flex-col items-center justify-center"
                     style={{
                         backgroundImage: `url(${process.env.PUBLIC_URL}/Images/bgvcard.png)`,
                         backgroundSize: 'cover'
                     }}>
                    <div className="flex justify-between w-full mb-2">
                        <div className="flex pt-4">
                            {isDarkMode ? (sunLogo) : (moonLogo)}
                        </div>
                        <div>
                            <button
                                className="text-white py-2 rounded border-none flex items-center py-4 px-0 exclude-button"
                                onClick={handleMenuOpen}
                            >
                                <div className="mr-1">
                                    {selectedLanguage === "en" ? "English" : "Tiếng Việt"}
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
                    <div className="w-full h-full">
                        {data.first_name && <Slider {...settings}>
                            <div className="slider-item">
                                <div className="image-container">
                                    <div className="table relative">
                                        <img
                                            src={`https://binote-api.biplus.com.vn/assets/${data.avatar}`}
                                            alt="Profile"
                                            className="w-full h-auto rounded-full border-4 border-grey"
                                        />
                                        <img src="/Images/Bilogo.svg" alt="" style={{width: "52px", height: "52px"}}
                                             className="absolute bottom-0 right-0"/>
                                    </div>
                                </div>
                                <div className="text-container">
                                    <div className="font-bold mb-1 pt-4 text-2xl text-white pb-1">
                                        {data.last_name} {data.first_name}
                                    </div>
                                    <div className="text-base text-white">{data.position}</div>
                                </div>
                            </div>
                            <div className="slider-item">
                                <div className="image-container">
                                    <div className="border-8 border-white rounded-lg">
                                        <QRCode value={imgQr} size={152} className="qr-code"/>
                                    </div>
                                </div>
                                <div className="text-container">
                                    <div className="font-bold mb-1 pt-4 text-2xl text-white pb-1">BiCard QR Code</div>
                                </div>
                            </div>
                        </Slider>}
                    </div>
                    {/* End your slide component here */}
                    <div className="flex pb-6 w-full">
                        <button
                            className={`w-full text-[#2B3F6C] bg-white px-4 py-2 rounded-r-none border-none custom-button flex items-center ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
                            onClick={() => {
                                window.location.href = `tel:${data.phone_number}`;
                            }}
                        >
                            <PhoneIcon className="mr-2"/>
                            <span>{t("call")}</span>
                        </button>
                        <button
                            className={`w-full text-[#2B3F6C] bg-white px-4 py-2 border-none rounded-none custom-button flex items-center ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
                        >
                            <EmailIcon className="mr-2"/>
                            <a href="mailto:${data.email}">Email</a>
                        </button>
                        <button
                            className={`w-full text-[#2B3F6C] bg-white px-4 py-2 rounded-l-none border-none custom-button flex items-center ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
                        >
                            <PersonAddAltIcon className="mr-2"/>
                            <span>{t("add")}</span>
                        </button>
                    </div>
                </div>
                {/*Info*/}
                <div className="pt-8 px-6">
                    <div className="flex items-center pb-4">
                        <PhoneIcon/>
                        <div className="ml-2">
                            <div className="text-left font-semibold">Email</div>
                            <div className="break-all">{data.email}</div>
                        </div>
                    </div>
                    <div className="flex items-center pb-4">
                        <EmailIcon/>
                        <div className="ml-2">
                            <div className="text-left font-semibold">{t("tell")}</div>
                            <div>{data.phone_number}</div>
                        </div>
                    </div>
                    <div className="flex items-center pb-4">
                        <BusinessIcon/>
                        <div className="ml-2">
                            <div className="text-left font-semibold">{t("company")}</div>
                            <div>Biplus Vietnam Software Solution JSC</div>
                        </div>
                    </div>
                    <div className="flex items-center pb-4">
                        <BusinessCenterIcon/>
                        <div className="ml-2">
                            <div className="text-left font-semibold">{t("department")}</div>
                            <div className="text-left">{data.department}</div>
                        </div>
                    </div>
                    <div className="flex items-center pb-4">
                        <LocationOnIcon/>
                        <div className="ml-2">
                            <div className="text-left font-semibold">{t("location")}</div>
                            <div className="text-left line-clamp-2">{data.location}</div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <LanguageIcon/>
                        <div className="ml-2">
                            <div className="text-left font-semibold">Website</div>
                            <a href="https://biplus.com.vn">https://biplus.com.vn/</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>)}
        {/*mobile display*/}
        {isMobile && (<div
            className={`flex flex-col items-center rounded-lg px-4 pb-[45px] shadow-md pt-10 ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="rounded-2xl h-full w-full px-4 flex flex-col items-center justify-center"
                 style={{
                     backgroundImage: `url(${process.env.PUBLIC_URL}/Images/bgvcard.png)`, backgroundSize: 'cover'
                 }}>
                <div className="flex justify-between w-full mb-2">
                    <div className="flex pt-4">
                        {isDarkMode ? (sunLogo) : (moonLogo)}
                    </div>
                    <div>
                        <button
                            className="text-white py-2 rounded border-none flex items-center py-4 px-0"
                            onClick={handleMenuOpen}
                        >
                            <div className="mr-1">
                                {selectedLanguage === "en" ? "English" : "Tiếng Việt"}
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
                {/* Start your slide component here */}
                <div className="w-full h-full">
                    {data.first_name && <Slider {...settings}>
                        <div className="slider-item">
                            <div className="image-container">
                                <div className="table relative">
                                    <img
                                        src={`https://binote-api.biplus.com.vn/assets/${data.avatar}`}
                                        alt="Profile"
                                        className="w-full h-auto rounded-full border-4 border-grey"
                                    />
                                    <img src="/Images/Bilogo.svg" alt="" style={{width: "52px", height: "52px"}}
                                         className="absolute bottom-0 right-0"/>
                                </div>
                            </div>
                            <div className="text-container">
                                <div className="font-bold mb-1 pt-4 text-2xl text-white pb-1">
                                    {data.last_name} {data.first_name}
                                </div>
                                <div className="text-base text-white">{data.position}</div>
                            </div>
                        </div>
                        <div className="slider-item">
                            <div className="image-container">
                                <div className="border-8 border-white rounded-lg">
                                    <QRCode value={imgQr} size={152} className="qr-code"/>
                                </div>
                            </div>
                            <div className="text-container">
                                <div className="font-bold mb-1 pt-4 text-2xl text-white pb-1">BiCard QR Code</div>
                            </div>
                        </div>
                    </Slider>}
                </div>
                {/* End your slide component here */}
                <div className="flex pb-6 w-full">
                    <button
                        className={`w-full text-[#2B3F6C] bg-white px-4 py-2 custom-button rounded-r-none border-none flex items-center ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
                        onClick={() => {
                            window.location.href = `tel:${data.phone_number}`;
                        }}
                    >
                        <PhoneIcon className="mr-2"/>
                        <span>{t("call")}</span>
                    </button>
                    <button
                        className={`w-full text-[#2B3F6C] bg-white px-4 py-2 custom-button border-none rounded-none flex items-center ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
                    >
                        <EmailIcon className="mr-2"/>
                        <a href="mailto:${data.email}">Email</a>
                    </button>
                    <button
                        className={`w-full text-[#2B3F6C] bg-white px-4 py-2 custom-button rounded-l-none border-none flex items-center ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
                    >
                        <PersonAddAltIcon className="mr-2"/>
                        <span>{t("add")}</span>
                    </button>
                </div>
            </div>
            {/*Info*/}
            <div className="pt-8 px-6">
                <div className="flex items-center pb-4">
                    <PhoneIcon/>
                    <div className="ml-2">
                        <div className="text-left font-semibold">Email</div>
                        <div className="break-all">{data.email}</div>
                    </div>
                </div>
                <div className="flex items-center pb-4">
                    <EmailIcon/>
                    <div className="ml-2">
                        <div className="text-left font-semibold">{t("tell")}</div>
                        <div>{data.phone_number}</div>
                    </div>
                </div>
                <div className="flex items-center pb-4">
                    <BusinessIcon/>
                    <div className="ml-2">
                        <div className="text-left font-semibold">{t("company")}</div>
                        <div>Biplus Vietnam Software Solution JSC</div>
                    </div>
                </div>
                <div className="flex items-center pb-4">
                    <BusinessCenterIcon/>
                    <div className="ml-2">
                        <div className="text-left font-semibold">{t("department")}</div>
                        <div className="text-left">{data.department}</div>
                    </div>
                </div>
                <div className="flex items-center pb-4">
                    <LocationOnIcon/>
                    <div className="ml-2">
                        <div className="text-left font-semibold">{t("location")}</div>
                        <div className="text-left line-clamp-2">{data.location}</div>
                    </div>
                </div>
                <div className="flex items-center">
                    <LanguageIcon/>
                    <div className="ml-2">
                        <div className="text-left font-semibold">Website</div>
                        <a href="https://biplus.com.vn">https://biplus.com.vn/</a>
                    </div>
                </div>
            </div>
        </div>)}
    </>);
};

export default Vcard;
