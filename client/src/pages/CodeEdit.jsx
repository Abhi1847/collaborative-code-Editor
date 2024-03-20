import React from 'react'
import { useEffect , useState , useRef } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css'; // Or any theme you prefer
import CodeMirror from 'codemirror'; // Import CodeMirror

const CodeEdit = () => {
  const editorRef = useRef(null); // Ref for the CodeMirror element
  const [code, setCode] = useState('');
  const [editor, setEditor] = useState(null); // State to store the CodeMirror instance

  useEffect(() => {
    if (!editor && editorRef.current) {
      const newEditor = CodeMirror(editorRef.current, {
        value: code,
        lineNumbers: true, // Enable line numbers
        theme: 'material', // Or your chosen theme
        mode: 'javascript', // Or any supported language mode
        direction: 'ltr', // Explicitly set text direction to left-to-right (LTR)
        height:'100%'
      });

      newEditor.on('change', (cm) => {
        const newCode = cm.getValue();
        setCode(newCode);
      });

      setEditor(newEditor); // Set the CodeMirror instance in the state
    }
  }, [editor, code]);

  useEffect(() => {
    // Update CodeMirror content when the 'code' state changes
    if (editor && editor.getValue() !== code) {
      // Avoid updating CodeMirror if its value is already the same as 'code'
      editor.setValue(code);
    }
  }, [code, editor]);

  return (
    <div>  
      <div ref={editorRef}></div> 
    </div>
  )
}

export default CodeEdit

