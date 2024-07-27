import { getAllUsers } from "./getAllUsers.services";
const getAllDoctors = async () => {
  const getProfessionalOnly = true;
  try {
    const data = await getAllUsers(getProfessionalOnly);
    return data;
  } catch (error) {
    console.log("Failed to load all users page", error);
  }
};

export { getAllDoctors }