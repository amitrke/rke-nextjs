import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { useEffect, useRef, useState } from "react";
import { Editor } from "react-draft-wysiwyg";

export type RichTextEditorProps = {
  onEdStateChange: (state: string) => void
  initState: string
}

const RichTextEditor = (props: RichTextEditorProps) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const initialized = useRef(false);

  // Report every content change to the parent. Relying on onBlur lost edits,
  // because react-draft-wysiwyg only fires it for some focus changes.
  const onEditorStateChange = (edState: EditorState) => {
    const contentChanged = edState.getCurrentContent() !== editorState.getCurrentContent();
    setEditorState(edState);
    if (contentChanged) {
      props.onEdStateChange(JSON.stringify(convertToRaw(edState.getCurrentContent())));
    }
  };

  // Load the saved content once. Re-loading on every initState change would
  // reset the cursor now that each edit flows back in through initState.
  useEffect(() => {
    if (!initialized.current && props.initState.length > 1) {
      initialized.current = true;
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