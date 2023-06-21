import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import HomePage from "../HomePage/homePage";
import Note from '../NoteDetails/Note';
import CancelIcon from '@mui/icons-material/Cancel';
import {useTranslation} from "react-i18next";
import axios from 'axios';
import {showToast} from '../common/Toast'
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const NoteDetails = ({handleSignOut}) => {
    const {t} = useTranslation()
    const storedAccessToken = localStorage.getItem('accessToken');
    const id = useParams()
    const [courseData, setCourseData] = useState({notes: []});
    const [isVisible, setIsVisible] = useState(true);
    const [isCancelled, setIsCancelled] = useState(false);
    const [isInfoVisible, setIsInfoVisible] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [isCompletion, setIsCompletion] = useState(false)

    const handleAddItem = newItem => {
        // Add the new item to the list of notes first
        setCourseData(prevData => ({
            ...prevData,
            notes: [newItem, ...prevData.notes],
        }));
        // Send a request to the API to add the new item
        fetch('http://192.168.3.150:8050/items/note', {
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
        fetch(`http://192.168.3.150:8050/items/note/${id}`, {
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
                const response = await fetch(`http://192.168.3.150:8050/flows/trigger/20202c51-f8a4-4204-a479-b0b40f064f90?id=${id.id}`, {
                    headers: {
                        Accept: "*/*", "Content-Type": "application/json", Authorization: `Bearer ${storedAccessToken}`
                    }
                });
                const data = await response.json();
                if (data.data.isCompletion !== isCompletion) {
                    setIsCompletion(data.data.isCompletion);
                }
                setCourseData(data.data);
            } catch (error) {
                console.error("Error fetching course data:", error);
            }
        };
        fetchCourseData();
    }, [id.id, storedAccessToken, isCompletion]);

    const handleFinishedCourse = async () => {
        const completeCourse = !isCompletion;
        const requestData = {
            course_id: id.id,
            is_completed: completeCourse
        };
        try {
            const response = await axios.post('http://192.168.3.150:8050/flows/trigger/3e5411f6-cf6d-4f85-926d-5d560ba39c2b', requestData, {
                    headers: {
                        Accept: "*/*", "Content-Type": "application/json", Authorization: `Bearer ${storedAccessToken}`
                    }
                }
            );
            setIsCompletion(response.data.is_completed)
            showToast(t("completeCourseBtn"), "success")
            console.log(response.data); // Handle the response data as needed
        } catch (error) {
            console.error(error);
        }
    }

    return (<>
        <HomePage handleSignOut={handleSignOut}/>
        <div className="flex px-[5%] pt-10 pb-20 bg-[#F5F5F5]">
            <div
                className={`w-full border-solid border h-[76.7vh] border-[#979696] rounded-2xl flex ${isCancelled ? "w-full" : "w-8/12"}`}>
                <Note courseData={courseData?.notes}
                      idNoted={id.id}
                      setIsCancelled={setIsCancelled}
                      setIsVisible={setIsVisible}
                      setIsInfoVisible={setIsInfoVisible}
                      isInfoVisible={isInfoVisible}
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
                            <div className="font-bold text-[32px] leading-[120%] text-left pt-12">
                                {courseData.title}
                            </div>

                            <div className="flex flex-col sm:flex-row">
                                <div className="flex-1 py-4 pr-2">
                                    <a
                                        className="flex justify-center items-center px-1 py-2 text-center transition duration-300 ease-in-out transform border border-[#F0C528] rounded-md shadow-md bg-[#F0C528] text-[#2F2E2E] hover:scale-105"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={courseData.link}
                                    >
                                        <span className="whitespace-nowrap break-words">{t("goToCourse")}</span>
                                    </a>
                                </div>
                                <div className="flex-1 py-4 cursor-pointer">
                                    <div
                                        className="flex justify-center items-center px-1 py-2 text-center transition duration-300 ease-in-out transform border border-[#F0C528] rounded-md shadow-md text-[#2F2E2E] hover:scale-105"
                                        onClick={handleFinishedCourse}
                                    >
                                        {isCompletion ? (<>
                                                <div className="flex">
                                                    <div
                                                        className="whitespace-nowrap break-words pr-1">{t("keepStudying")}</div>
                                                    <RestartAltIcon/>
                                                </div>
                                            </>) :
                                            <span className="whitespace-nowrap break-words">
                                                    {t("completedCourse")}
                                            </span>}
                                    </div>
                                </div>
                            </div>

                            <div className="text-left"
                                 dangerouslySetInnerHTML={{__html: formatString(courseData.description)}}></div>
                        </>)}
                    </div>
                </div>)}
            </div>)}
        </div>
    </>);
};

export default NoteDetails;
