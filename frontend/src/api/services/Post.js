import axios from "axios"
import API_PATHS from "../apiPath"

export const sharePost = async(token, postId, content) => {
    try {
        console.log(token)
        const response = await axios.post(`${API_PATHS.api}/post/${postId}/share`, {
            content
        }, {
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