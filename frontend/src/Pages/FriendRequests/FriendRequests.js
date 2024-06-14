import React, { useState, useEffect, useContext } from 'react'
import "../FriendRequests/FriendRequests.css"
import {AiOutlineHome} from "react-icons/ai"
import ProfileImg from "../../assets/profile.jpg"
import { Link } from 'react-router-dom'

import { UserContext } from '../../App'
import { handleAcceptRequest, handleRefuseRequest, fetchFriendRequests } from '../../api/axios'
import Request from './Request';

import axios from 'axios'
import { handleDateDiff } from '../../Components/Home/Post'
const FriendRequests = ({setFriendsProfile, friendRequests, setFriendRequests}) => {
  
  const userData = useContext(UserContext)
  
  useEffect(() => {
    if (userData.token) {
      fetchFriendRequests(userData.token)
        .then(res => {
          setFriendRequests(request => {
              if(Array.isArray(res)) {
              const uniqueRes = res?.filter(r => !request.some(req => req.user_id === r.user_id));
              return [...request, ...uniqueRes];
            }
          });        
        })
        .catch(error => {
          console.error("Error fetching friend requests:", error);
        });
    }
  }, [userData.token]);

  useEffect(() => {
    console.log(friendRequests)
  },[ friendRequests])

    const handleFriendsId=(id)=>{
      const friendsIdFilter = friendRequests.filter(val => {
        return val.user_id === id;
      })
      setFriendsProfile(friendsIdFilter)
   }

  return (

    <div className="noti-overall">
      <div className='nav-section'>
        <Link to="/home" style={{textDecoration:"none"}} className='noti-div'><AiOutlineHome className='noti-Home-Icon'/></Link>
        <Link to="/profile" style={{textDecoration:"none"}}><img src={userData.image} alt="" /></Link>
      </div>


  { (friendRequests) ? (
      <div className="notification-group">
              <h1>Request</h1>
              {friendRequests ? (
                friendRequests?.map((request) => (
                  <Request request={request} handleFriendsId={handleFriendsId} setFriendRequests={setFriendRequests} friendRequests={friendRequests} />
                ))
              ) : (
                <div className='loading'>           
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              )}
      </div>)
         : (
    <div className='loading'>           
      <div></div>
      <div></div>
      <div></div>
    </div>
  )}
</div>
       
)}

export default FriendRequests