import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Assuming your CSS file is named Login.css and is located in the same directory as your Login component

export default function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;
    try {
      const { data } = await axios.post('/login', {
        email,
        password
      });

      if (data.error) {
        toast.error(data.error);
      } else {
        setData({});
        toast.success('Login Successfully...');
        navigate('/codeeditor');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className='inner'>
      <form onSubmit={loginUser} className='forms'>
        <label className="label">E-mail:</label>
        <input
          type="email"
          className="input"
          placeholder="Enter Your Email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <label className="label">Password:</label>
        <input
          type="password"
          className="input"
          placeholder="Enter Your Password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <button type="submit" className="button">
          Login
        </button>
      </form>
      </div>
    </div>
  );
}
