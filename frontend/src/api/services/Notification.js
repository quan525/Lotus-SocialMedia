import axios from "axios";
import API_PATHS from "../apiPath";

export const requestNotification = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    while (true) {
        try {
            const response = await axios.get(`${API_PATHS.api}/notification/`, config);
            if (response.data && response.data.length > 0) {
                console.log(response)
                return response;
            }
        } catch (err) {
            console.error('Error config:', err);
        }
        
        // Wait for a certain period of time before the next request
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
};

export const requestNotificationOnLogin = async (token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const response = await axios.get(`${API_PATHS.api}/notification/notiLogin`, config)
        console.log(response)
        return response;
    } catch (err) {
        console.error('Error: ', err);
        return err
    }
};