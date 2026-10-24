import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true,
})


export const register = async ({ email, password, name, role, permissions }) => {

    try {
        const response = await api.post("/register", { email, password, name, role, permissions })
        return response.data;
    }catch(error) {
        throw error.response.data;
    }
}


export const login = async({email, password}) => {

    try{
        const response = await api.post("/login", { email, password })
        return response.data;
    }catch(error) {
        throw error.response.data;
    }
    
}


export const getMe = async() => {

    try{
        const response = await api.get("/get-me")
        return response.data;
    }catch(error) {
        throw error.response.data;
    }
}


export const GetAllCandidates = async() => {

    try{
        const response = await api.get("/get-all-candidates")
        return response.data;
    }catch(error) {
        throw error.response.data;
    }

}