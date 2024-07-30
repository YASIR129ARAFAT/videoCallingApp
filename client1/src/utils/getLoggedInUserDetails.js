import axios from "axios";
export const getLoggedInUserDetails = async()=>{
    try {
        // console.log(localStorage.getItem('token'));
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/loggedInUserDetails`,{
            headers:{
                token:localStorage.getItem('token')
            }
        });
     
        // console.log(response?.data);
        return response?.data;
    } catch (error) {
        console.log('error in fetching logged in user details');
        throw new Error(error)
        return error?.response?.data
    }
}