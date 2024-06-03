import axios from "axios"
import API_PATHS from "../apiPath"

export const getSingleUser = async (token, userId) => {
    const config = {
        headers : {
            Authorization : `Bearer ${token}`
        }
    }
    const result = await axios.get(`${API_PATHS.api}/users/${userId}`, config)
    return result;
}

export const SearchUsers = async (token, searchParam) => {
    const config = {
        headers : {
            Authorization : `Bearer ${token}`
        }
    }
    const result = await axios.get(`${API_PATHS.api}/users/search?q=${searchParam}`, config)
    return result;
}

export const GetFriendsSuggestion = async (token) => {
    const result = await axios.get(`${API_PATHS.api}/users/friends_suggestion`, {
        headers : {
            Authorization : `Bearer ${token}`
        }
    })
    return result;
}

export const UpdateAvatar = async (token, image) => {
    const config = {
        headers : {
            Authorization : `Bearer ${token}`
        }
    }
    const formData = new FormData();
    formData.append("file", image)
    console.log(image)
    const result = await axios.post(`${API_PATHS.api}/users/avatar_update`, formData, config)
    console.log(result)
    return result;
}

export const updateProfile = async (token, data) => {
    console.log(token)
    const config = {
        headers : {
            Authorization : `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }
    const result = await axios.put(`${API_PATHS.api}/users/update`, JSON.stringify(data), config)
    return result
}

export const ForgotPassword = async (username) => {
    await axios.post(`${API_PATHS.api}/users/forgot_password`, {username})
}