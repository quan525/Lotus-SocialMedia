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

export const updatePost = async(token, postId, content, imageURLS) => {
    try {
        const formData = new FormData();
        formData.append('content', content);
        // if( imageURLS?.length > 0 ) {
        //     imageURLS.forEach(element => {
        //         formData.append('postImageURLS', element);
        //     });
        // }
        if(imageURLS?.length > 0){
            formData.append('postImageURLS', JSON.stringify(imageURLS));
        }
        const response = await axios.put(`${API_PATHS.api}/post/${postId}/update`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response
    }catch (err) {
        return err
    }
}