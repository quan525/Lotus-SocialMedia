import React, { useContext, useEffect, useState } from 'react'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import "./InfoFriend.css"
import { addFriend, checkRelationship, acceptRequest, removeRequest, removeFriend } from '../../../api/services/Friends';
import { UserContext } from '../../../App';
import { useAlert } from 'react-alert';
import { FriendsContext } from '../../../App';

const InfoFriends = ({val, friendsList, setShowFriendsList, friendPosts}) => {
  const { friendRequests, setFriendRequests } = useContext(FriendsContext)
  const [relationshipState, setRelationshipState] = useState([])
  const [ buttonText, setButtonText] = useState(null)
  const alert = useAlert()
  useEffect(() => {
    console.log("val: ", val)
  },[val])
  const userData = useContext(UserContext)
useEffect(() => {
  const fetchRelationship = async () => {
    const relationship = await checkRelationship(userData.token, val.user_id);
    if (relationship) {
      setRelationshipState(relationship);
      console.log(relationship)
      setButtonText(relationship?.status === 'Pending' && relationship?.person1_id === val.user_id ? 'Accept' 
      : relationship?.status === 'Pending' && relationship?.person2_id === val.user_id ? 'Pending' 
      : relationship?.status === 'Friends' ? 'Friends' : 'Error'
      )
    } else {
      setRelationshipState(null)
      setButtonText('Add Friend')
    }
  };
  fetchRelationship();
}, [val, userData.token, val.user_id]);

  useEffect(() => {
    console.log("type: ", typeof relationshipState)
  }, [relationshipState])

  const handleAcceptRequest = async () => {
    const result = await acceptRequest(userData.token, val.user_id)
    console.log(result)
  }

const handleFriendAction = async (action, token, otherUserId) => {
    let result;
    switch(action) {
      case 'Friends':
      const confirmUnfriend = window.confirm("Do you want to unfriend this person?");
      if(confirmUnfriend) {
        await removeFriend(token, otherUserId)
        setButtonText('Add Friend')
      }
      break;
      case 'Accept':
        result = await acceptRequest(token, otherUserId);

        if(result.status === 200){
          alert.success('Friend request accepted');
          setButtonText('Friends');
          setFriendRequests(friendRequests.filter((request) => request.user_id !== otherUserId));
        }else {
          alert.error(result.data)
        }
        console.log(result);
        
        break;
      case 'Pending':
        result = await removeRequest(token, otherUserId);
        setButtonText('Add Friend');
        break;
      case 'Add Friend':
        result = await addFriend(token, otherUserId);
        console.log(result);
        setButtonText('Pending');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    console.log("val" , val)
  }, [val])
  return (
    <div className='info'>
        <div className="info-cover">
            <img src={val.cover_url} alt="" />
            <img src={val.avatar_url} alt="" />
        </div>

        <div className="info-follow">
          <h1>{val.profile_name}</h1>
          <p>{val.user_id}</p>
          <button className="myButton" onClick={() => handleFriendAction(buttonText, userData.token, val.user_id)}>{buttonText}</button>




          <div className="info-details">
            <div className="info-col-1">
              {/* <div className="info-details-list"> 
                <LocationOnOutlinedIcon />
                <span></span>
              </div> */}

              <div className="info-details-list">
                <EmailOutlinedIcon />
                <span>{val?.email}</ span>
              </div>

              <div className="info-details-list">
                <CalendarMonthRoundedIcon />
                <span>Joined in {new Date(val.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            <div className="info-col-2">
              <div>
                  <span></span>
                  <h3></h3>
              </div>
              <div onClick={() => setShowFriendsList(true)}>
                <span>Friends</span>
                <h3>{friendsList?.length ? friendsList.length : 0 }</h3>
              </div>
              <div onClick={() => setShowFriendsList(false)}>
                <span>Post</span>
                <h3>{friendPosts?.length ? friendPosts.length : 0 }</h3>
              </div>
            </div>

          </div>


        </div>
    </div>
    
  )
}

export default InfoFriends