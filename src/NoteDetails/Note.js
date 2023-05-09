import DeleteIcon from '@mui/icons-material/Delete';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import {grey} from '@mui/material/colors';
import {yellow} from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import React, {useState, useEffect, useCallback} from "react";
import '../App.css'
import AlarmIcon from '@mui/icons-material/Alarm';
import InfoIcon from '@mui/icons-material/Info';

const storedAccessToken = localStorage.getItem('accessToken');

const Note = ({courseData = [], idNoted, setIsVisible, setIsCancelled, onAddItem, onDeleteItem}) => {
    const [items, setItems] = useState(courseData);
    const [inputValue, setInputValue] = useState("");
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [timeoutId, setTimeoutId] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    const [noteData, setNoteData] = useState("")

    useEffect(() => {
        setItems(courseData);
    }, [courseData])

    useEffect(() => {
        // Set the first item in the courseData array as the selected item
        if (courseData.length > 0) {
            handleItemClick(courseData[0]);
        }
    }, [courseData])

    const handleAddItem = () => {
        const newItem = {
            title: 'New Note',
            note: `Tôi đã học được gì:
Tôi có thể áp dụng gì vào công việc:`,
            course_id: parseInt(idNoted)
        };
        onAddItem(newItem);
    };

    const handleDeleteItem = id => {
        onDeleteItem(id);
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    }


    const compareDate = useCallback((dateString) => {
        const date1 = new Date(dateString);
        const date2 = new Date();

        const diffInSeconds = Math.floor((date2 - date1) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds}s`;
        } else if (diffInSeconds < 3600) {
            const diffInMinutes = Math.floor(diffInSeconds / 60);
            return `${diffInMinutes}m`;
        } else if (diffInSeconds < 86400) {
            const diffInHours = Math.floor(diffInSeconds / 3600);
            return `${diffInHours}h`;
        } else if (diffInSeconds < 2592000) {
            const diffInDays = Math.floor(diffInSeconds / 86400);
            return `${diffInDays}d`;
        } else {
            const diffInMonths = Math.floor(diffInSeconds / 2592000);
            return `${diffInMonths}M`;
        }
    }, [])

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

    const handleSelectTime = (time) => {
        const changeTypeTime = parseInt(time.target.value);
        setSelectedTime(changeTypeTime);
        clearTimeout(timeoutId);
        // Set a new timeout for 3 seconds
        const newTimeoutId = setTimeout(() => {
            if (time) {
                const dataToUpdate = {learning_hour: changeTypeTime};
                updateItemData(selectedItemId, dataToUpdate)
                    .then((updatedItem) => {
                        const updatedItems = [...items];
                        const updatedItemIndex = updatedItems.findIndex(item => item.id === selectedItemId);
                        updatedItems[updatedItemIndex].learning_hour = changeTypeTime;
                        setItems(updatedItems);
                    });
            }
        }, 3000);
        setTimeoutId(newTimeoutId);
    };

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

    const handleUpdate = (key, value) => {
        // Clear previous timeout
        clearTimeout(timeoutId);

        // Set a new timeout for 3 seconds
        const newTimeoutId = setTimeout(() => {
            if (value) {
                // Make PATCH API call to update item with selectedItemId
                fetch(`https://binote-api.biplus.com.vn/items/note/${selectedItemId}`, {
                    method: "PATCH", // Update method to PATCH
                    // Update body with content as note key or inputValue as title key
                    body: JSON.stringify({[key]: value}),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${storedAccessToken}`,
                    },
                })
                    .then((response) => {
                        // Handle response
                        const updatedItems = [...items]; // Create a copy of items array
                        const updatedItemIndex = updatedItems.findIndex(
                            (item) => item.id === selectedItemId
                        ); // Find the index of the updated item
                        updatedItems[updatedItemIndex][key] = value; // Update the key of the item with the new value
                        setItems(updatedItems);
                    })
                    .catch((error) => {
                        // Handle error
                    });
            }
        }, 3000); // 3 seconds

        // Update the timeoutId state with the new timeout id
        setTimeoutId(newTimeoutId);
    };

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        console.log(inputValue);
        setInputValue(inputValue);
        handleUpdate("title", inputValue);
    };

    const handleInputChangeBody = (e) => {
        const inputValue = e.target.value;
        setNoteData(inputValue);
        handleUpdate("note", inputValue);
    };

    const handleInfoAction = () => {
        setIsCancelled(false);
        setIsVisible(true);
    }
    return (
        <>
            <div
                className="w-3/12 border-solid shrink-0 overflow-y-auto border-r-2 border-[#dddddd] bg-[#585858] h-[737px]"
                style={{
                    borderWidth: "1px 0px 1px 1px",
                    borderRadius: "16px 0px 0px 16px",
                    borderRight: "1px solid #979696"
                }}>
                <div className="bg-[#585858] border-b-2 border-solid border-[#979696]">
                    <div className="p-6">
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <StickyNote2Icon sx={{color: grey[100]}}/>
                                <div className="flex items-center ml-2">
                                    <div className="font-bold text-xl text-[#F4F4F4]">Ghi chú</div>
                                </div>
                            </div>
                            <AddIcon sx={{color: yellow[500]}} fontSize="large" onClick={handleAddItem}
                                     className="cursor-pointer"/>
                        </div>
                        <div
                            className="bg-[#585858] text-left text-[#D5D5D5] text-sm font-normal">
                            {courseData.length} Ghi chú
                        </div>
                    </div>
                </div>
                <div className="overflow-y-scroll noteScroll">
                    {items?.map(item => (
                        <div key={item.id}
                             onClick={() => handleItemClick(item)}
                             className={`sm:w-full cursor-pointer bg-[#585858] hover:bg-[#979696] border-b-2 border-solid border-[#979696] ${item.id === selectedItemId ? 'bg-[#979696]' : ''} p-6 text-left group`}
                        >
                            <div className="text-[#F4F4F4] text-sm font-bold line-clamp-2">{item.title}</div>
                            <div className="flex justify-between">
                                {item.user_updated !== null && (
                                    < div
                                        className="text-[#D5D5D5] text-xs font-medium">{compareDate(item.date_updated)} ago
                                    </div>
                                )}
                                {item.user_updated === null && (
                                    < div
                                        className="text-[#D5D5D5] text-xs font-medium">{formatDate(item.date_created)}
                                    </div>
                                )}
                                <div className="group-hover:block hidden">
                                    <DeleteIcon fontSize="small" sx={{color: grey[100]}}
                                                onClick={() => handleDeleteItem(item.id)}/>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {courseData.length === 0 && (
                <div className="relative w-full">
                    <img src="/Images/defaultNoteImg.png" alt="Default" className="h-[737px] w-full"/>
                    <div className="absolute top-0 right-0 m-2 cursor-pointer"
                         onClick={handleInfoAction}>
                        <InfoIcon/>
                    </div>
                </div>
            )}
            {courseData.length > 0 && (
                <div className="w-9/12 relative" id="B">
                    <div className="flex">
                        <textarea
                            type="text"
                            className="placeholder-gray-500 font-normal font-bold:text-bold text-lg w-full px-8 py-2 rounded-r-md block"
                            style={{
                                border: "none",
                                outline: "none",
                                padding: "40px 40px 0px 40px",
                                borderRadius: "0px 16px 16px 0px",
                                fontWeight: "700",
                                fontSize: "24px",
                                resize: "none"
                            }}
                            value={inputValue}
                            onChange={handleInputChange}
                        />
                        <div className="relative cursor-pointer">
                            <InfoIcon className="absolute right-0 top-0 m-2" onClick={handleInfoAction}/>
                        </div>
                    </div>
                    <textarea type="text"
                              className="placeholder-gray-500 font-normal font-bold:text-bold text-lg w-full px-8 py-2 rounded-r-md h-[600px]"
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
                    <div className="flex justify-center items-center absolute bottom-0 right-0 pr-12 pb-10">
                        <AlarmIcon/>
                        <select
                            className="bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer appearance-none"
                            value={selectedTime}
                            onChange={handleSelectTime}
                        >
                            <option value="10">10m</option>
                            <option value="15">15m</option>
                            <option value="30">30m</option>
                            <option value="45">45m</option>
                            <option value="60">60m</option>
                        </select>
                    </div>
                </div>
            )}
        </>
    );
};

export default Note;

