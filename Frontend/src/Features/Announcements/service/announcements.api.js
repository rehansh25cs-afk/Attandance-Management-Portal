import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/announcements",
    withCredentials: true,
})

const handleApiError = (error) => {
    if (!error.response) {
        throw { message: "Server error. Please try again later." };
    }
    throw error.response?.data ?? error;
};


export const createAnnouncement = async ({ category, title, body, pinned }) => {
    try {
        const response = await api.post("/create", { category, title, body, pinned });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}


export const pinAnnouncement = async ({ id }) => {
    try {
        const response = await api.patch(`/pin/${id}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}


export const getAllAnnouncements = async () => {
    try {
        const response = await api.get("/getAll");
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}


export const deleteAnnouncement = async ({ id }) => {
    try {
        const response = await api.delete(`/delete/${id}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}
