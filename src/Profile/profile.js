import React, {useState, useEffect} from "react";
import HomePage from "../HomePage/homePage";
import "../App.css"
import axios from 'axios';
import {useTranslation} from "react-i18next";
import {Progress, Space} from 'antd';
import EditableText from "../common/EditableText"
import {debounce} from 'lodash';
import Tooltip, {tooltipClasses} from '@mui/material/Tooltip';
import {useNavigate} from "react-router-dom"

const noiticeIcon = <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M7.99992 11.8335C8.18881 11.8335 8.34725 11.7695 8.47525 11.6415C8.60325 11.5135 8.66703 11.3553 8.66659 11.1668V8.50016C8.66659 8.31127 8.60259 8.15283 8.47459 8.02483C8.34659 7.89683 8.18836 7.83305 7.99992 7.8335C7.81103 7.8335 7.65259 7.8975 7.52459 8.0255C7.39659 8.1535 7.33281 8.31172 7.33325 8.50016V11.1668C7.33325 11.3557 7.39725 11.5142 7.52525 11.6422C7.65325 11.7702 7.81147 11.8339 7.99992 11.8335ZM7.99992 6.50016C8.18881 6.50016 8.34725 6.43616 8.47525 6.30816C8.60325 6.18016 8.66703 6.02194 8.66659 5.8335C8.66659 5.64461 8.60259 5.48616 8.47459 5.35816C8.34659 5.23016 8.18836 5.16639 7.99992 5.16683C7.81103 5.16683 7.65259 5.23083 7.52459 5.35883C7.39659 5.48683 7.33281 5.64505 7.33325 5.8335C7.33325 6.02239 7.39725 6.18083 7.52525 6.30883C7.65325 6.43683 7.81147 6.50061 7.99992 6.50016ZM7.99992 15.1668C7.0777 15.1668 6.21103 14.9917 5.39992 14.6415C4.58881 14.2913 3.88325 13.8164 3.28325 13.2168C2.68325 12.6168 2.20836 11.9113 1.85859 11.1002C1.50881 10.2891 1.3337 9.42239 1.33325 8.50016C1.33325 7.57794 1.50836 6.71127 1.85859 5.90016C2.20881 5.08905 2.6837 4.3835 3.28325 3.7835C3.88325 3.1835 4.58881 2.70861 5.39992 2.35883C6.21103 2.00905 7.0777 1.83394 7.99992 1.8335C8.92214 1.8335 9.78881 2.00861 10.5999 2.35883C11.411 2.70905 12.1166 3.18394 12.7166 3.7835C13.3166 4.3835 13.7917 5.08905 14.1419 5.90016C14.4921 6.71127 14.667 7.57794 14.6666 8.50016C14.6666 9.42239 14.4915 10.2891 14.1413 11.1002C13.791 11.9113 13.3161 12.6168 12.7166 13.2168C12.1166 13.8168 11.411 14.2919 10.5999 14.6422C9.78881 14.9924 8.92214 15.1673 7.99992 15.1668ZM7.99992 13.8335C9.48881 13.8335 10.7499 13.3168 11.7833 12.2835C12.8166 11.2502 13.3333 9.98905 13.3333 8.50016C13.3333 7.01127 12.8166 5.75016 11.7833 4.71683C10.7499 3.6835 9.48881 3.16683 7.99992 3.16683C6.51103 3.16683 5.24992 3.6835 4.21659 4.71683C3.18325 5.75016 2.66659 7.01127 2.66659 8.50016C2.66659 9.98905 3.18325 11.2502 4.21659 12.2835C5.24992 13.3168 6.51103 13.8335 7.99992 13.8335Z"
        fill="#979696"/>
</svg>

