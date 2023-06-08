import React, {useEffect, useState, useRef} from "react"
import {Outlet, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import i18next from "i18next";
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import "./LangSwitch.css"
import DashboardIcon from '@mui/icons-material/Dashboard';

const admin = "7e76a230-8167-42d6-866e-e12c4afd0342"

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

const noteLogo = (<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_57_1627)">
            <path
                d="M11.5428 15.4667H11.0095C11.0093 15.5723 11.0405 15.6756 11.0991 15.7635C11.1577 15.8514 11.241 15.9199 11.3386 15.9603C11.4362 16.0007 11.5436 16.0113 11.6471 15.9907C11.7507 15.97 11.8458 15.919 11.9204 15.8443L11.5428 15.4667ZM11.5428 11.2V10.6667C11.4014 10.6667 11.2657 10.7229 11.1657 10.8229C11.0657 10.9229 11.0095 11.0586 11.0095 11.2H11.5428ZM15.8095 11.2L16.1871 11.5776C16.2619 11.503 16.3128 11.4079 16.3335 11.3043C16.3541 11.2007 16.3436 11.0933 16.3031 10.9958C16.2627 10.8982 16.1942 10.8148 16.1063 10.7562C16.0184 10.6977 15.9151 10.6665 15.8095 10.6667V11.2ZM1.94283 1.06667H14.7428V0H1.94283V1.06667ZM1.4095 14.4V1.6H0.342834V14.4H1.4095ZM15.2762 1.6V10.7584H16.3428V1.6H15.2762ZM11.1012 14.9333H1.94283V16H11.1012V14.9333ZM15.1204 11.136L11.4778 14.7776L12.2319 15.5317L15.8746 11.8891L15.1204 11.136ZM11.1012 16C11.5254 15.9996 11.9321 15.8319 12.2319 15.5317L11.4778 14.7776C11.3778 14.8773 11.2424 14.9333 11.1012 14.9333V16ZM15.2762 10.7584C15.2761 10.8996 15.2201 11.036 15.1204 11.136L15.8746 11.8891C16.1743 11.5891 16.3427 11.1825 16.3428 10.7584H15.2762ZM0.342834 14.4C0.342834 14.8243 0.511405 15.2313 0.811464 15.5314C1.11152 15.8314 1.51849 16 1.94283 16V14.9333C1.80139 14.9333 1.66573 14.8771 1.56571 14.7771C1.46569 14.6771 1.4095 14.5414 1.4095 14.4H0.342834ZM14.7428 1.06667C14.8843 1.06667 15.0199 1.12286 15.12 1.22288C15.22 1.3229 15.2762 1.45855 15.2762 1.6H16.3428C16.3428 1.17565 16.1743 0.768687 15.8742 0.468629C15.5741 0.168571 15.1672 0 14.7428 0V1.06667ZM1.94283 0C1.51849 0 1.11152 0.168571 0.811464 0.468629C0.511405 0.768687 0.342834 1.17565 0.342834 1.6H1.4095C1.4095 1.45855 1.46569 1.3229 1.56571 1.22288C1.66573 1.12286 1.80139 1.06667 1.94283 1.06667V0ZM12.0762 15.4667V11.2H11.0095V15.4667H12.0762ZM11.5428 11.7333H15.8095V10.6667H11.5428V11.7333ZM15.4319 10.8224L11.1652 15.0891L11.9204 15.8443L16.1871 11.5776L15.4319 10.8224ZM3.54283 4.26667H13.1428V3.2H3.54283V4.26667Z"
                fill="#979696"/>
        </g>
        <defs>
            <clipPath id="clip0_57_1627">
                <rect width="16" height="16" fill="white" transform="translate(0.342834)"/>
            </clipPath>
        </defs>
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

    useEffect(() => {
        if (localStorage.getItem("i18nextLng")?.length > 2) {
            i18next.changeLanguage("en");
        }
        if (!storedAccessToken) {
            navigate("/")
        }
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
        navigate(`/vCard/${userId}`);
    }

    const handleBlur = () => {
        setTimeout(() => {
            setShowDropdown(false);
        }, 100);
    };

    const [checked, setChecked] = useState(localStorage.getItem('i18nextLng') === 'en');

    const handleChangeLang = () => {
        const newChecked = !checked;
        setChecked(newChecked);
        const language = newChecked ? 'en' : 'vn';
        localStorage.setItem('i18nextLng', language);
        i18n.changeLanguage(language);
    };
    return (
        <>
            <div className="px-[5%] mx-auto flex justify-between items-center p-4 pt-8">
                <div className="flex items-center cursor-pointer">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl px-2" onClick={handleBackToHomePage}>
                        Bi<span className="font-bold">Note</span>
                    </h1>
                </div>
                {/*Middle*/}
                <div className="bg-[#2F2E2E] hidden lg:flex items-center rounded-2xl p-4 text-[14px]">
                    <div className="flex items-center cursor-pointer" onClick={goToStatistical}>
                        <DashboardIcon sx={{color: '#979696'}}/>
                        <p className="text-[#979696] rounded-full p-2 hover:text-[#F0C528]">
                            Dashboard
                        </p>
                    </div>
                    <p className="w-[22px] border border-solid rotate-90"></p>
                    <div className="flex items-center">
                        <SchoolIcon sx={{color: '#979696'}}/>
                        <p className="text-[#979696] rounded-full p-2 hover:text-[#F0C528]">{t("course")}</p>
                    </div>
                    <p className="w-[22px] border border-solid rotate-90"></p>
                    <div className="flex items-center">
                        {noteLogo}
                        <p className="p-2 text-[#979696] hover:text-[#F0C528]">{t("notes")}</p>
                    </div>
                </div>
                {/*right avatar*/}
                <div className="item-center py-2 cursor-pointer relative w-[200px] z-50">
                    <div className="flex justify-between" onClick={handleDropdownToggle} onBlur={handleBlur}
                         ref={dropdownRef}>
                        {userInfo && (
                            <>
                                <img src={`https://binote-api.biplus.com.vn/assets/${userInfo.avatar}`} alt=""
                                     className="w-[32px] h-[32px] rounded"/>
                                <h3 className="pl-2 inline-flex items-center">
                                    {userInfo.email.split("@")[0]}
                                </h3>
                                <KeyboardArrowDownIcon className="justify-end flex-grow"/>
                            </>
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
                                <PersonIcon/>
                                <span className="pl-2">V-card</span>
                            </div>
                            <div
                                className="flex dropdown-item py-2 px-4 hover:bg-gray-200 cursor-pointer border-b text-left"
                                onClick={handleLogout}>
                                {logoutBtn}
                                <span className="pl-2">{t("signOut")}</span>
                            </div>
                            <div
                                className="flex dropdown-item py-2 px-4 hover:bg-gray-200 cursor-pointer border-b text-left">
                                <span style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginRight: '10px'
                                }}>{t("language")}</span>
                                <div className="flag-switch">
                                    <input type="checkbox" id="check2" checked={checked} onChange={handleChangeLang}/>
                                    <label htmlFor="check2"></label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Outlet/>
        </>
    )
}
export default HomePage
