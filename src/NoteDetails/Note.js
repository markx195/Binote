import DeleteIcon from '@mui/icons-material/Delete';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import {grey} from '@mui/material/colors';
import {yellow} from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import React, {useState, useEffect, useCallback} from "react";
import '../App.css'
import AlarmIcon from '@mui/icons-material/Alarm';
import InfoIcon from '@mui/icons-material/Info';
import ContentEditable from 'react-contenteditable';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import debounce from "lodash/debounce";
import {useTranslation} from "react-i18next";
import {showToast} from '../common/Toast'

const storedAccessToken = localStorage.getItem('accessToken');


const Note = ({
                  courseData = [],
                  idNoted,
                  setIsVisible,
                  setIsCancelled,
                  setInstructor,
                  onAddItem,
                  onDeleteItem,
                  isInfoVisible,
                  setIsInfoVisible
              }) => {
    const {t} = useTranslation()
    const handleKeyDownTitle = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const textarea = document.getElementById('textarea'); // Add an id to the textarea element
            textarea.focus();
        }
    };
    const [items, setItems] = useState(courseData);
    const [inputValue, setInputValue] = useState("");
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [timeoutId, setTimeoutId] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [noteData, setNoteData] = useState("")

    useEffect(() => {
        setItems(courseData);
        // Set the first item in the courseData array as the selected item
        if (courseData.length > 0) {
            handleItemClick(courseData[0]);
        }
    }, [courseData])

    const handleAddItem = () => {
        const newItem = {
            title: 'Tiêu đề',
            note: `Tôi đã học được gì:

Tôi có thể áp dụng gì vào công việc:`,
            course_id: parseInt(idNoted),
            learning_hour: 0.25
        };
        onAddItem(newItem);
    };

    const handleDeleteItem = id => {
        onDeleteItem(id);
    };

    // Sending Learning Time
    const compareDate = useCallback((dateString) => {
        const date1 = new Date(dateString);
        const date2 = new Date();

        const diffInSeconds = Math.floor((date2 - date1) / 1000);

        if (diffInSeconds < 60) {
            return `Vừa xong`;
        } else if (diffInSeconds < 3600) {
            const diffInMinutes = Math.floor(diffInSeconds / 60);
            return `${diffInMinutes}` + " " + "phút trước";
        } else if (diffInSeconds < 86400) {
            const diffInHours = Math.floor(diffInSeconds / 3600);
            return `${diffInHours}` + " " + "giờ trước";
        } else if (diffInSeconds < 2592000) {
            const diffInDays = Math.floor(diffInSeconds / 86400);
            return `${diffInDays}` + " " + "ngày trước";
        } else {
            const diffInMonths = Math.floor(diffInSeconds / 2592000);
            if (!isNaN(diffInMonths)) {
                return `${diffInMonths}` + " " + "tháng trước";
            } else {
                return `Vừa xong`;
            }
        }
    }, [])
    const handleSelectTime = (time) => {
        const changeTypeTime = parseFloat(time.target.value);
        setSelectedTime(changeTypeTime);
        clearTimeout(timeoutId);
        // Set a new timeout for 3 seconds
        const newTimeoutId = setTimeout(() => {
            if (changeTypeTime) {
                const dataToUpdate = {learning_hour: changeTypeTime};
                updateItemData(selectedItemId, dataToUpdate)
                    .then((updatedItem) => {
                        const updatedItems = [...items];
                        const updatedItemIndex = updatedItems.findIndex(item => item.id === selectedItemId);
                        updatedItems[updatedItemIndex].learning_hour = changeTypeTime;
                        setItems(updatedItems);
                    });
            }
        }, 1000);
        setTimeoutId(newTimeoutId);
    };
    const updateItemData = (itemId, dataToUpdate) => {
        return fetch(`https://binote-api.biplus.com.vn/items/note/${itemId}`, {
            method: "PATCH",
            body: JSON.stringify(dataToUpdate),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${storedAccessToken}`
            },
        })
            .then((response) => response.json())
            .then((updatedItem) => updatedItem)
            .catch((error) => {
                // Handle error
                console.error("Error updating item data:", error);
            });
    };
    // Close tag Learning Time

    // Catch Change and updateNote//
    const handleUpdate = useCallback(
        debounce((key, value) => {
            // Update items state with the new value
            const updatedItems = [...items];
            const updatedItemIndex = updatedItems.findIndex(
                (item) => item.id === selectedItemId
            );
            if (updatedItemIndex !== -1) {
                updatedItems[updatedItemIndex][key] = value;
                setItems(updatedItems);

                fetch(`https://binote-api.biplus.com.vn/items/note/${selectedItemId}`, {
                    method: "PATCH",
                    body: JSON.stringify({[key]: value}),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${storedAccessToken}`,
                    },
                })
                    .then((response) => {
                    })
                    .catch((error) => {
                        showToast(t("error"), "warning")
                    });
            }
        }, 1000),
        [items, selectedItemId, storedAccessToken]
    );
    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setInputValue(inputValue);
        handleUpdate("title", inputValue);
    };
    const handleInputChangeBody = (e) => {
        const inputValue = e.target.value;
        setNoteData(inputValue);
        handleUpdate("note", inputValue);
    };
    // Close Change and updateNote//

    const handleItemClick = (item) => {
        console.log(item)
        setSelectedItemId(item.id);
        if (item.note === null) {
            setInputValue(item.title || "");
        } else {
            setInputValue(item.title);
            setNoteData(item.note)
            setSelectedTime(item.learning_hour)
        }
    };

    function replaceSpecialCharacters(str) {
        return str
            .replace(/&nbsp;/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<');
    }

    const handleInfoAction = () => {
        setIsInfoVisible(!isInfoVisible);
        setIsCancelled(false);
        setIsVisible(true);
    }

    const [checkDelete, setCheckDelete] = useState(null);

    const checkInstructor = () => {
        const userID = localStorage.getItem("userID")
        return setInstructor === userID;
    }
    return (
        <>
            <div
                id="hideScroll"
                className="w-3/12 border-solid shrink-0 overflow-y-auto border-r-2 border-[#dddddd] bg-[#585858] h-[76.7vh]"
                style={{
                    borderWidth: "1px 0px 1px 1px",
                    borderRadius: "16px 0px 0px 16px",
                    borderRight: "1px solid #979696",
                }}>
                <div className="bg-[#585858] border-b-2 border-solid border-[#979696]">
                    <div className="p-6">
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <StickyNote2Icon sx={{color: grey[100]}}/>
                                <div className="flex items-center ml-2">
                                    <div className="font-bold text-xl text-[#F4F4F4]">{t("notes")}</div>
                                </div>
                            </div>
                            {checkInstructor() ? null : (
                                <AddIcon sx={{color: yellow[500]}} fontSize="large" onClick={handleAddItem}
                                         className="cursor-pointer"/>
                            )}
                        </div>
                        <div
                            className="bg-[#585858] text-left text-[#D5D5D5] text-sm font-normal">
                            {courseData.length} {t("notes")}
                        </div>
                    </div>
                </div>
                <div className="overflow-y-scroll noteScroll">
                    {items?.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={`sm:w-full cursor-pointer bg-[#585858] hover:bg-[#979696] border-b-2 border-solid border-[#979696] ${
                                item.id === selectedItemId ? 'bg-[#979696] border-b-2 border-solid border-yellow-300' : ''
                            } p-6 text-left group`}
                        >
                            <div
                                className="text-[#F4F4F4] text-sm font-bold line-clamp-2">{replaceSpecialCharacters(item.title)}</div>
                            <div className="flex justify-between">
                                <div
                                    className="text-[#D5D5D5] text-xs font-medium">{compareDate(item.date_updated)}</div>
                                <div className={checkDelete === item.id ? 'block' : 'group-hover:block hidden'}>
                                    {checkDelete === item.id ? (
                                        <>
                                            <CheckIcon fontSize="small" sx={{color: grey[100]}}
                                                       onClick={() => handleDeleteItem(item.id)}/>
                                            <CloseIcon fontSize="small" sx={{color: grey[100]}}
                                                       onClick={() => setCheckDelete(null)}/>
                                        </>
                                    ) : (
                                        <DeleteIcon fontSize="small" sx={{color: grey[100]}}
                                                    onClick={() => setCheckDelete(item.id)}/>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/*//////////////////////////Default img/////////////////////////////////*/}
            {courseData.length === 0 && (
                <div className="relative w-full">
                    <img src="/Images/defaultNoteImg.png" alt="Default" className="h-[76.7vh] w-full"/>
                    <div className="absolute top-0 right-0 m-2 cursor-pointer"
                         onClick={handleInfoAction}>
                        <InfoIcon/>
                    </div>
                </div>
            )}
            {/*//////////////////////////  Where to Type/////////////////////////////////*/}
            {courseData.length > 0 && (
                <div className="w-9/12 relative">
                    <div className="overflow-y-auto h-[70vh]" id="hideScroll">
                        <div className="flex pb-4 w-full">
                            <ContentEditable
                                html={inputValue}
                                onChange={handleInputChange}
                                className="font-normal font-bold:text-bold text-lg w-full px-8 py-2 rounded-r-md block h-full text-left"
                                style={{
                                    border: "none",
                                    outline: "none",
                                    padding: "40px 40px 0px 40px",
                                    borderRadius: "0px 16px 16px 0px",
                                    fontWeight: "700",
                                    fontSize: "24px",
                                }}
                                onKeyDown={handleKeyDownTitle}
                            />
                            {isInfoVisible && (
                                <div className="relative cursor-pointer">
                                    <InfoIcon className="absolute right-0 top-0 m-2" onClick={handleInfoAction}/>
                                </div>
                            )}
                        </div>
                        <textarea type="text"
                                  id="textarea"
                                  className="placeholder-gray-500 font-normal font-bold:text-bold text-lg w-full px-8 py-2 rounded-r-md h-[50vh] bg-[#F5F5F5]"
                                  style={{
                                      border: "none",
                                      outline: "none",
                                      padding: "0px 40px 0px 40px",
                                      borderRadius: "0px 16px 16px 0px",
                                      resize: "none"
                                  }}
                                  value={noteData}
                                  onChange={handleInputChangeBody}
                        />
                    </div>
                    <div className="flex justify-center items-center absolute bottom-0 right-0 pr-12 pb-10 ">
                        <AlarmIcon/>
                        <select
                            className="bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer appearance-none selectTime"
                            value={selectedTime}
                            onChange={handleSelectTime}
                        >
                            <option value="0.25 ">15m</option>
                            <option value="0.5">30m</option>
                            <option value="0.75">45m</option>
                            <option value="1">60m</option>
                        </select>
                    </div>
                </div>
            )}
        </>
    );
};

export default Note;

