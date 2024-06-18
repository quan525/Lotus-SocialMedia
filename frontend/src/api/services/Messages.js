import axios from 'axios';
import API_PATHS from '../apiPath';
import { jwtDecode } from "jwt-decode";

export const fetchChatRooms = async (token) => {
    try {
        const response = await axios.get(`${API_PATHS.api}/chats`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response)
        return response;
    } catch (err) {
        console.log(err)
    }
}

export const leaveChatRoom = async (token, userId, roomId) => {
    try {
        const response = await axios.delete(`${API_PATHS.api}/chats/${roomId}/admin/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response)
        return response;
    } catch (err) {
        console.log(err)
    }

}

export const deleteChatMessage = async (token, roomId) => {
    try {
        const response = await axios.put(`${API_PATHS.api}/message/${roomId}/delete-messages`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (err) {
        console.log(err)
        return err
    }

}

export const removeParticipant = async (token, memberId, roomId) => {
    try {
        const response = await axios.delete(`${API_PATHS.api}/chats/${roomId}/admin/users/${memberId}`, {
            headers: {
                Authorization : `Bearer ${token}`
            }
        })
        return response
    } catch (err) {
        console.log(err)
        return err
    }
}

export const CreateSingleChat = async (token, userId) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
     
    const payload = {
        "personId" : userId
    }
    try{
        const response = await axios.post(`${API_PATHS.api}/chats/singlechat`, payload, config)
        return response;
    }catch (err) {
        return err
    }
}

export const CreateGroupChat = async (token, userIds, chatName) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    const payload = {
        "name" : chatName,
        "members" : userIds
    }
    try{
        const response = await axios.post(`${API_PATHS.api}/chats/group`, JSON.stringify(payload), config)
        return response;
    }catch (err) {
        return err
    }
}

export const loadChatMessage = async (token, roomId) => {
    try {
        console.log("Loadding message")
        const response = await axios.get(`${API_PATHS.api}/message/${roomId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (err) {
        console.log(err)
        return err
    }
}

export const sendMessage = async (token, roomId, payload) => {
    try {
        const response = await axios.post(`${API_PATHS.api}/message/${roomId}`, 
        payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response)
        return response;
    } catch (err) {
        console.log(err)
    }
}

export const addMember = async (token, roomId, memberId) => {
    try {
        const response = await axios.post(`${API_PATHS.api}/chats/${roomId}/add-member/${memberId}`, {
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        return response
    }catch (err){
        throw new Error(err)
    }
}
export const addMembers = async (token, memberIds, roomId) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    const payload = {
        "membersIds" : memberIds
    }
    try{
        const response = await axios.post(`${API_PATHS.api}/chats/${roomId}/users/add-members`, JSON.stringify(payload), config)
        return response;
    }catch (err) {
        return err
    }
}