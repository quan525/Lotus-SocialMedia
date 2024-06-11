import React, { useContext, useEffect } from 'react'
import "../Notification/Notification.css"
import {AiOutlineHome} from "react-icons/ai"
import ProfileImg from "../../assets/profile.jpg"
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../App'
const Notification = ({notifications}) => {
  const navigate = useNavigate()
  const userData = useContext(UserContext)

  // const handleNavigate = (noti) => {
  //   if(noti.noti_type == "LIKE_POST" || noti.noti_type == "COMMENT_POST")
  //   {
  //     navigate(`/post/${noti._id}`)
  //   }
  // }  

  useEffect(()=>{
    console.log(notifications)
  }, [notifications])
  return (
    <div className="noti-overall">
      <div className='nav-section'>
        <Link to="/home" style={{textDecoration:"none"}} className='noti-div'><AiOutlineHome className='noti-Home-Icon'/></Link>
        <Link to="/profile" style={{textDecoration:"none"}}><img src={userData.image} alt="" /></Link>
      </div>

    <div className="notification-group">
      <h1>notification</h1>
      <div className="notification-section">
        {
          notifications != null && notifications.map((notification) => {
            return (
              <div className="notification-msg" >
                <img src={notification.avatar_url} onClick={()=> navigate(`/users/${notification.sender_id}`)} alt="" />
                { notification.noti_type === 'LIKE_POST' ? <p>{notification.sender_name} liked <span className='noti-like'>your post</span><small><br />{notification.timestamp}</small></p> 
                : notification.noti_type === 'COMMENT_POST' ? <p>{notification.sender_name} commented on <span className='noti-like'>your post</span><small><br />{notification.timestamp}</small></p> 
                : notification.noti_type === 'NEW_FOLLOWER' ? <p>{notification.sender_name} started following you<small><br />{notification.timestamp}</small></p> 
                : notification.noti_type === 'ACCEPT_REQUEST' ? <p>{notification.sender_name} accepted your request<small><br />{notification.timestamp}</small></p> 
                : null}
              </div>
            )
          
          })
        }


      </div>
    </div>
    </div>
  )
}

export default Notification