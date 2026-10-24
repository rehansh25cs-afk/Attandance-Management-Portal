import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/leaves",
    withCredentials: true,
})




export const requestLeave = async ({ leaveType, Dates }) => {

    try {
        const response = await api.post("/request-leave", { leaveType, Dates });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }

}




export const getLeaves = async () => {

    try {
        const response = await api.get("/get-leaves");
        return response.data;
    } catch (error) {
        throw error.response.data;
    }

}




export const getAllLeaves = async () => {

    try {
        const response = await api.get("/get-all-leaves");
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}




export const updateLeaveStatus = async( { leaveId, status } ) => {

    try {
        const response = await api.patch(`/update-leave/${leaveId}`, { status });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}