import DeleteIcon from '@mui/icons-material/Delete';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import {grey} from '@mui/material/colors';
import {yellow} from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import {CKEditor} from "@ckeditor/ckeditor5-react";
import BalloonEditor from "@ckeditor/ckeditor5-build-balloon";
import React, {useState, useRef, useEffect, useCallback} from "react";
import debounce from 'lodash/debounce';
import '../App.css'

const Note = ({courseData = [], idNoted}) => {
    const editorRef = useRef();
    const [items, setItems] = useState(courseData);
    const [inputValue, setInputValue] = useState('');
    const [inputValueCK, setInputValueCK] = useState('');
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [timeoutId, setTimeoutId] = useState("");

    useEffect(() => {
        setItems(courseData);
    }, [courseData])

    const handleAddItem = () => {
        const newItem = {
            id: "",
            title: 'New Note',
            date_created: new Date().toLocaleDateString(),
            note: ''
        };
        // Update the state with the new item
        setItems(prevItems => [newItem, ...prevItems]);
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

    const handleItemClick = (item) => {
        console.log(item)
        setSelectedItemId(item.id);
        const editor = editorRef.current?.editor;
        if (item.id === "") {
            if (editor) {
                editor.setData("");
                setInputValue("");
            }
        } else {
            if (editor) {
                console.log(item)
                if (item.note === null) {
                    editor.setData("");
                    setInputValue(item.title || "");
                } else if (item.title === null) {
                    editor.setData(item.note);
                    setInputValue("");
                } else {
                    editor.setData(item.note);
                    setInputValue(item.title);
                }
            }
        }
    };

    const debouncedHandleInputChange = useCallback(
        debounce((value) => {
            const requestBody = {
                title: value,
                course_id: parseInt(idNoted)
            };
            // Make POST request to the API endpoint
            fetch('http://192.168.3.150:8055/items/note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })
                .then((response) => {
                    // Handle response
                    const updatedItems = [...items]; // Create a copy of items array
                    const updatedItemIndex = updatedItems.findIndex(item => item.id === selectedItemId); // Find the index of the updated item
                    updatedItems[updatedItemIndex].title = inputValue; // Update the title of the item with the new input value
                    setItems(updatedItems);
                })
        }, 3000), // Set the debounce delay to 5000 milliseconds
        [selectedItemId, idNoted]
    );

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setInputValue(inputValue);
        if (selectedItemId === '') {
            if (inputValue) {
                debouncedHandleInputChange(inputValue);
            }
        }
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
        }, 5000); // 10 seconds

        // Update the timeoutId state with the new timeout id
        setTimeoutId(newTimeoutId);
    }

    const debouncedHandleInputChangeCK = useCallback(
        debounce((value) => {
            const requestBody = {
                note: value,
                course_id: parseInt(idNoted)
            };
            // Make POST request to the API endpoint
            fetch('http://192.168.3.150:8055/items/note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })
        }, 3000), // Set the debounce delay to 5000 milliseconds
        [selectedItemId, idNoted]
    );

    const handleChangeCK = (e, editor) => {
        const data = editor.getData()
        setInputValueCK(data);
        if (selectedItemId === '') {
            if (data) {
                debouncedHandleInputChangeCK(data);
            }
        }
        clearTimeout(timeoutId);
        const newTimeoutId = setTimeout(() => {
            if (data) {
                fetch(`http://192.168.3.150:8055/items/note/${selectedItemId}`, {
                    method: "PATCH", // Update method to PATCH
                    body: JSON.stringify({note: data}),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => {
                        const updatedItems = [...items]; // Create a copy of items array
                        const updatedItemIndex = updatedItems.findIndex(item => item.id === selectedItemId); // Find the index of the updated item
                        updatedItems[updatedItemIndex].note = data; // Update the title of the item with the new input value
                        setItems(updatedItems);
                    })
                    .catch((error) => {
                    });
            }
        }, 5000); // 10 seconds
        setTimeoutId(newTimeoutId);
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {day: '2-digit', month: '2-digit', year: '2-digit'};
        return date.toLocaleDateString('en-GB', options);
    }

    return (
        <div className="flex max-w-[1300px] mx-auto pt-10 pb-[42px]">
            <div className="w-3/12 border-solid shrink-0 overflow-y-auto border-r-2 border-[#dddddd]"
                 id="A"
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
                        <div className="bg-[#585858] text-left text-[#D5D5D5] text-sm font-normal">Ghi chú</div>
                    </div>
                </div>
                <div className="max-h-[445px] overflow-y-scroll" id="hideScroll">
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
            <div className="w-9/12 border-[#979696]" id="B"
                 style={{
                     borderWidth: "1px 1px 1px 0px",
                     borderRadius: "0px 16px 16px 0px",
                     borderRight: "1px solid #979696"
                 }}>
                <input type="text" placeholder="Tiêu đề"
                       className="text-left ckeditor-input placeholder-gray-500 font-bold text-lg w-full"
                       style={{border: "none", outline: "none", padding: "8px", borderRadius: "0px 16px 16px 0px"}}
                       value={inputValue}
                       onChange={handleInputChange}
                />
                <CKEditor
                    ref={editorRef}
                    editor={BalloonEditor}
                    data=''
                    config={{
                        placeholder: 'Tôi đã học được gì:',// Placeholder text
                        toolbar: [
                            'heading',
                            '|',
                            'bold',
                            'italic',
                            '|',
                            'bulletedList',
                            'numberedList',
                        ]
                    }}
                    onReady={editor => {
                        console.log("store the Editor and use it when needed", editor)
                    }}
                    onChange={handleChangeCK}
                    onFocus={(event, editor) => {
                        console.log("Focus", editor)
                    }}
                    onBlur={(event, editor) => {
                        console.log("Blur", editor)
                    }}
                />
            </div>
        </div>
    );
};

export default Note;
