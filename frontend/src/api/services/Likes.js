import axios from 'axios'
import API_PATHS from '../apiPath'

export const LikePost = async (token, postId) => {
    const response = await axios.post(`${API_PATHS.api}/like/${postId}`, null ,{
        headers: {
            Authorization : `Bearer ${token}`
        }
    })
    console.log(response)
    return response
}

export const UnLikePost = async (token, postId) => {
    const response = await axios.delete(`${API_PATHS.api}/like/${postId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    
    return response
}