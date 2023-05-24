import React, {useEffect, useState, useRef} from "react"
import {Outlet, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import i18next from "i18next";

const HomePage = ({handleSignOut}) => {
    const {i18n, t} = useTranslation();
    const [userInfo, setUserInfo] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const storedAccessToken = localStorage.getItem('accessToken');
    const dropdownRef = useRef(null);

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
                setUserInfo(data.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleBackToHomePage = () => {
        navigate("/HomePage"); // Use the appropriate route path here
    };

    const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogout = () => {
        // localStorage.removeItem("accessToken")
        // localStorage.removeItem("loggedIn")
        // navigate("/")
        handleSignOut();
    };

    const handleChangeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    const handleBlur = () => {
        setTimeout(() => {
            setShowDropdown(false);
        }, 100);
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
                    <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12.8119 9.21386C12.8119 9.03515 12.8119 8.8722 12.8119 8.70926C12.8119 8.49375 12.7427 8.31504 12.5883 8.16261C11.6141 7.20072 10.6453 6.23883 9.6711 5.28219C9.39429 5.00887 9.00036 5.00361 8.74484 5.25591C8.48932 5.51347 8.49464 5.89717 8.77146 6.1705C9.64981 7.04303 10.5282 7.90506 11.4012 8.78285C11.4757 8.85644 11.5236 8.98258 11.529 9.08771C11.5502 9.3295 11.5396 9.57128 11.5343 9.81833C11.5343 9.87089 11.513 9.94973 11.4757 9.97076C10.9487 10.2336 10.4377 10.5437 9.88936 10.7277C9.18135 10.9589 8.47335 10.8275 7.81325 10.4701C5.87023 9.40308 3.92188 8.34132 1.97886 7.27956C1.59025 7.06931 1.19633 6.85906 0.813045 6.64356C0.339267 6.36498 0.0571289 5.97076 0.0571289 5.41885C0.0571289 4.87746 0.32862 4.47799 0.797075 4.22043C3.16597 2.92214 5.52953 1.61859 7.90375 0.336067C8.74484 -0.115969 9.63916 -0.115969 10.4803 0.336067C12.8545 1.61859 15.2234 2.91688 17.5869 4.22043C18.5824 4.77234 18.593 6.0496 17.5976 6.60676C16.0432 7.4793 14.4781 8.3203 12.913 9.17181C12.8917 9.19283 12.8598 9.19809 12.8119 9.21386Z"
                            fill="#F0C528"/>
                        <path
                            d="M11.5609 14.3022C11.4811 14.3075 11.4012 14.318 11.3214 14.318C9.50078 14.318 7.6802 14.318 5.86493 14.318C4.19872 14.318 2.89983 13.23 2.63366 11.6058C2.60704 11.4586 2.60704 11.3062 2.60704 11.1537C2.60172 10.3601 2.60704 9.56636 2.60704 8.76741C2.60704 8.71485 2.61236 8.66229 2.61769 8.57819C2.70818 8.62549 2.78271 8.66229 2.85724 8.70434C4.41698 9.55585 5.9714 10.4284 7.54711 11.2536C8.63308 11.8213 9.7563 11.7897 10.8582 11.2589C11.0765 11.1537 11.2894 11.0329 11.5396 10.8962C11.5396 11.0013 11.5396 11.0696 11.5396 11.138C11.5396 12.1209 11.5396 13.1091 11.5396 14.092C11.5343 14.1656 11.5503 14.2339 11.5609 14.3022Z"
                            fill="#F0C528"/>
                        <path
                            d="M12.8385 14.3338C12.8278 14.2654 12.8119 14.1918 12.8119 14.1235C12.8119 12.8778 12.8119 11.6268 12.8119 10.3811C12.8119 10.2812 12.8065 10.1971 12.9237 10.134C13.8499 9.63469 14.7709 9.13009 15.6971 8.62549C15.7131 8.61497 15.7344 8.61497 15.7716 8.60446C15.777 8.67279 15.7823 8.73587 15.7823 8.79894C15.7823 9.5611 15.7823 10.3233 15.7823 11.0854C15.777 12.7779 14.6804 14.0394 12.9929 14.297C12.9343 14.3022 12.8864 14.318 12.8385 14.3338Z"
                            fill="#F0C528"/>
                        <path
                            d="M11.5609 14.3075C11.9176 14.3127 12.2689 14.3127 12.6256 14.318C12.6948 14.318 12.7693 14.3285 12.8385 14.3338C12.8385 14.3338 12.8332 14.3285 12.8332 14.3338C12.8225 14.6649 12.8172 15.0013 12.8066 15.3324C12.7959 15.6899 12.5989 15.9317 12.2689 15.9947C11.9495 16.0526 11.5769 15.837 11.5556 15.5217C11.5236 15.1169 11.5556 14.707 11.5609 14.3075Z"
                            fill="#F0C528"/>
                    </svg>
                    <p className="text-[#F0C528] rounded-full p-2">{t("course")}</p>
                    <p className="w-[22px] border border-solid rotate-90"></p>
                    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    <p className="p-2 text-[#979696]">Notes</p>
                </div>
                {/*right avatar*/}
                <div className="item-center py-2 cursor-pointer relative">
                    <div className="flex" onClick={handleDropdownToggle} onBlur={handleBlur} ref={dropdownRef}>
                        {userInfo && (
                            <>
                                <h3 className="pr-2 inline-flex items-center">
                                    {userInfo.email.split("@")[0]}
                                </h3>
                                <img src={`https://binote-api.biplus.com.vn/assets/${userInfo.avatar}`} alt=""
                                     className="w-[32px] h-[32px] rounded"/>
                            </>
                        )}
                    </div>
                    {showDropdown && (
                        <div className="dropdown-menu absolute bg-white rounded shadow-lg mt-2">
                            <li className="list-none">
                                <select value={localStorage.getItem("i18nextLng")} onChange={handleChangeLanguage}>
                                    <option value="en">English</option>
                                    <option value="vn">Vietnamese</option>
                                </select>
                            </li>
                            <div
                                className="dropdown-item py-2 px-4 hover:bg-gray-200 cursor-pointer"
                                onClick={handleLogout}
                            >
                                {t("signOut")}
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
