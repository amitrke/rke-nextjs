import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";

export type RichTextEditorProps = {
  onEdStateChange: (state: string) => void
  initState: string
}

const RichTextEditor = (props: RichTextEditorProps) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (edState: EditorState) => {
    setEditorState(edState)
  };

  const onBlur = () => {
    const rawState = convertToRaw(editorState.getCurrentContent())
    props.onEdStateChange(JSON.stringify(rawState))
  }

  useEffect(() => {
    if (props.initState.length > 1) {
      try {
        const contentAsJson = JSON.parse(props.initState);
        const rawContent = convertFromRaw(contentAsJson);
        const editorState = EditorState.createWithContent(rawContent);
        setEditorState(editorState);
      } catch (error) {
        console.error('Failed to parse editor state:', error);
        // Reset to empty state if parsing fails
        setEditorState(EditorState.createEmpty());
      }
    }
  }, [props.initState])

  return (
    <div className="border">
      <Editor
        editorState={editorState}
        defaultEditorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={onEditorStateChange}
        onBlur={onBlur}
        toolbar={{
          options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
          inline: {
            inDropdown: false,
            options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
          },
        }}
      />
    </div>
  )
}

export default RichTextEditor;