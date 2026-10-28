import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000/api/attendance",
    withCredentials: true,
})

const handleApiError = (error) => {
    if (!error.response) {
        throw { message: "Server error. Please try again later." };
    }
    throw error.response?.data ?? error;
};


export const checkIn = async () => {
    try {
        const response = await api.post("/check-in");
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}


export const checkOut = async () => {
    try {
        const response = await api.patch("/check-out");
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}


export const getAttendanceByUser = async () => {
    try {
        const response = await api.get("/get-attendance");
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}


export const getAllAttendance = async (date) => {
    try {
        const response = await api.get("/get-all-attendance", { params: { date } });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}
