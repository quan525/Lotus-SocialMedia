import React, { useContext, useEffect, useState } from 'react'
import InfoFriends from './FriendsProfileInfo/InfoFriends'
import InfoFriendPost from './FriendsProfileInfo/InfoFriendPost'
import { useParams } from 'react-router-dom';

import axios from 'axios'
import { UserContext } from '../../App'
import { getUserFriends } from '../../api/services/Friends'
import API_PATHS from '../../api/apiPath';

const FriendsProfileMiddle = ({userId, friendProfile}) => {
  const user = useContext(UserContext)
  const [friendPosts, setFriendPosts] = useState([])
  const [showFriendsList, setShowFriendsList] = useState(false)
  const [friendsList, setFriendsList] = useState([])

  useEffect(() => {
    setFriendPosts([]);
    const fetchData = async () => {
      const token = user.token;

      const config = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
      };

      if (userId && user?.token) {
        try {
          const response = await axios.get(`${API_PATHS.api}/post/user/` + userId + "/posts", config);
          console.log(response)
          setFriendPosts(response.data);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      }
    }

    fetchData();
  }, [userId, user]);;


  useEffect(() => {
    console.log(friendProfile)
  },[friendProfile])

  useEffect(() => {
    console.log(friendPosts)
  },[friendPosts])
  useEffect(() => {
    const fetchFriends = async () => {
      const token = user.token;

      const result = await getUserFriends(token, userId);
      console.log(result)
      if(result){
        console.log(result)
        setFriendsList(result.data)
      }
    }
    if(user?.token && userId){
      fetchFriends();
    }
  }, [userId, user])
  return (
    <div >
      {friendProfile && <InfoFriends val={friendProfile} friendsList={friendsList} setShowFriendsList={setShowFriendsList} friendPosts={friendPosts}/>}

      {friendPosts && friendPosts.length > 0 ? 
        friendPosts.map((val)=>(
        <InfoFriendPost val={val} key={val.post_id}/>
        )) : <p style={{textAlign:"center",marginTop:"40px"}}>
            There are no posts to display.
        </p>
      }
    </div>
  )
}

export default FriendsProfileMiddle
