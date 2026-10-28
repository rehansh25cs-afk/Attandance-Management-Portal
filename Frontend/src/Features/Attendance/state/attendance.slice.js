import { createSlice } from '@reduxjs/toolkit';


const attendanceSlice = createSlice({
    name: 'attendance',
    initialState: {

        attendanceRecords: [],
        totalTeam: 0,
        loading: false,
        error: null

    },


    reducers: {
        setAttendanceRecords: (state, action) => {
            state.attendanceRecords = action.payload;
        },
        setTotalTeam: (state, action) => {
            state.totalTeam = action.payload;
        },
        checkOut: (state, action) => {
            const updatedRecord = action.payload;
            const index = state.attendanceRecords.findIndex(record => record._id === updatedRecord._id);
            if (index !== -1) {
                state.attendanceRecords[index] = updatedRecord;
            }
        },
        checkIn: (state, action) => {
            state.attendanceRecords.unshift(action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
})



export const {
    setAttendanceRecords,
    setTotalTeam,
    checkOut,
    checkIn,
    setLoading,
    setError
} = attendanceSlice.actions;
export default attendanceSlice.reducer;
