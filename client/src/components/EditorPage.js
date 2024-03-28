// import React, { useEffect, useRef, useState } from "react";
// import Client from "../components/Client";
// import Editor from "./Editor";
// import { initSocket } from "../Socket";
// import { ACTIONS } from "../Actions";
// import {
//   useNavigate,
//   useLocation,
//   Navigate,
//   useParams,
// } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import axios from 'axios'

// function EditorPage() {
//   const [clients, setClients] = useState([]);
//   const [output, setOutput] = useState("");
//   const [code, setCode] = useState(""); 
//   const codeRef = useRef(null);

//   const Location = useLocation();
//   const navigate = useNavigate();
//   const { roomId } = useParams();

//   const socketRef = useRef(null);

//   useEffect(() => {
//     const init = async () => {
//       const handleErrors = (err) => {
//         console.log("Error", err);
//         toast.error("Socket connection failed, Try again later");
//         navigate("/");
//       };

//       socketRef.current = await initSocket();
//       socketRef.current.on("connect_error", handleErrors);
//       socketRef.current.on("connect_failed", handleErrors);

//       socketRef.current.emit(ACTIONS.JOIN, {
//         roomId,
//         username: Location.state?.username,
//       });

//       socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
//         if (username !== Location.state?.username) {
//           toast.success(`${username} joined the room.`);
//         }
//         setClients(clients);
//         socketRef.current.emit(ACTIONS.SYNC_CODE, {
//           code: codeRef.current,
//           socketId,
//         });
//       });

//       socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
//         toast.success(`${username} left the room`);
//         setClients((prev) => {
//           return prev.filter((client) => client.socketId !== socketId);
//         });
//       });

//       // Listen for code execution results
//       socketRef.current.on(ACTIONS.CODE_EXECUTED, ({ output }) => {
//         console.log("Code executed, output received:", output);
//         setOutput(output);
//       });
//     };
//     init();

//     return () => {
//       socketRef.current && socketRef.current.disconnect();
//       socketRef.current.off(ACTIONS.JOINED);
//       socketRef.current.off(ACTIONS.DISCONNECTED);
//       socketRef.current.off(ACTIONS.CODE_EXECUTED);
//     };
//   }, []);

//   if (!Location.state) {
//     return <Navigate to="/" />;
//   }

//   const copyRoomId = async () => {
//     try {
//       await navigator.clipboard.writeText(roomId);
//       toast.success(`Room ID copied.`);
//     } catch (error) {
//       console.log(error);
//       toast.error("Unable to copy the Room ID.");
//     }
//   };

//   const leaveRoom = async () => {
//     navigate("/");
//   };

//   // Function to execute the code
//   const executeCode = () => {
//     try {
//       let capturedOutput = ''; // Variable to capture the output
//       const originalLog = console.log; // Save the original console.log function

//       // Override console.log to capture the output
//       console.log = (...args) => {
//         capturedOutput += args.join(' ') + '\n';
//       };

//       // Execute the code using eval
//       eval(code);

//       // Restore the original console.log function
//       console.log = originalLog;

//       // Update the output state with the captured output
//       setOutput(capturedOutput);
//     } catch (error) {
//       // Set error message if execution fails
//       setOutput(`Error: ${error.message}\n`);
//     }
//   };

//   // Function to handle code change
//   const handleCodeChange = (code) => {
//     setCode(codeRef.current = code)
//   };

//   return (
//     <div className="container-fluid vh-100">
//       <div className="row h-100">
//         <div
//           className="col-md-2 bg-dark text-light d-flex flex-column h-100"
//           style={{ boxShadow: "2px 0px 4px rgba(0, 0, 0, 0.1)" }}
//         >
//           <img
//             src="/images/codecast.png"
//             alt="Logo"
//             className="img-fluid mx-auto"
//             style={{ maxWidth: "150px", marginTop: "-43px" }}
//           />
//           <hr style={{ marginTop: "-3rem" }} />

//           <div className="d-flex flex-column flex-grow-1 overflow-auto">
//             <span className="mb-2">Members</span>
//             {clients.map((client) => (
//               <Client key={client.socketId} username={client.username} />
//             ))}
//           </div>

