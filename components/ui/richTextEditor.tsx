import { EditorState, convertToRaw } from "draft-js";
import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export type RichTextEditorProps = {
  onEdStateChange: (state: string) => void
}

const RichTextEditor = (props: RichTextEditorProps) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (edState: EditorState) => {
    setEditorState(edState)
    const rawState = convertToRaw(edState.getCurrentContent())
    props.onEdStateChange(JSON.stringify(rawState))
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