const Profile = (props) => {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const [profileDetails, setProfileDetails] = useState(null);
    const storedAccessToken = localStorage.getItem('accessToken');
    const [dataSource, setDataSource] = useState([])
    const [totalNotes, setTotalNotes] = useState(null)
    const [courseData, setCourseData] = useState([])
    const [totalLearningHour, setTotalLearningHour] = useState(null)
    const [rankDetails, setRankDetails] = useState("")
    const [courseProcess, setCourseProcess] = useState([])
    const [courseStatistics, setCourseStatistics] = useState([])
    const [showMore, setShowMore] = useState(false);
    const visibleItems = showMore ? dataSource : dataSource?.slice(0, 10);

    const handleShowMore = () => {
        setShowMore(true);
    };

    const getProfileUser = async () => {
        try {
            const apiUrl = 'http://192.168.3.150:8050/users/me';

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${storedAccessToken}`
                }
            });

            const data = await response.json();
            setProfileDetails(data.data)
        } catch (error) {
            console.error(error);
        }
    }
    const fetchData = async () => {
        try {
            const response = await axios.get("http://192.168.3.150:8050/flows/trigger/df524185-f718-4c57-891d-0761aabbd03e?sort=sort,-notes.date_updated,-notes.date_created&page=0", {
                headers: {
                    Accept: "*/*",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedAccessToken}`
                }
            });
            setDataSource(response.data.data);
            setCourseProcess(response.data)
        } catch
            (error) {
            console.error("Error fetching data:", error);
        }
    };
    const fetchDataStatic = async () => {
        const currentDateValue = new Date();
        const fromDateValue = new Date(currentDateValue.getTime() - 30 * 24 * 60 * 60 * 1000);
        const fromDateStr = fromDateValue.toISOString();
        const toDateStr = currentDateValue.toISOString();
        const url = 'http://192.168.3.150:8050/flows/trigger/22833381-b10f-45c5-a4ee-f90aa8b34f73';
        const fromDate = fromDateStr;
        const toDate = toDateStr
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${storedAccessToken}`,
                },
                body: JSON.stringify({from_date: fromDate, to_date: toDate}),
            });
            if (response.ok) {
                const data = await response.json();
                setCourseStatistics(data.courseStatistics)
                setCourseData(data.level)
                setRankDetails(data.level.current_level_object)
                setTotalNotes(data.level.totalNotes)
                setTotalLearningHour(data.level?.totalLearningHour)
            } else {
                console.log('Error:', response.status);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    useEffect(() => {
        getProfileUser()
        fetchDataStatic();
        fetchData()
    }, []);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        // Create a form data object to send the file
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://192.168.3.150:8050/files', formData, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${storedAccessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            const imageUrl = response.data.data.id;
            const updateResponse = await axios.patch('http://192.168.3.150:8050/users/me', {
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
        const apiUrl = 'http://192.168.3.150:8050/users/me';

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

    const handleNoteDetails = (id) => {
        navigate(`/note/${id}`);
    };

    function convertDecimalToTime(decimalTime) {
        const hours = Math.floor(decimalTime);
        const minutes = Math.round((decimalTime % 1) * 60);

        const paddedHours = hours.toString().padStart(2, '0');
        const paddedMinutes = minutes.toString().padStart(2, '0');

        return `${paddedHours}:${paddedMinutes}`;
    }

    const percentLearnHour = (courseData?.totalLearningHour / rankDetails?.max_hour) * 100;
    const percentLearnComplete = (courseData?.course_completion / rankDetails?.max_course) * 100;

    return (
        <>
            <HomePage handleSignOut={props.handleSignOut}/>
            <div className="flex pt-[54px] px-[5%] mx-auto flex justify-between bg-[#F6F6F6]">
                <div className="rounded-2xl p-4 bg-white h-fit"
                     style={{boxShadow: '0px 8px 18px rgba(46, 45, 40, 0.08)'}}>
                    {/* Profile Pic */}
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
                                        src={`http://192.168.3.150:8050/assets/${profileDetails?.avatar}`}
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
                            className="text-xl font-bold">
                            {profileDetails?.last_name} {profileDetails?.first_name}
                            {/*{profileDetails && (*/}
                            {/*    <EditableText value={profileDetails?.first_name} editClassName="form-control"*/}
                            {/*                  onChange={handleSaveProfile}/>*/}
                            {/*)}*/}
                        </div>
                        <span className="text-xs pt-2"> {profileDetails?.position}</span> |
                        <span className="text-xs">{profileDetails?.team}</span>
                    </div>
                    <div className="pt-11">
                        <div className="text-left text-sm font-bold pb-4">
                            {rankDetails?.name}
                        </div>
                        <div className="flex items-center justify-center">
                            <img
                                src={`http://192.168.3.150:8050/assets/${rankDetails?.image}`}
                                id="output"
                                width="130"
                                alt="RankAvatar"
                            />
                        </div>
                    </div>
                    <div className="pt-4">
                        <div className="flex items-center justify-between">
                            <div className="text-left text-sm">{t("numberOfHours")}</div>
                            <div
                                className="text-sm text-right text-[#979696]">{totalLearningHour}/{rankDetails?.max_hour}</div>
                        </div>
                        <Progress percent={percentLearnHour} showInfo={false} status="active" size={[300, 20]}
                                  strokeColor={{from: '#F0C528', to: '#E86F2B'}}/>
                    </div>
                    <div className="pt-4">
                        <div className="flex items-center justify-between">
                            <div className="text-left text-sm">{t("numberCoursesCompleted")}</div>
                            <div
                                className="text-sm text-right text-[#979696]">{courseData?.course_completion}/{rankDetails?.max_course}</div>
                        </div>
                        <Progress percent={percentLearnComplete} showInfo={false} status="active" size={[300, 20]}
                                  strokeColor={{from: '#2DFF90', to: '#0FA958'}}/>
                    </div>
                </div>
                {/*card*/}
                <div className="w-full pl-[62px]">
                    <div className="grid gap-[24px] md:grid-cols-3">
                        <div className="max-w-full rounded-2xl overflow-hidden border border-solid shadow-sm flex"
                             style={{boxShadow: '0px 0px 8px rgba(46, 45, 40, 0.1)'}}>
                            <div className="py-6 pl-6 flex-1">
                                <div className="flex">
                                    <div
                                        className="font-normal text-sm mb-2 text-left pr-1">{t("dailyLearningTime")}</div>
                                    <Tooltip title={t("dailyLearningTimeHint")}
                                             placement="top">
                                        {noiticeIcon}
                                    </Tooltip>
                                </div>
                                <div className="flex items-center" title="Text to show on hover">
                                    <p className="text-[40px] font-semibold" style={{marginRight: '10px'}}>
                                        {isNaN(courseStatistics?.daily_learning)
                                            ? "00:00"
                                            : convertDecimalToTime(courseStatistics?.daily_learning)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center pr-6">
                                <img src="/Images/Time.svg" alt=""/>
                            </div>
                        </div>
                        {/*card2*/}
                        <div className="max-w-full rounded-2xl overflow-hidden border border-solid shadow-sm flex"
                             style={{boxShadow: '0px 0px 8px rgba(46, 45, 40, 0.1)'}}>
                            <div className="py-6 pl-6 flex-1">
                                <div className="flex" data-tooltip="I’m the tooltip text.">
                                    <div className="font-normal text-sm mb-2 text-left pr-1">{t("numberOfNote")}</div>
                                    <Tooltip title={t("numberOfNoteHint")} placement="top">
                                        {noiticeIcon}
                                    </Tooltip>
                                </div>
                                <div className="flex items-center">
                                    <p className="text-[40px] font-semibold" style={{marginRight: '10px'}}>
                                        {totalNotes}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center pr-6">
                                <img src="/Images/Notes.svg" alt=""/>
                            </div>
                        </div>
                        {/*card3*/}
                        <div className="max-w-full overflow-hidden border border-solid rounded-2xl shadow-sm flex"
                             style={{boxShadow: '0px 0px 8px rgba(46, 45, 40, 0.1)'}}>
                            <div className="py-6 pl-6 flex-1">
                                <div className="flex">
                                    <div
                                        className="font-normal text-sm mb-2 text-left pr-1">{t("totalStudyTimes")}</div>
                                    <Tooltip title={t("totalStudyTimesHint")} placement="top">
                                        {noiticeIcon}
                                    </Tooltip>
                                </div>
                                <div className="flex items-center">
                                    <p className="text-[40px] font-semibold" style={{marginRight: '10px'}}>
                                        {convertDecimalToTime(totalLearningHour)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center pr-6">
                                <img src="/Images/FullClock.svg" alt=""/>
                            </div>
                        </div>
                    </div>
                    {/*//Right side Title*/}
                    <div className="flex pt-[37px] pb-4 flex items-center justify-between">
                        <div className="font-bold text-left">
                            {t("myCourse")}
                        </div>
                        <div className="text-right">
                            {t("complete")} {courseProcess.totalCompletedCourses}/{courseProcess.totalCourses}
                        </div>
                    </div>
                    {/*Courses*/}
                    <div>
                        <div
                            className='cursor-pointer grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 pt-4 pb-4 mx-auto'>
                            {visibleItems?.map((item, index) => (
                                <div
                                    key={index}
                                    className='border shadow-md rounded-lg hover:scale-105 duration-300'
                                    onClick={() => handleNoteDetails(item.id)}
                                >
                                    <div className="p-4">
                                        <div className='relative'>
                                            <img
                                                key={item?.image}
                                                src={`http://192.168.3.150:8050/assets/${item.image}`}
                                                alt={item?.name}
                                                className='w-full rounded h-[117.33px] object-cover rounded-t-lg'
                                            />
                                            {item.isCompletion && (
                                                <div className='absolute top-0 right-0 p-2'>
                                                    <img src="/Images/checkIcon.svg" alt="Check Icon"
                                                         className='w-6 h-6'/>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className='font-bold flex justify-between px-4 pb-4 text-sm text-left overflow-ellipsis'>
                                        <span id="tooltip-text">{item?.title}</span>
                                        <span id="tooltip">{item?.title}</span>
                                    </p>
                                    <div className="flex flex-wrap pb-4 justify-between px-4">
                                        <div className="flex flex-col">
                                            <p className="inline-flex items-center">
                                                <img src="/Images/clockIcon.svg" alt=""/>
                                                <span
                                                    className="p-1 text-sm text-[#979696]">{item?.totalLearningHour} hour</span>
                                            </p>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="inline-flex items-center">
                                                <img src="/Images/noteIcon.svg" alt=""/>
                                                <span
                                                    className="p-1 text-sm text-[#979696]">{item?.notes_count} notes</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {!showMore && dataSource?.length > 8 && (
                            <div className='flex justify-center items-center cursor-pointer pb-11   '
                                 onClick={handleShowMore}
                            >
                                {t("showMore")}
                                <img src="/Images/showMore.svg" alt=""/>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>)
}
export default Profile;
