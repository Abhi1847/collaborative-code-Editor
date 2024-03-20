import './App.css';
import { Routes, Route } from "react-router-dom";
import Room from './pages/Room';
import Navbar from '../src/components/Navbar'
import Home from '../src/pages/Home'
import Register from './pages/Register';
import Login from './pages/Login';
// import Dashboard from './pages/Dashboard'
import axios from 'axios'
import EditorPage from './components/EditorPage';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from './context/useContext';
import CodeEdit from './pages/CodeEdit';
// import Editor from './components/Editor';

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials=true;
function App() {
  return (
    <>
    <UserContextProvider>
      <Navbar />
      <Toaster position='top-center' toastOptions={{duration:2000}} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        {/* <Route path='/dashboard' element={<Dashboard />} /> */}
        <Route path='/room' element={ <Room /> } />
        <Route path='/editor/:roomId' element={ <EditorPage /> } />
        {/* <Route path='/editor' element={ <Editor /> } /> */}
        {/* <Route path='/codeeditor' element={ <CodeEditor /> } /> */}
        <Route path='/codeeditor' element={<CodeEdit />}></Route>
      </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;
