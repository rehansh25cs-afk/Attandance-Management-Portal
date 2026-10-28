import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true,
})

/** Normalises an Axios error into a plain throwable object with a `message`. */
const handleApiError = (error, credentialsError = false) => {
    // No response means the server is unreachable / down
    if (!error.response) {
        throw { message: "Server error. Please try again later." };
    }

    // For login: never reveal which credential is wrong
    if (credentialsError) {
        const status = error.response?.status;
        if (status === 400 || status === 401 || status === 404) {
            throw { message: "Invalid credentials. Please check your email and password." };
        }
        throw { message: "Server error. Please try again later." };
    }

    throw error.response.data;
};


export const register = async ({ email, password, name, role, permissions }) => {
    try {
        const response = await api.post("/register", { email, password, name, role, permissions });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}


export const login = async ({ email, password }) => {
    try {
        const response = await api.post("/login", { email, password });
        return response.data;
    } catch (error) {
        handleApiError(error, true);   // true = credentials context
    }
}


export const getMe = async () => {
    try {
        const response = await api.get("/get-me");
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}


export const GetAllCandidates = async () => {
    try {
        const response = await api.get("/get-all-candidates");
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}


export const logOut = async () => {
    try {
        const response = await api.post("/logout");
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}
