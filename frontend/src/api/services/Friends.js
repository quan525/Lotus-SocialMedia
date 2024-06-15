import axios from "axios"
import API_PATHS from "../apiPath"

export const addFriend = async (token, friendId) => {
    try{
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const url = `${API_PATHS.api}/friends/${friendId}`
        const result = await axios.post(url, null, config)
        console.log(result)
    }catch (error) {
        console.log(error)
    }
}

export const removeRequest = async (token, userId) => {
    const config = {
        headers : {
            Authorization : `Bearer ${token}`
        }
    }
    const url = `${API_PATHS.api}/friends/${userId}/remove-request`
    const result = await axios.delete(url, config)
    return result
}

export const acceptRequest = async (token, userId) => {
    const config = {
        headers : {
            Authorization: `Bearer ${token}`
        }
    }
    const url = `${API_PATHS.api}/friends/${userId}/accept`
    const result = await axios.put(url, null, config)
    return result
}

export const removeFriend = async (token, userId) => {
    const config = {
        headers : {
            Authorization: `Bearer ${token}`
        }
    }
    const url = `${API_PATHS.api}/friends/${userId}/remove`
    const result = await axios.delete(url, config)
    return result
}

export const checkRelationship = async (token, userId) =>{
    try {
        const config = {
            headers : {
                Authorization: `Bearer ${token}`
            }
        }
        const url = `${API_PATHS.api}/friends/${userId}`
        const result = await axios.get(url, config)
        if(result.data.relationship.length === 0){
            return null
        }
        console.log(result.data.relationship[0])
        return result.data.relationship[0]
    }catch(error) {
        console.log(error)
    }
}


export const getUserFriends = async (token, userId) => {
    try {
        const config = {
            headers : {
                Authorization: `Bearer ${token}`
            }
        }
        const url = `${API_PATHS.api}/friends/${userId}/friends`;
        const result = await axios.get(url, config);
        return result;
    }catch(error) {
        console.log(error)
        return error;
    }
}

export const getFriends = async (token) => {
    try {
        const config = {
            headers : {
                Authorization: `Bearer ${token}`
            }       
        }
        const result = await axios.get(`${API_PATHS.api}/friends`, config);
        return result;
    } catch(error) {
        console.log(error)
        return error
    }
}

// export const refuseRequest = async(relationship_id) => {
//   const token = JSON.parse(localStorage.getItem('data')).token;
//   if(token)
//   {
//    let responseData 
//    console.log(relationship_id)
//    const url = `http://localhost:3000/api/friends/request/refuse`
//    const config = {
//      headers : {
//        "Authorization" : `Bearer ${token}`
//      },
//      data : {
//        relationshipId: relationship_id
//      } 
//    }
   
//    await axios.delete(url, config)
//    .then((res) => {
//      responseData = res
//      console.log(responseData)
//    })
//    return responseData
//   }

// }