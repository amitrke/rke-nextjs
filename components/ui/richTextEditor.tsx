import { EditorState } from "draft-js";
import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Form } from 'react-bootstrap'

const RichTextEditor = () => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const onEditorStateChange = (edState: EditorState) => {
        setEditorState(edState)
      };

    return (
      <div className="border">
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={onEditorStateChange}
        />
      </div>
    )
}

export default RichTextEditor;