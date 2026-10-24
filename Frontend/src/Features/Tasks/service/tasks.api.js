import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:3000/api/tasks",
    withCredentials: true,
})


export const createTask = async({taskData}) => {

    try{
        const response = await api.post("/create", taskData);
        return response.data;
    } catch (error) {
        console.error("Error creating task:", error);
        throw error;
    }
}


export const getAllTasks = async() => {

    try{
        const response = await api.get("/get-all");
        return response.data;
    }
    catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
    }
    
}


export const updateTask = async({taskId, updatedData}) => {

    try{
        const response = await api.patch(`/update/${taskId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
}

