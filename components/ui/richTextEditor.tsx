import { EditorState } from "draft-js";
import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const RichTextEditor = () => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const onEditorStateChange = (edState: EditorState) => {
        setEditorState(edState)
      };

    return (
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={onEditorStateChange}
        />
    )
}

export default RichTextEditor;