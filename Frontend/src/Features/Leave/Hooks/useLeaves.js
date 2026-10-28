import { useDispatch } from "react-redux";
import { requestLeave, getLeaves, getAllLeaves, updateLeaveStatus } from "../service/leaves.api";
import { setError, setLeaves, setLoading } from "../state/leaves.slice";

export const useLeaves = () => {

    const dispatch = useDispatch();

    const handleRequestLeave = async ({ leaveType, Dates }) => {

        dispatch(setLoading(true));

        try {
            const data = await requestLeave({ leaveType, Dates });
            dispatch(setError(null));
            return data;
        } catch (error) {
            const msg = error?.message || 'Failed to submit leave request. Please try again.';
            dispatch(setError(msg));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }

    }


    const handleGetLeaves = async () => {

        dispatch(setLoading(true));

        try {
            const data = await getLeaves();
            dispatch(setLeaves(data.data ?? data));
            dispatch(setError(null));
            return data;
        } catch (error) {
            const msg = error?.message || 'Failed to load leave requests. Please try again.';
            dispatch(setError(msg));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }

    }


    const handleGetAllLeaves = async () => {

        dispatch(setLoading(true));

        try {
            const data = await getAllLeaves();
            dispatch(setLeaves(data.data ?? data));
            dispatch(setError(null));
            return data;
        } catch (error) {
            const msg = error?.message || 'Failed to load leave requests. Please try again.';
            dispatch(setError(msg));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }

    }


    const handleUpdateLeaveStatus = async ({ leaveId, status }) => {

        dispatch(setLoading(true));

        try {
            const data = await updateLeaveStatus({ leaveId, status });
            dispatch(setError(null));
            return data;
        } catch (error) {
            const msg = error?.message || 'Failed to update leave status. Please try again.';
            dispatch(setError(msg));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }

    }


    return {
        handleRequestLeave,
        handleGetLeaves,
        handleGetAllLeaves,
        handleUpdateLeaveStatus,
    }

}
