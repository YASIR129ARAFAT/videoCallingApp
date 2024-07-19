
import { updateUserDetails } from "../services/updateUserDetails.services.js";
async function handleSubmit(e, id, formVal, error, setError, navigate, setLoading) {
    e.preventDefault();

    try {
        setLoading(1);
        console.log(formVal);
        const response = await updateUserDetails(id, formVal);
        setLoading(0);
        setError({ ...error, ...response?.error })
        // console.log(typeof response?.success);
        // console.log( response?.success);
        if (response?.success === 1) {
            navigate(`/userprofile`)
        }
    } catch (error) {
        console.log(error);
    }
}

function handleChange(e, formVal, setError, setFormVal) {
    // console.log(formVal);
    const nameError = e.target.name + "Error";
    const {name,value,type,files} = e.target

    // console.log(nameError);
    setError((error) => {
        return { ...error, [nameError]: "", otherError: "" }
    });
    setFormVal((formVal) => {
        return { ...formVal, [name]: type==="file" ? files[0] : value }
    });
    // console.log("data: ", formVal);
}

export { handleSubmit, handleChange }