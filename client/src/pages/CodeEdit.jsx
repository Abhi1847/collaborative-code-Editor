import React, { useEffect, useState, useRef, useContext } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import CodeMirror from 'codemirror';
import axios from 'axios'; // Import axios for making HTTP requests
import { UserContext } from '../context/useContext';


const CodeEdit = () => {
  const { user } = useContext(UserContext);
  const editorRef = useRef(null);
  const [code, setCode] = useState('');
  const [editor, setEditor] = useState(null);
  const [output, setOutput] = useState('');

  useEffect(() => {
    if (!editor && editorRef.current) {
      const newEditor = CodeMirror(editorRef.current, {
        value: code,
        lineNumbers: true,
        theme: 'material',
        mode: 'javascript',
        direction: 'ltr',
        height: '100%'
      });

      newEditor.on('change', (cm) => {
        const newCode = cm.getValue();
        setCode(newCode);
      });

      setEditor(newEditor);
    }
  }, [editor, code]);

  const executeCode = () => {
    try {
      let capturedOutput = '';
      const originalLog = console.log;

      console.log = (...args) => {
        capturedOutput += args.join(' ') + '\n';
      };

      eval(code);

      console.log = originalLog;

      setOutput(capturedOutput);
    } catch (error) {
      setOutput(`Error: ${error.message}\n`);
    }
  };

  const saveCode = async () => {
    try {
      
      const id = user.id
      
      // Make an HTTP POST request to save the code
      const response = await axios.post('/savecode', { code ,id });

      if (response.data.success) {
        alert('Code saved successfully!');
      } else {
        alert('Failed to save code');
      }
    } catch (error) {
      console.error('Error saving code:', error);
      alert('Error saving code. Please try again later.');
    }
  };

  return (
    <>
      <div>
        <div ref={editorRef} style={{ height: "100%" }}></div>
        <button
          className="btn btn-primary mt-2 mb-2 px-5 btn-block"
          onClick={executeCode}
        >
          Execute Code
        </button>
        <button
          className="btn btn-success mt-2 mb-2 px-5 btn-block"
          onClick={saveCode}
        >
          Save Code
        </button>
      </div>
      <div className="mt-3">
        <h4 style={{ height: "290px", backgroundColor: "gray" }}>Output: <br></br><pre key={output}>{output}</pre></h4>
      </div>
    </>
  )
}

export default CodeEdit;
