import axios from "axios";
const getAllUsers = async (getProfessionalOnly) => {
    // getAdminsOnly give you option to load only admins
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/user/${getProfessionalOnly}`,
            {
                headers: {
                    token: localStorage.getItem("token"),
                },
            }
        );

        console.log(response?.data);
        console.log("req url: ",`${process.env.REACT_APP_BACKEND_URL}/api/user/${getProfessionalOnly}`);
        return response?.data;
    } catch (error) {
        console.log("Failed to load all users page", error);
    }
};

export { getAllUsers }