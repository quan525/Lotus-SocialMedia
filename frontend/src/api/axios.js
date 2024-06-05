import axios from 'axios';
import API_PATHS from './apiPath'
export const fetchFriendRequests = async (token) => {
  const url = `${API_PATHS}/api/friends/friend-requests`;
  const config = {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  };
  let responseData;
  await axios.get(url, config)
    .then((response) => {
      console.log(response)
      responseData = response.data;
    })
    .catch((error) => {
      console.error("Error fetching friend requests:", error);
    });

  return responseData;
};

export const acceptRequest = async (token, friendId) => {
  let responseData
  const url = `${API_PATHS}/api/friends/${friendId}/accept`;
  const config =  { 
    headers: {"Authorization" : `Bearer ${token}` }
  } 
  await axios.put(url, null, config)
  .then((res) => {
    responseData = res
    console.log(res)
    
  }).catch((error) => {
    console.error("Error accept friend request:", error);
  });
  return responseData
}

