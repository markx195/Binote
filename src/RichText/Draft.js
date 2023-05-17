import React, {Component} from "react"
import Editor, {createEditorStateWithText} from "@draft-js-plugins/editor"
import createInlineToolbarPlugin, {
    Separator
} from "@draft-js-plugins/inline-toolbar"
import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    CodeButton,
    // HeadlineOneButton,
    // HeadlineTwoButton,
    // HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    // CodeBlockButton
} from "@draft-js-plugins/buttons"
import "./draft.css"

class HeadlinesPicker extends Component {
    componentDidMount() {
        setTimeout(() => {
            window.addEventListener("click", this.onWindowClick)
        })
    }

    componentWillUnmount() {
        window.removeEventListener("click", this.onWindowClick)
    }

    onWindowClick = () =>
        // Call `onOverrideContent` again with `undefined`
        // so the toolbar can show its regular content again.
        this.props.onOverrideContent(undefined)

    // render() {
    //     const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
    //     return (
    //         <div>
    //             {buttons.map((Button, i) => (
    //                 // eslint-disable-next-line react/no-array-index-key
    //                 <Button key={i} {...this.props} />
    //             ))}
    //         </div>
    //     );
    // }
}

class HeadlinesButton extends Component {
    // When using a click event inside overridden content, mouse down
    // events needs to be prevented so the focus stays in the editor
    // and the toolbar remains visible  onMouseDown = (event) => event.preventDefault()
    onMouseDown = event => event.preventDefault()

    onClick = () =>
        // A button can call `onOverrideContent` to replace the content
        // of the toolbar. This can be useful for displaying sub
        // menus or requesting additional information from the user.
        this.props.onOverrideContent(HeadlinesPicker)

    render() {
        return (
            <div onMouseDown={this.onMouseDown} className="headlineButtonWrapper">
                <button onClick={this.onClick} className="headlineButton">
                    H
                </button>
            </div>
        )
    }
}

const inlineToolbarPlugin = createInlineToolbarPlugin()
const {InlineToolbar} = inlineToolbarPlugin
const plugins = [inlineToolbarPlugin]

class CustomInlineToolbarEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: createEditorStateWithText(this.props.value),
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.setState({
                editorState: createEditorStateWithText(this.props.value)
            });
        }
    }

    onChange = (editorState) => {
        this.setState({ editorState });
        // Call the onChange function passed from the parent component
        this.props.onChange(editorState);
    };

    focus = () => {
        this.editor.focus()
    }

    render() {
        return (
            <div className="editor" onClick={this.focus}>
                <Editor
                    editorKey="CustomInlineToolbarEditor"
                    editorState={this.state.editorState}
                    onChange={this.onChange}
                    plugins={plugins}
                    ref={element => {
                        this.editor = element
                    }}
                />
                <InlineToolbar>
                    {// may be use React.Fragment instead of div to improve perfomance after React 16
                        externalProps => (
                            <div>
                                <BoldButton {...externalProps} />
                                <ItalicButton {...externalProps} />
                                <UnderlineButton {...externalProps} />
                                <CodeButton {...externalProps} />
                                <Separator {...externalProps} />
                                {/*<HeadlinesButton {...externalProps} />*/}
                                <UnorderedListButton {...externalProps} />
                                <OrderedListButton {...externalProps} />
                                <BlockquoteButton {...externalProps} />
                                {/*<CodeBlockButton {...externalProps} />*/}
                            </div>
                        )}
                </InlineToolbar>
            </div>
        )
    }
}

export default CustomInlineToolbarEditor;
