import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:3000/api/tasks",
    withCredentials: true,
})

const handleApiError = (error) => {
    if (!error.response) {
        throw { message: "Server error. Please try again later." };
    }
    throw error.response?.data ?? error;
};


export const createTask = async ({ taskData }) => {
    try {
        const response = await api.post("/create", taskData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}


export const getAllTasks = async () => {
    try {
        const response = await api.get("/get-all");
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}


export const updateTask = async ({ taskId, updatedData }) => {
    try {
        const response = await api.patch(`/update/${taskId}`, updatedData);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}
