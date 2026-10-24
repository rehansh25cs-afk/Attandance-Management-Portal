import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/announcements",
    withCredentials: true
})

export const createAnnouncement = async({category, title, body, pinned}) => {

    try{
        const response = await api.post("/create", {category, title, body, pinned})
        return response.data;

    }catch (error) {
        console.error("Error creating announcement:", error);
        throw error;
    }
    
}


export const pinAnnouncement = async({id}) => {

    try{
        const response = await api.patch(`/pin/${id}`)
        return response.data;
        
    }catch (error) {
        console.error("Error pinning announcement:", error);
        throw error;
    }
    
}



export const getAllAnnouncements = async() => {

    try{
        const response = await api.get("/getAll")
        return response.data;
    }catch (error) {
        console.error("Error fetching all announcements:", error);
        throw error;
    }
    
}