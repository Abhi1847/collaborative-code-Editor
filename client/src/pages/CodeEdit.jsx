import React, { useEffect, useState, useRef } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css'; // Or any theme you prefer
import CodeMirror from 'codemirror'; // Import CodeMirror

const CodeEdit = () => {
  const editorRef = useRef(null); // Ref for the CodeMirror element
  const [code, setCode] = useState('');
  const [editor, setEditor] = useState(null); // State to store the CodeMirror instance
  const [output, setOutput] = useState(''); // State to store the output

  useEffect(() => {
    if (!editor && editorRef.current) {
      const newEditor = CodeMirror(editorRef.current, {
        value: code,
        lineNumbers: true, // Enable line numbers
        theme: 'material', // Or your chosen theme
        mode: 'javascript', // Or any supported language mode
        direction: 'ltr', // Explicitly set text direction to left-to-right (LTR)
        height: '100%'
      });

      newEditor.on('change', (cm) => {
        const newCode = cm.getValue();
        setCode(newCode);
      });

      setEditor(newEditor); // Set the CodeMirror instance in the state
    }
  }, [editor, code]);

  const executeCode = () => {
    try {
      let capturedOutput = ''; // Variable to capture the output
      const originalLog = console.log; // Save the original console.log function

      // Override console.log to capture the output
      console.log = (...args) => {
        capturedOutput += args.join(' ') + '\n';
      };

      // Execute the code using eval
      eval(code);

      // Restore the original console.log function
      console.log = originalLog;

      // Update the output state with the captured output
      setOutput(capturedOutput);
    } catch (error) {
      // Set error message if execution fails
      setOutput(`Error: ${error.message}\n`);
    }
  };

  return (
    <>
      <div>
        <div ref={editorRef} style={{ height: "100%" }}></div>
        <button
          className="btn btn-primary mt-2 mb-2 px-5 btn-block"
          onClick={executeCode} // Call executeCode function on button click
        >
          Execute Code
        </button>

      </div>
      <div className="mt-3">
        <h4 style={{ height: "290px", backgroundColor: "gray" }}>Output: <pre key={output}>{output}</pre></h4>
         
      </div>
    </>
  )
}

export default CodeEdit;
