import axios from 'axios';
import API_PATHS from '../apiPath';

export const fetchPostComments = async (token, postId) => { // Removed extra parentheses
    try {
        const config = { // Added missing 'const' keyword
            headers: {
                'Authorization': `Bearer ${token}` // Fixed misspelling of 'Authorization'
            }
        };
        console.log(`${API_PATHS.comment}/${postId}`)
        const response = await axios.get(`${API_PATHS.comment}/${postId}`, config); // Corrected API path
        console.log(response.data);
        return response.data; // Return the fetched data if needed
    } catch (error) {
        console.error('Error fetching post comments:', error);
        throw error; // Throw the error for handling it outside this function
    }
};

export const commentOnPost = async (token, postId, content, image) => { 
    try {
        const config = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }    
    //     const postId = req.params.postId;
    // const comment = req.body.content;
    // const userId = req.userId;
    // const image = req.file; //
    const formData = new FormData();
    formData.append('content', content)
    formData.append('media', image)
    const response = await axios.post(`${API_PATHS.comment}/${postId}`, formData , config)
    return response
    }catch (error) {
        console.error('Error commenting on post:', error);
    }

}