import React from 'react'
import {Link} from 'react-router-dom'
import './nav.css'

export default function Navbar() {
  return (
    
    <div className='container1'>
    <nav>
      <div className='link'>
        <Link className="l1" to='/home'>Home</Link>
        <Link className="l1" to='/register'>Register</Link>
        <Link className="l1" to='/login'>Login</Link>
        <Link className="l1 r1" to='/room'>Room</Link>
      </div>
    </nav>
    </div>
  )
}
