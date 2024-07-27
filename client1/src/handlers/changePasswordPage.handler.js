
import { changePassword } from "../services/changePasswordPage.services.js";
async function handleSubmit(e, formVal, setError, setMessage, navigate) {
    e.preventDefault();

    try {
        const data = await changePassword(formVal)

        // console.log("message:::\n",data);
        setError((prev)=>{
            return {...prev,...data?.errors}
        })
        setMessage(data?.message)
    } catch (error) {
        console.log(error);
    }
}

function handleChange(e,setError,setFormVal) {

    const name = e.target.name + "Error";

    setError((error)=>{
        return {...error, [name]: "", otherError: "" }
    });
    setFormVal((formVal)=>{
        return { ...formVal, [e.target.name]: e.target.value }
    });
  }

export { handleSubmit,handleChange }