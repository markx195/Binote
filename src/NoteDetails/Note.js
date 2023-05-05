import DeleteIcon from '@mui/icons-material/Delete';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import {grey} from '@mui/material/colors';
import {yellow} from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import React, {useState, useEffect,useRef,useMemo} from "react";
import '../App.css'
import AlarmIcon from '@mui/icons-material/Alarm';
import InfoIcon from '@mui/icons-material/Info';
import { createReactEditorJS } from "react-editor-js";
import DragDrop from "editorjs-drag-drop";
import { EDITOR_JS_TOOLS } from "../RichText/Editor";
const storedAccessToken = localStorage.getItem('accessToken');

const Note = ({courseData = [], idNoted, setIsVisible, setIsCancelled}) => {
    const [items, setItems] = useState(courseData);
    const [inputValue, setInputValue] = useState("");
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [timeoutId, setTimeoutId] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [showImg, setShowImg] = useState(false)
    const [noteData, setNoteData] = useState("")

    // const instanceRef = useRef(null);
    const instanceRef = React.useRef(null);
    const memoizedRef = useMemo(() => instanceRef, []);
    const ReactEditorJS = createReactEditorJS();

    console.log(memoizedRef);

    const editorCore = React.useRef(null);

    const handleInitialize = React.useCallback((instance) => {
        editorCore.current = instance;
    }, []);

    const handleReady = () => {
        const editor = editorCore.current._editorJS;
        new DragDrop(editor);
    };

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
        fetch('https://binote-api.biplus.com.vn/items/note', {
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
        fetch(`https://binote-api.biplus.com.vn/items/note/${id}`, {
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
        setShowImg(true)
        setSelectedItemId(item.id);
        // try {
        //     setNoteData(JSON.parse(item.note));
        // } catch (e) {
        //     console.log(e);
        //     setNoteData({});
        // }
        // setInputValue(item.title);
        // setSelectedTime(item.learning_hour)
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

    // const handleEditorChange = (data) => {
    //     console.log(data);
    //     setNoteData(data);
    //     handleUpdate("note", data);
    // };

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
                    <div className="flex">
                        <input type="text" placeholder="Tiêu đề"
                               className="placeholder-gray-500 font-normal font-bold:text-bold text-lg w-full px-8 py-2 rounded-r-md"
                               style={{
                                   border: "none",
                                   outline: "none",
                                   padding: "8px",
                                   borderRadius: "0px 16px 16px 0px"
                               }}
                               value={inputValue}
                               onChange={handleInputChange}
                        />
                        <div className="relative cursor-pointer">
                            <InfoIcon className="absolute right-0 top-0 m-2" onClick={handleInfoAction}/>
                        </div>
                    </div>

                    {/*<Editor value={noteData} onchange={handleEditorChange}/>*/}
                    <ReactEditorJS
                        memoizedRef={(instance) => (memoizedRef.current = instance)}
                        tools={EDITOR_JS_TOOLS}
                        onReady={handleReady}
                        onInitialize={handleInitialize}
                    />
{/*                    <textarea type="text" placeholder="Tôi đã học được gì:*/}
{/*Tôi có thể áp dụng gì vào công việc:"*/}
{/*                              className="placeholder-gray-500 font-normal font-bold:text-bold text-lg w-full px-8 py-2 rounded-r-md h-[600px]"*/}
{/*                              style={{*/}
{/*                                  border: "none",*/}
{/*                                  outline: "none",*/}
{/*                                  padding: "8px",*/}
{/*                                  borderRadius: "0px 16px 16px 0px"*/}
{/*                              }}*/}
{/*                              value={noteData}*/}
{/*                              onChange={handleInputChangeBody}*/}
{/*                    />*/}
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

