import DeleteIcon from '@mui/icons-material/Delete';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import {grey} from '@mui/material/colors';
import {yellow} from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import {CKEditor} from "@ckeditor/ckeditor5-react";
import BalloonEditor from "@ckeditor/ckeditor5-build-balloon";
import React, {useState} from "react";

const Note = ({courseData}) => {
    console.log(courseData)

    const [items, setItems] = useState([]);

    const handleAddItem = () => {
    };

    const handleDeleteItem = (id) => {
        
    };

    return (
        <div className="flex max-w-[1762px] mx-auto pt-10">
            <div className="border-solid shrink-0 overflow-y-auto border-r-2 border-[#dddddd]"
                 style={{
                     borderWidth: "1px 0px 1px 1px",
                     borderRadius: "16px 0px 0px 16px",
                     borderRight: "1px solid #979696"
                 }}>
                <div className="bg-[#585858] w-[302px] h-[89px] border-b-2 border-solid border-[#979696]">
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
                <div className="max-h-[445px] overflow-y-scroll">
                    {Array.isArray(courseData) && courseData.map(item => (
                        <div key={item.id}
                             className="w-[302px] h-[89px] sm:w-full cursor-pointer bg-[#585858] hover:bg-[#979696] border-b-2 border-solid border-[#979696] hover:border-[#F0C528] p-6 text-left">
                            <div className="text-[#F4F4F4] text-sm font-bold">{item.title}</div>
                            <div className="flex justify-between">
                                <div className="text-[#D5D5D5] text-xs font-medium">{item.date_created}</div>
                                <DeleteIcon fontSize="small" sx={{color: grey[100]}}
                                            onClick={() => handleDeleteItem(item.id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full  border-[#979696]"
                 style={{
                     borderWidth: "1px 1px 1px 0px",
                     borderRadius: "0px 16px 16px 0px",
                     borderRight: "1px solid #979696"
                 }}>
                <CKEditor editor={BalloonEditor}
                          data="Hello mother fucker"
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
    )
        ;
};

export default Note;
