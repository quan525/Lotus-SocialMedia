import axios from 'axios';
import API_PATHS from './apiPath'
export const fetchFriendRequests = async (token) => {
  const url = `${API_PATHS.api}/friends/friend-requests`;
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
      return error
    });

  return responseData;
};

