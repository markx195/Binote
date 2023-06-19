import React, {useEffect, useState, useRef} from "react"
import {Outlet, useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import i18next from "i18next";
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import "./LangSwitch.css"
import DashboardIcon from '@mui/icons-material/Dashboard';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import {Menu} from 'antd';

const admin = "7e76a230-8167-42d6-866e-e12c4afd0342"

function getItem(label, key, icon, children, type, isActive) {
    return {
        key,
        icon,
        children,
        label,
        type,
        isActive
    };
}

const logoutBtn = (
    <svg width="24" height="24" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M11.6267 10.7466C11.5 10.7466 11.3734 10.7 11.2734 10.6C11.08 10.4066 11.08 10.0866 11.2734 9.89329L12.6267 8.53996L11.2734 7.18663C11.08 6.99329 11.08 6.67329 11.2734 6.47996C11.4667 6.28663 11.7867 6.28663 11.98 6.47996L13.6867 8.18663C13.88 8.37996 13.88 8.69996 13.6867 8.89329L11.98 10.6C11.88 10.7 11.7534 10.7466 11.6267 10.7466Z"
            fill="#1A1E25"/>
        <path
            d="M13.2867 9.04004H6.50665C6.23332 9.04004 6.00665 8.81337 6.00665 8.54004C6.00665 8.26671 6.23332 8.04004 6.50665 8.04004H13.2867C13.56 8.04004 13.7867 8.26671 13.7867 8.54004C13.7867 8.81337 13.56 9.04004 13.2867 9.04004Z"
            fill="#1A1E25"/>
        <path
            d="M7.83999 14.3333C4.40665 14.3333 2.00665 11.9333 2.00665 8.49996C2.00665 5.06663 4.40665 2.66663 7.83999 2.66663C8.11332 2.66663 8.33999 2.89329 8.33999 3.16663C8.33999 3.43996 8.11332 3.66663 7.83999 3.66663C4.99332 3.66663 3.00665 5.65329 3.00665 8.49996C3.00665 11.3466 4.99332 13.3333 7.83999 13.3333C8.11332 13.3333 8.33999 13.56 8.33999 13.8333C8.33999 14.1066 8.11332 14.3333 7.83999 14.3333Z"
            fill="#1A1E25"/>
    </svg>
)

const HomePage = (props) => {
    const [permission, setPermission] = useState("")
    const {i18n, t} = useTranslation();
    const [userInfo, setUserInfo] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const storedAccessToken = localStorage.getItem('accessToken');
    const dropdownRef = useRef(null);
    const [userId, setUserId] = useState("")
    const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('i18nextLng') || 'vn');
    const items = [
        getItem(useTranslation().t("language"), 'sub2', null, [
            getItem("Tiếng việt", 'vn', <img src="/Images/vnLogo.svg" alt="vn"/>),
            getItem('English', 'en', <img src="/Images/engLogo.svg" alt="en"/>),
        ]),];

    useEffect(() => {
        if (!localStorage.getItem("i18nextLng")) {
            localStorage.setItem('i18nextLng', 'en');
        } else {
            setSelectedLanguage(localStorage.getItem('i18nextLng'));
        }
        if (!storedAccessToken) {
            navigate("/")
        }
        const fetchData = async () => {
            try {
                const apiUrl = 'http://192.168.3.150:8050/users/me';

                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${storedAccessToken}`
                    }
                });

                const data = await response.json();
                const userID = data.data.id
                setUserId(userID)
                setPermission(data.data.role)
                setUserInfo(data.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleBackToHomePage = () => {
        navigate("/HomePage");
    };

    const goToStatistical = () => {
        navigate("/Statistical");
    }

    const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogout = () => {
        props.handleSignOut();
    };

    const handleProfile = () => {
        navigate("/Profile");
    }

    const handleVcard = () => {
        navigate(`/bicard/${userId}`);
    }

    const handleBlur = () => {
        setTimeout(() => {
            setShowDropdown(false);
        }, 100);
    };

    const handleLanguage = (e) => {
        setSelectedLanguage(e.key);
        localStorage.setItem('i18nextLng', e.key);
        i18next.changeLanguage(e.key);
    }

    console.log(window.location.pathname)

    return (
        <>
            <div className="px-[5%] mx-auto flex justify-between items-center p-4 pt-8 bg-[#F5F5F5]">
                <div className="flex items-center cursor-pointer">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl px-2" onClick={handleBackToHomePage}>
                        Bi<span className="font-bold">Note</span>
                    </h1>
                </div>
                {/*Middle*/}
                <div className="bg-[#2F2E2E] hidden lg:flex items-center rounded-2xl p-4 text-[14px]">
                    <div
                        className={`flex items-center cursor-pointer ${window.location.pathname === '/Statistical' ? 'text-[#F0C528]' : ''}`}
                        onClick={goToStatistical}>
                        <DashboardIcon
                            sx={{color: window.location.pathname === '/Statistical' ? '#F0C528' : '#979696'}}/>
                        <p
                            className={`text-[#979696] rounded-full p-2 hover:text-[#F0C528] ${
                                window.location.pathname === '/Statistical' ? 'text-[#F0C528]' : ''
                            }`}
                        >
                            Dashboard
                        </p>
                    </div>
                    <p className="w-[22px] border border-solid rotate-90"></p>
                    <div
                        className={`flex items-center cursor-pointer ${window.location.pathname === '/HomePage' ? 'text-[#F0C528]' : ''}`}
                        onClick={handleBackToHomePage}>
                        <SchoolIcon sx={{color: window.location.pathname === '/HomePage' ? '#F0C528' : '#979696'}}/>
                        <p
                            className={`text-[#979696] rounded-full p-2 hover:text-[#F0C528] ${
                                window.location.pathname === '/HomePage' ? 'text-[#F0C528]' : ''
                            }`}
                        >
                            {t("course")}
                        </p>
                    </div>
                </div>
                {/*right avatar*/}
                <div className="item-center py-2 cursor-pointer relative w-[200px] z-50">
                    <div className="flex float-right" onClick={handleDropdownToggle} onBlur={handleBlur}
                         ref={dropdownRef}>
                        {userInfo && (
                            <div className="flex items-center">
                                <img src={`http://192.168.3.150:8050/assets/${userInfo.avatar}`} alt=""
                                     className="w-[32px] h-[32px] rounded"/>
                                <h3 className="pl-2 inline-flex items-center">
                                    {userInfo.first_name}
                                </h3>
                                <div className="ml-auto">
                                    <KeyboardArrowDownIcon className=""/>
                                </div>
                            </div>
                        )}
                    </div>
                    {showDropdown && (
                        <div className="dropdown-menu absolute bg-white rounded shadow-lg mt-2 w-[200px]">
                            <div className="dropdown-item py-2 px-4 hover:bg-gray-200 cursor-pointer text-left"
                                 onClick={handleProfile}>
                                <PersonIcon/>
                                <span className="pl-2">{t("profile")}</span>
                            </div>
                            <div className="dropdown-item py-2 px-4 hover:bg-gray-200 cursor-pointer text-left"
                                 onClick={handleVcard}>
                                <ContactMailIcon/>
                                <span className="pl-2">BiCard</span>
                            </div>
                            <div
                                className="flex dropdown-item py-2 px-4 hover:bg-gray-200 cursor-pointer border-b text-left"
                                onClick={handleLogout}>
                                {logoutBtn}
                                <span className="pl-2">{t("signOut")}</span>
                            </div>
                            <Menu onClick={handleLanguage} style={{width: 201}} mode="vertical" items={items}/>
                        </div>
                    )}
                </div>
            </div>
            <Outlet/>
        </>
    )
}
export default HomePage
