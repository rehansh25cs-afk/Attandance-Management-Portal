import { useDispatch } from "react-redux";
import { createAnnouncement, getAllAnnouncements, pinAnnouncement } from "../service/announcements.api";
import {
    addAnnouncement,
    setAnnouncements,
    setError,
    setLoading,
    updateAnnouncement,
} from "../state/announcements.slice";



export const useAnnouncements = () => {

    const dispatch = useDispatch();

    const handleGetAllAnnouncements = async () => {

        dispatch(setLoading(true));

        try {
            const data = await getAllAnnouncements();
            dispatch(setAnnouncements(data.announcements ?? data));
            dispatch(setError(null));
        } catch (error) {
            dispatch(setError(error.message || 'Failed to fetch announcements'));
        } finally {
            dispatch(setLoading(false));
        }
    }


    const handleCreateAnnouncement = async ({ category, title, body, pinned }) => {

        dispatch(setLoading(true));

        try {
            const data = await createAnnouncement({ category, title, body, pinned });
            dispatch(addAnnouncement(data.announcement));
            dispatch(setError(null));
        } catch (error) {
            dispatch(setError(error.message || 'Failed to create announcement'));
        } finally {
            dispatch(setLoading(false));
        }

    }


    const handlePinAnnouncement = async ({ id }) => {

        dispatch(setLoading(true));
        try {
            const data = await pinAnnouncement({ id });
            dispatch(updateAnnouncement(data.announcement));
            dispatch(setError(null));
        } catch (error) {
            dispatch(setError(error.message || 'Failed to pin announcement'));
        } finally {
            dispatch(setLoading(false));
        } 
    }

    
    return { handleGetAllAnnouncements, handleCreateAnnouncement, handlePinAnnouncement };
}
