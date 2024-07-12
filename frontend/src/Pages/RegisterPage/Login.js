import React, { useEffect, useState, useContext } from 'react'
import {FiMail} from "react-icons/fi"
import {RiLockPasswordLine} from "react-icons/ri"
import "../RegisterPage/RegisterPage.css"
import { Link, useNavigate } from 'react-router-dom'
import { LoginContext } from '../../App';
import { useAlert } from 'react-alert'

import API_PATHS from '../../api/apiPath'
import axios from 'axios';
import { ForgotPassword } from '../../api/services/User'

const Login = () => {
    const alert = useAlert()
    const navigate =useNavigate()
    const [error,setError] =useState({})
    const [submit,setSubmit] =useState(false)
    const { isLoggedIn , setLoggedIn } = useContext(LoginContext);
    const [data,setData] =useState({
        username:"",
        password:"",
    }) 

    const handleChange=(e)=>{
        const newObj={...data,[e.target.name]:e.target.value}
        setData(newObj)
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const errors = validationLogin(data);
        setError(errors);

        if (Object.keys(errors).length === 0) {
            axios.post(`${API_PATHS.login}/login`, data)
            .then(response => {
                console.log(response.data);
                localStorage.setItem("data", JSON.stringify(response.data));
                const storedData = JSON.parse(localStorage.getItem("data"));
                console.log(storedData);
                setLoggedIn(true);
                navigate('/home')
            })
            .catch(error => {
                if(error.response.status === 401){
                    alert.error("Invalid username or password")
                }else if(error.response.status === 500){
                    alert.error("Server error")
                }else{
                    alert.show("Login failed. Please try again.")
                }
                console.log('Login failed', error);
                // handle failed login here
            });
        }
    }

    function validationLogin(data){
        const error ={}

        const emailPattern= /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        const passwordPattern= /^[a-zA-Z0-9!@#\$%\^\&*_=+-]{8,20}$/g;

        // if(data.email === ""){
        //     error.email ="* Email is Required"
        // }
        // else if(!emailPattern.test(data.email)){
        //     error.email="* Email did not match"
        // }
        if(data.username === ""){
            error.username = "* Username is Required"
        }
        // if(data.username?.length < 6) {
        //     error.username = "* Username must be at least 6 characters long"
        // }
        
        if(data.password === ""){
            error.password = "* Password is Required"
        }
        else if(!passwordPattern.test(data.password)){
            error.password="* Password not valid"
        }
        
        return error
   }

    const handleForgotPassword = async (e) => {
        e.preventDefault()
            if(data.username === ""){ 
            setError({username: "* Enter username to reset password"});               
            alert.show("* Enter username to reset password");
            return;
        }
        setError({}); 
        const rootUrl = window.location.origin.toString()
        console.log("Forgot password");
        try {
            await ForgotPassword(data.username, rootUrl)
            .then(res => 
                {
                    console.log(res)
                    if(res && res.ok){
                        alert.show('Request was successful');
                    } else {
                        alert.show(res ? res.data : 'No response received');
                    } 
                }
             );
        } catch (error) {
            console.error(error);
            alert.show(alert.response.data);
        }
    }

  return (
    <div className="container">
        <div className="container-form">
            <form onSubmit={handleLogin}>
                <h1>Login</h1>
                <p>Please sign in to continue.</p>
                <div className="inputBox">
                    <FiMail className='mail'/>
                    <input type="text" 
                            name="username" 
                            id="email" 
                            onChange={handleChange}
                            placeholder='Username'/> 
                </div>
                {/* {error.email && <span style={{color:"red",display:"block",marginTop:"5px"}}>{error.email}</span>} */}
                {error.username && <span style={{color:"red",display:"block",marginTop:"5px"}}>{error.username}</span>}

                <div className="inputBox" >
                    <RiLockPasswordLine className='password'/>
                    <input type="password" 
                            name="password" 
                            id="password" 
                            onChange={handleChange}
                            placeholder='Password'/>
                </div>
                {error.password && <span style={{color:"red",display:"block",marginTop:"5px"}}>{error.password}</span>}
               

                <div className='divBtn'>
                    <small className='FG'  onClick={handleForgotPassword}>Forgot Password?</small>
                    <button type='submit' className='loginBtn'>LOGIN</button>
                </div>
                
            </form>

            <div className='dont'>
                <p>Don't have an account? <Link to="/signup"><span>Sign up</span></Link></p>
            </div>
        </div>
    </div>
  )
}

export default Login