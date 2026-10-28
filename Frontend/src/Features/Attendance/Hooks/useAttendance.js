import { checkIn, checkOut, getAllAttendance, getAttendanceByUser } from '../service/attendance.api';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setAttendanceRecords, setTotalTeam, checkOut as checkOutAction, checkIn as checkInAction, setLoading, setError } from '../state/attendance.slice';


export const useAttendance = () => {

    const dispatch = useDispatch();

    const handleCheckIn = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const data = await checkIn();
            dispatch(checkInAction(data.attendance));
            dispatch(setError(null));
            return data;
        } catch (error) {
            const message = error?.message || 'Failed to check in. Please try again.';
            dispatch(setError(message));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);


    const handleCheckOut = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const data = await checkOut();
            dispatch(checkOutAction(data.attendance));
            dispatch(setError(null));
            return data;
        } catch (error) {
            const message = error?.message || 'Failed to check out. Please try again.';
            dispatch(setError(message));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleGetAttendanceByUser = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const data = await getAttendanceByUser();
            dispatch(setAttendanceRecords(data.attendance ?? []));
            dispatch(setError(null));
            return data;
        } catch (error) {
            const message = error?.message || 'Failed to load attendance records. Please try again.';
            dispatch(setError(message));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleGetAllAttendance = useCallback(async (date) => {
        dispatch(setLoading(true));

        try {
            const data = await getAllAttendance(date);
            dispatch(setAttendanceRecords(data.attendance ?? []));
            dispatch(setTotalTeam(data.totalTeam ?? 0));
            dispatch(setError(null));
            return data;
        } catch (error) {
            const message = error?.message || 'Failed to load attendance records. Please try again.';
            dispatch(setError(message));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    return {
        handleCheckIn,
        handleCheckOut,
        handleGetAttendanceByUser,
        handleGetAllAttendance
    };

}
