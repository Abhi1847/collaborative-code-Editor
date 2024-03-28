// import React, { useState } from "react";
// import { v4 as uuid } from "uuid";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// function Room() {
  
//   const [roomId, setRoomId] = useState("");
//   const [username, setUsername] = useState("");

//   const navigate = useNavigate();

//   const generateRoomId = (e) => {
//     e.preventDefault();
//     const Id = uuid();
//     setRoomId(Id);
//     toast.success("Room Id is generated");
//   };

//   const joinRoom = () => {
//     if (!roomId || !username) {
//       toast.error("Both the field is requried");
//       return;
//     }

//     // redirect
//     navigate(`/editor/${roomId}`, {
//       state: {
//         username,
//       },
//     });
//     toast.success("room is created");
//   };

//   // when enter then also join
//   const handleInputEnter = (e) => {
//     if (e.code === "Enter") {
//       joinRoom();
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row justify-content-center align-items-center min-vh-100">
//         <div className="col-12 col-md-6">
//           <div className="card shadow-sm p-1 mb-2  rounded">
//             <div className="card-body text-center bg-dark">
//               <img
//                 src="/images/codecast.png"
//                 alt="Logo"
//                 className="img-fluid mx-auto d-block"
//                 style={{ maxWidth: "150px" }}
//               />
//               <h4 className="card-title text-light mb-4">Enter the ROOM ID</h4>

//               <div className="form-group">
//                 <input
//                   type="text"
//                   value={roomId}
//                   onChange={(e) => setRoomId(e.target.value)}
//                   className="form-control mb-2"
//                   placeholder="ROOM ID"
//                   onKeyUp={handleInputEnter}
//                 />
//               </div>
//               <div className="form-group">
//                 <input
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   className="form-control mb-2"
//                   placeholder="USERNAME"
//                   onKeyUp={handleInputEnter}
//                 />
//               </div>
              
//               <button
//                 onClick={joinRoom}
//                 className="btn btn-success btn-lg btn-block"
//               >
//                 JOIN
//               </button>
//               <p className="mt-3 text-light">
//                 Don't have a room ID? create{" "}
//                 <span
//                   onClick={generateRoomId}
//                   className=" text-success p-2"
//                   style={{ cursor: "pointer" }}
//                 >
//                   {" "}
//                   New Room
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Room;



import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Assuming you're using axios for HTTP requests

function Room() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // New state for password

  const navigate = useNavigate();

  const generateRoomId = (e) => {
    e.preventDefault();
    const Id = uuid();
    setRoomId(Id);
    toast.success("Room Id is generated");
  };

  const joinRoom = async () => {

    
    if (!roomId || !username || !password) {
      toast.error("All fields are required");
      return;
    }
    
    

    try {
      
      await axios.post("/room", { roomId, username, password });
      navigate(`/editor/${roomId}`, { state: { username } });
      toast.success("Room created successfully");
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Error creating room. Please try again later.");
    }
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-md-6">
          <div className="card shadow-sm p-1 mb-2  rounded">
            <div className="card-body text-center bg-dark">
              <img
                src="/images/codecast.png"
                alt="Logo"
                className="img-fluid mx-auto d-block"
                style={{ maxWidth: "150px" }}
              />
              <h4 className="card-title text-light mb-4">Enter the ROOM ID</h4>

              <div className="form-group">
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="form-control mb-2"
                  placeholder="ROOM ID"
                  onKeyUp={handleInputEnter}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control mb-2"
                  placeholder="USERNAME"
                  onKeyUp={handleInputEnter}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control mb-2"
                  placeholder="PASSWORD" // Password field
                  onKeyUp={handleInputEnter}
                />
              </div>
              
              <button
                onClick={joinRoom}
                className="btn btn-success btn-lg btn-block"
              >
                JOIN
              </button>
              <p className="mt-3 text-light">
                Don't have a room ID? create{" "}
                <span
                  onClick={generateRoomId}
                  className=" text-success p-2"
                  style={{ cursor: "pointer" }}
                >
                  {" "}
                  New Room
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Room;
