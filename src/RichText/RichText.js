import React from "react";
import {DraftailEditor} from "draftail";
import {EditorState, convertToRaw, convertFromRaw} from "draft-js";
import createInlineToolbarPlugin from "draft-js-inline-toolbar-plugin";
import createSideToolbarPlugin from "draft-js-side-toolbar-plugin";

import "./draft.css";
import "draft-js/dist/Draft.css";
import "draftail/dist/draftail.css";
import "draft-js-inline-toolbar-plugin/lib/plugin.css";
import "draft-js-side-toolbar-plugin/lib/plugin.css";

const inlineToolbarPlugin = createInlineToolbarPlugin();
const {InlineToolbar} = inlineToolbarPlugin;

const sideToolbarPlugin = createSideToolbarPlugin();
const {SideToolbar} = sideToolbarPlugin;

const plugins = [inlineToolbarPlugin, sideToolbarPlugin];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty()
        };
        this.changeState = this.changeState.bind(this);
    }

    componentDidMount() {
        const { value } = this.props;
        if (value) {
            const contentState = convertFromRaw(JSON.parse(value));
            this.setState({
                editorState: EditorState.createWithContent(contentState),
            });
        }
    }

    componentDidUpdate(prevProps) {
        const { value } = this.props;
        if (value !== prevProps.value) {
            const contentState = convertFromRaw(JSON.parse(value));
            this.setState({
                editorState: EditorState.createWithContent(contentState),
            });
        }
    }

    changeState(editorState) {
        this.setState({ editorState }, () => {
            const { onChange } = this.props;
            const contentState = this.state.editorState.getCurrentContent();
            const serializedContent = JSON.stringify(convertToRaw(contentState));
            onChange(serializedContent);
        });
    }

    // changeState(state) {
    //     console.log(state)
    //     this.setState({
    //         editorState: state,
    //     });
    // }

    render() {
        return (
            <div className="App">
                <DraftailEditor
                    editorState={this.state.editorState}
                    onChange={this.changeState}
                    placeholder="Tell your story..."
                    plugins={plugins}
                />
                <InlineToolbar/>
                <SideToolbar/>
            </div>
        );
    }
}

export default App;
