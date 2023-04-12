import React, {useState} from "react";
import {useParams, useLocation} from "react-router-dom";
import HomePage from "../HomePage/homePage"
import Note from "./Note"

const NoteDetails = ({noteId, handleAddNote, handleDeleteNote}) => {
    const id = useParams()
    return (
        <>
            <HomePage></HomePage>
            <div className="grid max-w-[1762px] mx-auto"
                 style={{gridGap: "1rem", gridTemplateColumns: "repeat(auto-fill,minmax(250px, 1fr))"}}>
                {/*{data && data.map((note) => (*/}
                {/*    <Note id={note.course_id}*/}
                {/*          text={note.title}*/}
                {/*          date={note.date_created}*/}
                {/*          handleDeleteNote={handleDeleteNote}/>*/}
                {/*))}*/}
            </div>
        </>
    );
};

export default NoteDetails;
