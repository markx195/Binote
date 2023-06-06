import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import HomePage from "../HomePage/homePage";
import Note from '../NoteDetails/Note';
import CancelIcon from '@mui/icons-material/Cancel';
import {useTranslation} from "react-i18next";

const NoteDetails = ({handleSignOut}) => {
    const {t} = useTranslation()
    const storedAccessToken = localStorage.getItem('accessToken');
    const id = useParams()
    const [courseData, setCourseData] = useState({notes: []});
    const [isVisible, setIsVisible] = useState(true);
    const [isCancelled, setIsCancelled] = useState(false);
    const [isInfoVisible, setIsInfoVisible] = useState(false);

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
        const fetchCourseData = async () => {
            try {
                const response = await fetch(`https://binote-api.biplus.com.vn/flows/trigger/20202c51-f8a4-4204-a479-b0b40f064f90?id=${id.id}`, {
                    headers: {
                        Accept: "*/*", "Content-Type": "application/json", Authorization: `Bearer ${storedAccessToken}`
                    }
                });
                const data = await response.json();
                setCourseData(data.data);
            } catch (error) {
                console.error("Error fetching course data:", error);
            }
        };
        fetchCourseData();
    }, [id.id, storedAccessToken]);

    return (<>
        <HomePage handleSignOut={handleSignOut}/>
        <div className="flex px-[5%] pt-10 pb-20">
            <div
                className={`w-full border-solid border h-[76.7vh] border-[#979696] rounded-2xl flex ${isCancelled ? "w-full" : "w-8/12"}`}>
                <Note courseData={courseData.notes}
                      idNoted={id.id}
                      setIsCancelled={setIsCancelled}
                      setIsVisible={setIsVisible}
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
                                        className="absolute right-0 top-0 my-2"/>
                        </div>
                        {courseData && (<>
                            <div className="font-bold text-[32px] leading-[120%] text-left pt-12">
                                {courseData.title}
                            </div>
                            <div className="py-4">
                                <a
                                    className="flex justify-center items-center px-4 py-2 text-center transition duration-300 ease-in-out transform border border-[#F0C528] rounded-md shadow-md bg-[#F0C528] text-[#2F2E2E] hover:scale-105"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={courseData.link}
                                >
                                    {t("goToCourse")}
                                </a>
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
