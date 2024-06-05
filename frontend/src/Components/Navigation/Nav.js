import React, { useContext, useEffect, useState } from 'react'
import "../Navigation/Nav.css"
import SearchIcon from '@mui/icons-material/Search';
// import { Link, Navigate } from 'react-router-dom';

import SearchResultsList from '../Navigation/SearchResultsList.js';
import { AiOutlineMessage } from "react-icons/ai";
import {AiOutlineHome} from "react-icons/ai"
import {LiaUserFriendsSolid} from "react-icons/lia"
import {IoNotificationsOutline} from "react-icons/io5"
import { UserContext } from "../../App"
import { NotificationsContext } from "../../App"
import Profile from "../../assets/profile.jpg"
import Link from '@mui/material/Link';
import { Link as ReactRouterLink } from 'react-router-dom';
import { FriendsContext } from '../../App';
import {fetchFriendRequests} from "../../api/axios"
import { SearchUsers } from '../../api/services/User';


const Nav = ({search,setSearch,setShowMenu,profileImg,friendRequests}) => {
  const notifications = useContext(NotificationsContext)

  const userData = useContext(UserContext)
  const [searchResults, setSearchResult] = useState([])
  const user = useContext(UserContext)
useEffect(() => {
  console.log(notifications)
  console.log("noti: ", notifications)
},[notifications])
useEffect(()=> {
  console.log(friendRequests)
},[friendRequests])
   const handleSearch = async (query) => {
    if(query.length > 0){

        setSearch(query);
        if (!query) {
          return;
        } 
        try {
          const response = await SearchUsers(user.token, query)
          if(response.status == 200){
            
          console.log(response);
          setSearchResult(response.data.rows);
          }else{
            console.log(response) 
          }
        } catch (error) {
          console.log(error)
        }
    }else {
      setSearchResult([])
    }
    }
  return (
    <div className="nav-wrapper">
    <nav>
      <div className="n-logo">
          <Link href="/home" className='logo' style={{color:"white",textDecoration:"none"}}>
            <h1>LoTus</h1>
          </Link>
      </div>

      <div className="n-form-button" >

        <form className='n-form'  >
          <SearchIcon className='search-icon'/>
          <input type="text" 
          placeholder='Search'
          id='n-search'
          value={search}
          onChange={(e)=> {setSearch(e.target.value); handleSearch(e.target.value)}}
          />
        </form>
      </div>

      <div className="social-icons">
      <Link href="/home" style={{textDecoration:"none",display:"flex",alignItems:"center",color:"#000000"}}>
        <AiOutlineHome className='nav-icons'/>
      </Link>

      <Link component={ReactRouterLink} to="/notification"  id='notifi' style={{marginTop:"8px"}}>
        <IoNotificationsOutline className='nav-icons'/>
        {
          notifications.length && <span >{notifications.length ? notifications.length : ""}</span>
        }
      </Link>
      {/* <Link to="/notification" id='notifi' style={{marginTop:"8px"}}><IoNotificationsOutline className='nav-icons'/><span>{notifications.length}</span></Link> */}
      <Link href='/chat' style={{ textDecoration: 'none' }}>
        <AiOutlineMessage className='nav-icons' />
      </Link>
      
      <Link component={ReactRouterLink} to="/friendRequests"  id='notifi' style={{marginTop:"8px"}}> 
        <LiaUserFriendsSolid className='nav-icons' />
        {
          friendRequests.length > 0 && <span>{friendRequests.length}</span>
        }
      </Link>
      {/* <LiaUserFriendsSolid 
      className='nav-icons'
      onClick={()=>setShowMenu(true)}/> */}
      <h3> {userData.profile_name}</h3>
      </div>


       <div className="n-profile" >
          <Link to="/profile"> 
            <img src={userData ? (userData.image) : Profile} className='n-img' style={{marginBottom:"-7px"}}/>
          </Link>
      </div>
    </nav>
    <SearchResultsList className="search" searchResults={searchResults}/>
    </div>
  )
}

export default Nav