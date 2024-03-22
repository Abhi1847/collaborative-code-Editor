import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Assuming your CSS file is named Register.css and is located in the same directory as your Register component

export default function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const registerUser = async (e) => {
    e.preventDefault();
    const { name, email, password } = data;
    try {
      const { data } = await axios.post('/register', {
        name,
        email,
        password
      });

      if (data.error) {
        toast.error(data.error);
      } else {
        setData({});
        toast.success('Register Successfully...');
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className='inner'>
      <form onSubmit={registerUser} className='forms'>
        <label className="label">Name:</label>
        <input
          type="text"
          className="input"
          placeholder="Enter Your Name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

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
          Register
        </button>
      </form>
      </div>
    </div>
  );
}
