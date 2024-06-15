// FriendRequest.js
import React, { useContext, useState} from 'react';
import { Link } from 'react-router-dom';
import { removeRequest, acceptRequest } from '../../api/services/Friends';
import './FriendRequests.css';
import { UserContext } from '../../App';



const Request = ({ request, handleFriendsId, friendRequests, setFriendRequests }) => {
    const user = useContext(UserContext)
    const [accept, setAccept] = useState(false)
    const [refuse, setRefuse] = useState(false)
    const handleAcceptRequest = async () => {
        setAccept(true)
        setRefuse(false)
        await acceptRequest(user.token, request.user_id)
    }
    const handleRefuseRequest = async (userId)=> {
      setRefuse(true)
      setAccept(false)
      await removeRequest(user.token, request.user_id)
      setFriendRequests(friendRequests.filter(request => request.user_id != userId))
    }
  return (
    <div className="notification-section" key={request.user_id}>
      <div className="notification-msg">
        <Link to={{pathname: `/users/${user.user_id}`}} style={{textDecoration:"none"}}>
          <img 
            src={request.avatar_url} 
            alt="" 
            onClick={() => handleFriendsId(request.user_id ? request.user_id : null)} 
          />
        </Link>
        <p>
          {request.profile_name} 
          {/* <small>{handleDateDiff(request.created_at)}</small> */}
          <div style={{marginTop:"5px"}}>
          { !accept && !refuse ?
          <>
            <button 
              className='accept-button' 
              onClick={() => handleAcceptRequest(request.user_id)}
            >
              Accept
            </button>
            {"    "}
            <button 
              className='delete-button' 
              onClick={() => handleRefuseRequest(request.user_id)}
            >
              Delete
            </button>
            </>
            : accept ? <button disabled
              className='accept-button' 
            >
              Accepted
            </button>
            : refuse ? <button disabled style={{backgroundImage:"red"}}
              className='refuse-button' 
            >
              Refused
            </button>
            : null
            }
          </div>
        </p>
      </div>
    </div>
  );
};

export default Request;