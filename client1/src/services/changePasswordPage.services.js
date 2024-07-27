import axios from "axios";

async function changePassword(formVal) {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/changePassword`,
            formVal,
            {
                headers: {
                    token: localStorage.getItem('token')
                }
            }
        )

        const data = response?.data;

        return data;

    } catch (error) {
        console.log(error);
    }
}

export { changePassword }