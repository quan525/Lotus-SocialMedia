import React, { useState, useEffect, useContext } from 'react'
import "../FriendsList/FriendBox.css"
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { removeFriend } from '../../api/services/Friends';
import { UserContext } from '../../App';
//  onClick={()=>handleFriendsId(post.user_id ? post.user_id : null)} 

const FriendBox = ({friend, friendsList, setFriendsList}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const user = useContext(UserContext)
  useEffect(()=> {
      console.log("friend: ", friend)
  },[])

  const handleUnfriend = () => {
    confirmAlert({
      title: 'Confirm to unfriend',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            await removeFriend(user.token, friend.user_id)
            .then(res => {
              console.log(res)
            })
              setFriendsList(friendsList.filter(friendUser => friendUser.user_id !== friend.user_id))
            setSelectedOption(""); // reset the selected option
          }
        },
        {
          label: 'No',
          onClick: () => {
            setSelectedOption(""); // reset the selected option
          }
        }
      ]
    });
  };

  return (      
    <>
      <div className='friend-header'>
            <div className='friend-item' style={{ cursor: "pointer" }}>
              <Link to={friend.user_id ? `/users/${friend.user_id}` : '#'} style={{ textDecoration: "none", width: '70px',height: "70px",borderRadius: "50%"}} key={friend.user_id}>
                <img src={friend.avatar_url} alt={friend.profile_name} /> 
              </Link>
              <h3>{friend.profile_name}</h3>
            </div>
            <select  value={selectedOption} onChange={(e) => {
                setSelectedOption(e.target.value);
                if (e.target.value === '1') {
                    handleUnfriend();
                }
            }}>  
                <option value="" disabled selected>Options</option>
                <option value="1">Unfriend</option>
            </select>                        
            
      </div>
    </> 
  )
}

export default FriendBox 