//           <hr />
//           <div className="mt-auto ">
//             <button className="btn btn-success" onClick={copyRoomId}>
//               Copy Room ID
//             </button>
//             <button
//               className="btn btn-danger mt-2 mb-2 px-3 btn-block"
//               onClick={leaveRoom}
//             >
//               Leave Room
//             </button>
//           </div>
//         </div>

//         <div className="col-md-10 text-light d-flex flex-column h-100 ">
//           <Editor
//             socketRef={socketRef}
//             roomId={roomId}
//             onCodeChange={handleCodeChange}
//           />
//           <button
//             className="btn btn-primary mt-2 mb-2 px-3 btn-block"
//             onClick={executeCode}
//           >
//             Execute Code
//           </button>
//           <div className="mt-3">
//             <h4>Output:<pre>{output}</pre></h4>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EditorPage;

import React, { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editor from "./Editor";
import { initSocket } from "../Socket";
import { ACTIONS } from "../Actions";
import {
  useNavigate,
  useLocation,
  Navigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from 'axios'

function EditorPage() {
  const [clients, setClients] = useState([]);
  const [output, setOutput] = useState("");
  const [code, setCode] = useState(""); 
  const codeRef = useRef(null);

  const Location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();

  const socketRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const handleErrors = (err) => {
        console.log("Error", err);
        toast.error("Socket connection failed, Try again later");
        navigate("/");
      };

      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", handleErrors);
      socketRef.current.on("connect_failed", handleErrors);

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: Location.state?.username,
      });

      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== Location.state?.username) {
          toast.success(`${username} joined the room.`);
        }
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        });
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });

      // Listen for code execution results
      socketRef.current.on(ACTIONS.CODE_EXECUTED, ({ output }) => {
        console.log("Code executed, output received:", output);
        setOutput(output);
      });
    };
    init();

    return () => {
      socketRef.current && socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.off(ACTIONS.CODE_EXECUTED);
    };
  }, []);

  if (!Location.state) {
    return <Navigate to="/" />;
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success(`Room ID copied.`);
    } catch (error) {
      console.log(error);
      toast.error("Unable to copy the Room ID.");
    }
  };

  const leaveRoom = async () => {
    navigate("/");
  };

  // Function to execute the code
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

  // Function to handle code change
  const handleCodeChange = (code) => {
    setCode(codeRef.current = code)
  };

  // Function to save the code
  const saveCode = async () => {
    try {
      
      const response = await axios.post('/saveCoderoom', { code , roomId});
      
      if (response.data.success) {
        alert('Code saved successfully!');
      } else {
        alert('Failed to save code');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to save code.');
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left panel */}
        <div
          className="col-md-2 bg-dark text-light d-flex flex-column h-100"
          style={{ boxShadow: "2px 0px 4px rgba(0, 0, 0, 0.1)" }}
        >
          <img
            src="/images/codecast.png"
            alt="Logo"
            className="img-fluid mx-auto"
            style={{ maxWidth: "150px", marginTop: "-43px" }}
          />
          <hr style={{ marginTop: "-3rem" }} />

          <div className="d-flex flex-column flex-grow-1 overflow-auto">
            <span className="mb-2">Members</span>
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>

          <hr />
          <div className="mt-auto ">
            <button className="btn btn-success" onClick={copyRoomId}>
              Copy Room ID
            </button>
            <button
              className="btn btn-danger mt-2 mb-2 px-3 btn-block"
              onClick={leaveRoom}
            >
              Leave Room
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="col-md-10 text-light d-flex flex-column h-100">
          {/* Editor */}
          <Editor
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={handleCodeChange}
          />

          {/* Action buttons */}
          <div className="d-flex align-items-center mt-2">
            <button
              className="btn btn-primary mr-2 px-3"
              onClick={executeCode}
            >
              Execute Code
            </button>
            <button
              className="btn btn-success mr-2 px-3"
              onClick={saveCode}
            >
              Save Code
            </button>
          </div>

          {/* Output */}
          <div className="mt-3">
            <h4>Output:<pre>{output}</pre></h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorPage;







