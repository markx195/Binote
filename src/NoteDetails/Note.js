import DeleteIcon from '@mui/icons-material/Delete';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import {grey} from '@mui/material/colors';
import {yellow} from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import React, {useState, useEffect} from "react";
import '../App.css'
import AlarmIcon from '@mui/icons-material/Alarm';

const storedAccessToken = localStorage.getItem('accessToken');

const Note = ({courseData = [], idNoted}) => {
    const [items, setItems] = useState(courseData);
    const [inputValue, setInputValue] = useState('');
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [timeoutId, setTimeoutId] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [showImg, setShowImg] = useState(false)

    useEffect(() => {
        setItems(courseData);
    }, [courseData])

    const handleAddItem = () => {
        setShowImg(true)
        const newItem = {
            title: 'New Note',
            note: "",
            course_id: parseInt(idNoted)
        };
        fetch('http://192.168.3.150:8055/items/note', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${storedAccessToken}`
            },
            body: JSON.stringify(newItem)
        }).then(response => {
            if (response.ok) {
                // Item successfully added, handle success
                console.log('Item added successfully');
                // Get response data as JSON
                return response.json(); // This returns a Promise
            } else {
                // Item addition failed, handle error
                console.error('Failed to add item:', response.status);
                // Perform any error handling or state updates as needed
            }
        }).then(data => {
            // Handle response data
            console.log(data.data);
            setItems(prevItems => [data.data, ...prevItems]);
            // Perform any additional actions or state updates as needed
        }).catch(error => {
            // Fetch failed, handle error
            console.error('Failed to add item:', error);
            // Perform any error handling or state updates as needed
        });
    };

    const handleDeleteItem = (id) => {
        fetch(`http://192.168.3.150:8055/items/note/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    // Item successfully deleted, handle success
                    console.log('Item deleted successfully');
                    // Update state with new list of items after deleting item
                    setItems(prevItems => prevItems.filter(item => item.id !== id));
                    // Update state
                    // Perform any additional actions or state updates as needed
                } else {
                    // Item deletion failed, handle error
                    console.error('Failed to delete item:', response.status);
                    // Perform any error handling or state updates as needed
                }
            })
            .catch(error => {
                console.error('Failed to delete item:', error);
                // Perform any error handling or state updates as needed
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {day: '2-digit', month: '2-digit', year: '2-digit'};
        return date.toLocaleDateString('en-GB', options);
    }

    const updateItemData = (itemId, dataToUpdate) => {
        return fetch(`http://192.168.3.150:8055/items/note/${itemId}`, {
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
        setShowImg(true)
        setSelectedItemId(item.id);
        console.log(item)
        if (item.note === null) {
            setInputValue(item.title || "");
        } else if (item.title === null) {
            setInputValue("");
        } else {
            setInputValue(item.title);
            setSelectedTime(item.learning_hour)
        }
    };

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        console.log(inputValue)
        setInputValue(inputValue);
        // Clear previous timeout
        clearTimeout(timeoutId);
        // Set a new timeout for 10 seconds
        const newTimeoutId = setTimeout(() => {
            if (inputValue) {
                // Make PATCH API call to update item with selectedItemId
                fetch(`http://192.168.3.150:8055/items/note/${selectedItemId}`, {
                    method: "PATCH", // Update method to PATCH
                    // Update body with inputValue as title key
                    body: JSON.stringify({title: inputValue}),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${storedAccessToken}`
                    },
                })
                    .then((response) => {
                        // Handle response
                        const updatedItems = [...items]; // Create a copy of items array
                        const updatedItemIndex = updatedItems.findIndex(item => item.id === selectedItemId); // Find the index of the updated item
                        updatedItems[updatedItemIndex].title = inputValue; // Update the title of the item with the new input value
                        setItems(updatedItems);
                    })
                    .catch((error) => {
                        // Handle error
                    });
            }
        }, 3000); // 10 seconds

        // Update the timeoutId state with the new timeout id
        setTimeoutId(newTimeoutId);
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
                             className="sm:w-full cursor-pointer bg-[#585858] hover:bg-[#979696] border-b-2 border-solid border-[#979696] hover:border-[#F0C528] p-6 text-left">
                            <div className="text-[#F4F4F4] text-sm font-bold">{item.title}</div>
                            <div className="flex justify-between">
                                <div
                                    className="text-[#D5D5D5] text-xs font-medium">{formatDate(item.date_created)}</div>
                                <DeleteIcon fontSize="small" sx={{color: grey[100]}}
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="transition-opacity duration-300 opacity-0 hover:opacity-100"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {!showImg && (
                <img src="/Images/defaultNoteImg.png" alt="Default" className="w-full h-[737px]"/>
            )}
            {showImg && (
                <div className="w-9/12 relative" id="B">
                    <input type="text" placeholder="Tiêu đề"
                           className="placeholder-gray-500 font-bold text-lg w-full"
                           style={{border: "none", outline: "none", padding: "8px", borderRadius: "0px 16px 16px 0px"}}
                           value={inputValue}
                           onChange={handleInputChange}
                    />
                    <input type="text" placeholder="THEllo"/>
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
