import DeleteIcon from '@mui/icons-material/Delete';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import {grey} from '@mui/material/colors';
import {yellow} from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import {CKEditor} from "@ckeditor/ckeditor5-react";
import BalloonEditor from "@ckeditor/ckeditor5-build-balloon";
import React, {useState, useRef} from "react";
import '../App.css'

const Note = ({courseData}) => {
    const editorRef = useRef();
    const [items, setItems] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleAddItem = () => {
        const newItem = {
            id: "",
            title: 'New Note',
            date_created: new Date().toLocaleDateString(),
            note: ''
        };

        // Update the state with the new item
        setItems(prevItems => [...prevItems, newItem]);
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
                    setItems(prevItems => prevItems.filter(item => item.id !== id)); // Update state
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
        if (item && item.note) {
            const editor = editorRef.current?.editor;
            if (editor) {
                editor.setData(item.note);
                setInputValue(item.title);
            }
        }
    };

    const handleInputChange = (e) => {
        // Update inputValue state with the current input value
        setInputValue(e.target.value);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {day: '2-digit', month: '2-digit', year: '2-digit'};
        return date.toLocaleDateString('en-GB', options);
    }

    return (
        <div className="flex max-w-[1300px] mx-auto pt-10 pb-[42px]">
            <div className="w-3/12 border-solid shrink-0 overflow-y-auto border-r-2 border-[#dddddd]" id="A"
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
                    {Array.isArray(courseData) && [...courseData, ...items].map(item => (
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
                        placeholder: 'Tôi đã học được gì:' // Placeholder text
                    }}
                    onReady={editor => {
                        console.log("store the Editor and use it when needed", editor)
                    }}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        console.log({event, editor, data})
                    }}
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
