import { createSlice } from '@reduxjs/toolkit';


const leavesSlice = createSlice({
    name: 'leaves',
    initialState: {
        leaves: [],
        loading: false,
        error: null
    },

    reducers: {
        setLeaves: (state, action) => {
            state.leaves = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { setLeaves, setLoading, setError } = leavesSlice.actions;
export default leavesSlice.reducer;

