import {useState, useEffect} from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import RawTool from "@editorjs/raw";
import Underline from "@editorjs/underline";

export default function Editor(props) {
    const {value, onchange} = props;

    function initEditor() {
        const editor = new EditorJS({
            holder: "editorjs",
            data: value,
            tools: {
                header: Header,
                list: List,
                raw: RawTool,
                underline: Underline
            },
            autofocus: true,
            placeholder: "Let`s write an awesome story!",
            onChange: (api, event) => {
                editor.save().then((outputData) => {
                    console.log(onchange);
                    onchange(outputData);
                })
            }
        });
    }

    useEffect(() => {
        initEditor();
    });

    function save() {
        console.log("save");
    }

    return (
        <>
            <div id="editorjs"></div>
        </>
    );
}
