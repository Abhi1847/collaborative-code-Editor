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

// function EditorPage() {
//   const [clients, setClients] = useState([]);
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

      

//       console.log(socketRef.current.emit(ACTIONS.JOIN, {
//         roomId,
//         username: Location.state?.username,
//       }));

//       // Listen for new clients joining the chatroom
//       socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
//         // this insure that new user connected message do not display to that user itself
//         if (username !== Location.state?.username) {
//           toast.success(`${username} joined the room.`);
//         }
//         setClients(clients);
//         // also send the code to sync
//         socketRef.current.emit(ACTIONS.SYNC_CODE, {
//           code: codeRef.current,
//           socketId,
//         });
//       });

//       // listening for disconnected
//       socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
//         toast.success(`${username} left the room`);
//         setClients((prev) => {
//           return prev.filter((client) => client.socketId !== socketId);
//         });
//       });
//     };
//     init();

//     // cleanup
//     return () => {
//       socketRef.current && socketRef.current.disconnect();
//       socketRef.current.off(ACTIONS.JOINED);
//       socketRef.current.off(ACTIONS.DISCONNECTED);
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

//   return (
//     <div className="container-fluid vh-100">
//       <div className="row h-100">
//         {/* client panel */}
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

//           {/* Client list container */}
//           <div className="d-flex flex-column flex-grow-1 overflow-auto">
//             <span className="mb-2">Members</span>
            
//             {clients.map((client) => (
//               <Client key={client.socketId} username={client.username} />
//             ))}
//           </div>

//           <hr />
//           {/* Buttons */}
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

//         {/* Editor panel */}
//         <div className="col-md-10 text-light d-flex flex-column h-100 ">
//           <Editor
//             socketRef={socketRef}
//             roomId={roomId}
//             onCodeChange={(code) => {
//               codeRef.current = code;
//             }}
//           />
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
  const executeCode = async () => {
    try {
      // Send code to backend
      await axios.post('/code', { code, roomId });
      // Emit execute code action
      socketRef.current.emit(ACTIONS.EXECUTE_CODE, {
        code,
        roomId,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to execute code");
    }
  };

  // Function to handle code change
  const handleCodeChange = (code) => {
    setCode(codeRef.current = code)
    
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
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
            {/* <button
              className="btn btn-primary mt-2 mb-2 px-3 btn-block"
              onClick={executeCode}
            >
              Execute Code
            </button> */}
          </div>
        </div>

        <div className="col-md-10 text-light d-flex flex-column h-100 ">
          <Editor
            socketRef={socketRef}
            roomId={roomId}
            // onCodeChange={(code) => {
            //   codeRef.current = code;
            // }}
            onCodeChange={handleCodeChange}
          />
          <button
              className="btn btn-primary mt-2 mb-2 px-3 btn-block"
              onClick={executeCode}
            >
              Execute Code
            </button>
          <div className="mt-3">
            <h4>Output:</h4>
            <pre>{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorPage;




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
// import * as babel from '@babel/core';

// const path = require("path");

// module.exports = {
//   // Your webpack configuration settings
//   resolve: {
//     fallback: {
//       path: require.resolve("path-browserify")
//     }
//   }
// };




// function EditorPage() {
//   const [clients, setClients] = useState([]);
//   const codeRef = useRef(null);
//   const [output, setOutput] = useState('');

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

//       console.log(socketRef.current.emit(ACTIONS.JOIN, {
//         roomId,
//         username: Location.state?.username,
//       }));

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
//     };
//     init();

//     return () => {
//       socketRef.current && socketRef.current.disconnect();
//       socketRef.current.off(ACTIONS.JOINED);
//       socketRef.current.off(ACTIONS.DISCONNECTED);
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

//   // Function to handle code execution
//   const executeCode = () => {
//     // Get the JavaScript code from codeRef
//     const code = codeRef.current;

//     try {
//       // Transpile the code using Babel
//       const transpiledCode = babel.transformSync(code, {
//         presets: ['@babel/preset-env']
//       }).code;

//       // Evaluate the transpiled code
//       const output = eval(transpiledCode);

//       // Set the output state
//       setOutput(output);
//     } catch (error) {
//       console.error('Error executing code:', error);
//       setOutput('Error executing code: ' + error.message);
//     }
//   };

//   return (
//     <div className="container-fluid vh-100">
//       <div className="row h-100">
//         <div
//           className="col-md-2 bg-dark text-light d-flex flex-column h-100"
//           style={{ boxShadow: "2px 0px 4px rgba(0, 0, 0, 0.1)" }}
//         >
//           {/* Client list container */}
//           <div className="d-flex flex-column flex-grow-1 overflow-auto">
//             <span className="mb-2">Members</span>
            
//             {clients.map((client) => (
//               <Client key={client.socketId} username={client.username} />
//             ))}
//           </div>

//           <hr />
//           {/* Buttons */}
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

//         {/* Editor panel */}
//         <div className="col-md-10 text-light d-flex flex-column h-100 ">
//           <Editor
//             socketRef={socketRef}
//             roomId={roomId}
//             onCodeChange={(code) => {
//               codeRef.current = code;
//             }}
//           />
//           {/* Button to execute code */}
//           <button className="btn btn-primary mt-2" onClick={executeCode}>
//             Execute Code
//           </button>
//           {/* Output area */}
//           <div className="mt-3">
//             <h4>Output:</h4>
//             <pre>{output}</pre>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EditorPage;

