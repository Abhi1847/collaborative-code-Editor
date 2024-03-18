import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Navbar from '../src/components/Navbar'
// import Home from '../src/pages/Home'
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'
import axios from 'axios'
import EditorPage from './components/EditorPage';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from './context/useContext';


axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials=true;
function App() {
  return (
    <>
    {/* <div>
      <Toaster  position='top-center'></Toaster>
    </div>
    <Routes>
     <Route path='/' element={ <Home /> } />
     <Route path='/editor/:roomId' element={ <EditorPage /> } />
    </Routes> */}
    <UserContextProvider>
      <Navbar />
      <Toaster position='top-center' toastOptions={{duration:2000}} />
      <Routes>
        {/* <Route path='/' element={<Home />} /> */}
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/home' element={ <Home /> } />
        <Route path='/editor/:roomId' element={ <EditorPage /> } />
      </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;
