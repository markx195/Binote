import React, {useState, useEffect} from "react";
import {useParams, useLocation} from "react-router-dom";
import HomePage from "../HomePage/homePage";
import Note from '../NoteDetails/Note';
import CancelIcon from '@mui/icons-material/Cancel';
import {useTranslation} from "react-i18next";
import axios from 'axios';
import {showToast} from '../common/Toast'
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const NoteDetails = ({handleSignOut}) => {
    const location = useLocation();
    const item = location.state && location.state?.item;
    useEffect(() => {
        setIsFinished(item?.is_finished)
    }, [item]);
    const {t} = useTranslation()
    const storedAccessToken = localStorage.getItem('accessToken');
    const id = useParams()
    const [courseData, setCourseData] = useState({notes: []});
    const [isFinished, setIsFinished] = useState(false);
    const [user_attend, setUser_attend] = useState([]);
    const [isVisible, setIsVisible] = useState(true);
    const [isCancelled, setIsCancelled] = useState(false);
    const [isInfoVisible, setIsInfoVisible] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [isCompletion, setIsCompletion] = useState(false)
    const [instructor, setInstructor] = useState("")
    const [courseType, setCourseType] = useState("")
    const [checkAddLesson, SetCheckAddLesson] = useState("")

    const handleAddItem = newItem => {
        // Add the new item to the list of notes first
        setCourseData(prevData => ({
            ...prevData,
            notes: [newItem, ...prevData.notes],
        }));
        // Send a request to the API to add the new item
        fetch('https://binote-api.biplus.com.vn/items/note', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${storedAccessToken}`,
            },
            body: JSON.stringify(newItem),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to add item');
                }
            })
            .then(data => {
                // Update the list of notes in state with the new item returned by the API
                setCourseData(prevData => ({
                    ...prevData,
                    notes: [data.data, ...prevData.notes.filter(item => item.id !== newItem.id)],
                }));
            })
            .catch(error => {
                console.error('Failed to add item:', error);
                // If there is an error, remove the new item from the list of notes
                setCourseData(prevData => ({
                    ...prevData,
                    notes: prevData.notes.filter(item => item.id !== newItem.id),
                }));
            });
    };

    const handleDeleteItem = id => {
        // Update the UI first
        setCourseData(prevData => ({
            ...prevData,
            notes: prevData.notes.filter(item => item.id !== id),
        }));

        // Send the DELETE request to the server
        fetch(`https://binote-api.biplus.com.vn/items/note/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete item');
                }
            })
            .catch(error => {
                console.error('Failed to delete item:', error);
                // If the request fails, revert the UI back to the original state
                setCourseData(prevData => ({
                    ...prevData,
                    notes: [...prevData.notes, {id}], // Add the deleted item back
                }));
            });
    };

    function formatString(str) {
        if (str == null) {
            return "";
        }
        return str.replace(/\n/g, '<br>');
    }

    const handleCancelClick = () => {
        setIsInfoVisible(!isInfoVisible)
        setIsCancelled(true);
        setIsVisible(false);
    };

    useEffect(() => {
        const handleZoomChange = () => {
            const zoomLevel = Math.round(window.devicePixelRatio * 100);
            setIsZoomed(zoomLevel !== 100);
        };

        window.addEventListener("resize", handleZoomChange);
        return () => window.removeEventListener("resize", handleZoomChange);
    }, []);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await fetch(`https://binote-api.biplus.com.vn/flows/trigger/20202c51-f8a4-4204-a479-b0b40f064f90?id=${id.id}`, {
                    headers: {
                        Accept: "*/*", "Content-Type": "application/json", Authorization: `Bearer ${storedAccessToken}`
                    }
                });
                const data = await response.json();
                if (data.data.isCompletion !== isCompletion) {
                    setIsCompletion(data.data.isCompletion);
                }
                setCourseData(data.data);
                setUser_attend(data.data?.user_attend)
                setInstructor(data.data?.instructor)
                setCourseType(data.data?.course_type)
                SetCheckAddLesson(data.data?.lesson_available)
            } catch (error) {
                console.error("Error fetching course data:", error);
            }
        };
        fetchCourseData();
    }, [id.id, storedAccessToken, isCompletion]);

    const handleFinishedCourse = async () => {
        if (isFinished) {
            return;
        }
        const completeCourse = !isCompletion;
        const requestData = {
            course_id: id.id,
            is_completed: completeCourse
        };
        try {
            const response = await axios.post('https://binote-api.biplus.com.vn/flows/trigger/3e5411f6-cf6d-4f85-926d-5d560ba39c2b', requestData, {
                    headers: {
                        Accept: "*/*", "Content-Type": "application/json", Authorization: `Bearer ${storedAccessToken}`
                    }
                }
            );
            setIsCompletion(response.data.is_completed)
            showToast(t("completeCourseBtn"), "success")
        } catch (error) {
            console.error(error);
        }
    }

    const checkInstructor = () => {
        const userID = localStorage.getItem("userID")
        return instructor === userID;
    }

    const addOrEndLesson = (lessonStatus, isFinished) => {
        const apiUrl = `https://binote-api.biplus.com.vn/items/course/${id.id}`;
        const requestOptions = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedAccessToken}`,
            },
            body: JSON.stringify({lesson_status: lessonStatus, is_finished: isFinished}),
        };

        fetch(apiUrl, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
            })
            .catch(error => {
                // Handle any error that occurred during the API call
                console.error('Error:', error);
            });
    };

    const joinOrNotCourse = async () => {
        const idSend = id.id
        const userID = localStorage.getItem("userID")
        const apiUrl = `https://binote-api.biplus.com.vn/items/course/${idSend}`;
        let bodyData = {};

        if (user_attend?.length === 0) {
            // User is joining the course
            bodyData = {
                "user_attend": {
                    "create": [
                        {
                            "course_id": {idSend},
                            "directus_users_id": {
                                "id": userID,
                            }
                        }
                    ],
                    "update": []
                }
            };
        } else {
            // User is leaving the course
            bodyData = {
                "user_attend": {
                    "delete": [courseData.user_attend[0]?.id] // Replace '3' with the ID of the attendance record you want to delete
                }
            };
        }

        const requestOptions = {
            method: 'PATCH', // Use PATCH for this example
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedAccessToken}`,
            },
            body: JSON.stringify(bodyData)
        };

        try {
            const response = await fetch(apiUrl, requestOptions);
            const data = await response.json();

            // Update user_attend state after the API call.
            setUser_attend(data.data?.user_attend || []);
        } catch (error) {
            console.error("Error:", error);
        }
    };
    useEffect(() => {
    }, [storedAccessToken, isCompletion, user_attend, courseData]);

    const showA = checkInstructor();
    const showB = courseType === "COURSE";
    const showC = true;
    return (<>
        <HomePage handleSignOut={handleSignOut}/>
        <div className="flex px-[5%] pt-10 pb-20 bg-[#F5F5F5]">
            <div
                className={`w-full border-solid border h-[76.7vh] border-[#979696] rounded-2xl flex ${isCancelled ? "w-full" : "w-8/12"}`}>
                <Note courseData={courseData?.notes}
                      idNoted={id.id}
                      setInstructor={setInstructor}
                      setIsCancelled={setIsCancelled}
                      setIsVisible={setIsVisible}
                      setIsInfoVisible={setIsInfoVisible}
                      isInfoVisible={isInfoVisible}
                      setCourseType={courseType}
                      onAddItem={handleAddItem}
                      onDeleteItem={handleDeleteItem}/>
            </div>
            {!isCancelled && (<div className="pl-6 w-4/12">
                {isVisible && (<div
                    className="rounded-2xl border-[#979696] border-solid border">
                    <div className="px-6 h-[76.7vh] overflow-y-auto" id="hideScroll">
                        <div className="relative cursor-pointer">
                            <CancelIcon onClick={handleCancelClick}
                                        className="absolute right-0 top-0 mt-6"/>
                        </div>
                        {courseData && (<>
                            <div className="font-bold text-[32px] leading-[120%] text-left pt-12 cursor-default">
                                {courseData.title}
                            </div>

                            {showA ? (
                                // A - This will be shown if showA is true
                                <div className="flex flex-col sm:flex-row">
                                    <div className="flex-1 py-4 pr-2">
                                        <div
                                            className={`cursor-pointer flex justify-center items-center px-1 py-2 text-center transition duration-300
                                             ease-in-out transform border border-[#F0C528] rounded-md shadow-md text-[#2F2E2E] bg-[#F0C528] ${checkAddLesson ? 'hover:scale-105' : 'cursor-not-allowed opacity-50 pointer-events-none'}`}
                                            onClick={() => addOrEndLesson("true", "false")}
                                        >
            <span className="whitespace-nowrap break-words">
              {t("addLessons")}
            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1 py-4 cursor-pointer">
                                        <div
                                            className={`flex justify-center items-center px-1 py-2 text-center transition duration-300 ease-in-out transform border border-[#F0C528] rounded-md shadow-md text-[#2F2E2E] ${
                                                isFinished ? 'hover:scale-105' : 'cursor-not-allowed opacity-50 pointer-events-none'
                                            }`}
                                            onClick={() => addOrEndLesson("false", "true")}
                                        >
                                            <div className="whitespace-nowrap break-words">
                                                {t("endCourse")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : showB ? (
                                // B - This will be shown if showA is false and showB is true
                                <div className="flex-1 py-4 cursor-pointer">
                                    <div
                                        className="flex justify-center items-center px-1 py-2 text-center transition duration-300 ease-in-out transform border border-[#F0C528] rounded-md shadow-md text-[#2F2E2E] hover:scale-105"
                                        onClick={joinOrNotCourse}
                                    >
                                        {user_attend?.length > 0 ? (
                                            <>
                                                <div className="whitespace-nowrap break-words pr-1">
                                                    {t("joinedCourse")}
                                                </div>
                                            </>
                                        ) : (
                                            <span className="whitespace-nowrap break-words">{t("joinCourse")}</span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                // C - This will be shown if both showA and showB are false
                                <div className="flex flex-col sm:flex-row">
                                    <div className="flex-1 py-4 pr-2">
                                        <a
                                            className="flex justify-center items-center px-1 py-2 text-center transition duration-300 ease-in-out transform border border-[#F0C528] rounded-md shadow-md bg-[#F0C528] text-[#2F2E2E] hover:scale-105"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href={courseData.link}
                                        >
            <span className="whitespace-nowrap break-words">
              {t("goToCourse")}
            </span>
                                        </a>
                                    </div>
                                    <div className="flex-1 py-4 cursor-pointer">
                                        <div
                                            className="flex justify-center items-center px-1 py-2 text-center transition duration-300 ease-in-out transform border border-[#F0C528] rounded-md shadow-md text-[#2F2E2E] hover:scale-105"
                                            onClick={handleFinishedCourse}
                                        >
                                            {isCompletion ? (
                                                <>
                                                    <div className="flex">
                                                        <div className="whitespace-nowrap break-words pr-1">
                                                            {t("keepStudying")}
                                                        </div>
                                                        <RestartAltIcon/>
                                                    </div>
                                                </>
                                            ) : (
                                                <span className="whitespace-nowrap break-words">
                {t("completCourse")}
              </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}


                            <div className="text-left cursor-default"
                                 dangerouslySetInnerHTML={{__html: formatString(courseData.description)}}></div>
                        </>)}
                    </div>
                </div>)}
            </div>)}
        </div>
    </>);
};

export default NoteDetails;
