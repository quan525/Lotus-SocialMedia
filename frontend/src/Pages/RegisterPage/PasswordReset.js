import React, { useEffect, useState, useContext } from 'react'
import {FiMail} from "react-icons/fi"
import {RiLockPasswordLine} from "react-icons/ri"
import "../RegisterPage/RegisterPage.css"
import { Link, useNavigate } from 'react-router-dom'
import { LoginContext } from '../../App';
import { useAlert } from 'react-alert'

import API_PATHS from '../../api/apiPath'
import axios from 'axios';

const PasswordReset = () => {
    const [error, setError] = useState({})
    const [data, setData] = useState({
        password: "",
        checkPassword: "",
    })

    const handleChange = (e) => {
        const newObj = {...data, [e.target.name]: e.target.value}
        setData(newObj)
    }

    const handleSubmit = async (e) => {
    }
    
    return (
          <div className="container">
          <div className="container-form">
              <form >
                  <h1>Reset password</h1>

                  <div className="inputBox" >
                      <RiLockPasswordLine className='password'/>
                      <input type="password" 
                              name="password" 
                              id="password" 
                              onChange={handleChange}
                              placeholder='Password'/>
                  </div>
                  {error.password && <span style={{color:"red",display:"block",marginTop:"5px"}}>{error.password}</span>}

                  <div className="inputBox">
                      <FiMail className='password'/>
                      <input type="text" 
                              name="checkPassword" 
                              id="checkPassword" 
                              onChange={handleChange}
                              placeholder='checkPassword'/> 
                  </div>
                  {/* {error.email && <span style={{color:"red",display:"block",marginTop:"5px"}}>{error.email}</span>} */}
                  {error.checkPassword && <span style={{color:"red",display:"block",marginTop:"5px"}}>{error.checkPassword}</span>}

                  <div className='divBtn'>
                      <button type='submit' className='loginBtn' onClick={handleSubmit}>Reset Password</button>
                  </div>

              </form>
          </div>
      </div>
    )
}

export default PasswordReset