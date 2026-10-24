import {createSlice} from "@reduxjs/toolkit";

const announcementsSlice = createSlice({

    name: "announcements",
    initialState: {
        announcements: [],
        loading: false,
        error: null
    },
    reducers: {
        setAnnouncements: (state, action) => {
            state.announcements = Array.isArray(action.payload)
                ? action.payload
                : [];
        },
        addAnnouncement: (state, action) => {
            state.announcements.unshift(action.payload);
        },
        updateAnnouncement: (state, action) => {
            state.announcements = state.announcements.map((announcement) =>
                announcement._id === action.payload._id
                    ? action.payload
                    : announcement,
            );
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }


    
})

export const {
    setAnnouncements,
    addAnnouncement,
    updateAnnouncement,
    setLoading,
    setError,
} = announcementsSlice.actions;
export default announcementsSlice.reducer
