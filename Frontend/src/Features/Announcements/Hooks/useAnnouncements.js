import { useDispatch } from "react-redux";
import { createAnnouncement, deleteAnnouncement, getAllAnnouncements, pinAnnouncement } from "../service/announcements.api";
import {
    addAnnouncement,
    removeAnnouncement,
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
            const msg = error?.message || 'Failed to load announcements. Please try again.';
            dispatch(setError(msg));
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
            const msg = error?.message || 'Failed to publish announcement. Please try again.';
            dispatch(setError(msg));
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
            const msg = error?.message || 'Failed to pin announcement. Please try again.';
            dispatch(setError(msg));
        } finally {
            dispatch(setLoading(false));
        }
    }



    const handleDeleteAnnouncement = async ({ id }) => {

        dispatch(setLoading(true));
        try {
            await deleteAnnouncement({ id });
            dispatch(removeAnnouncement(id));
            dispatch(setError(null));
        } catch (error) {
            const msg = error?.message || 'Failed to delete announcement. Please try again.';
            dispatch(setError(msg));
        } finally {
            dispatch(setLoading(false));
        }

    };

    return { handleGetAllAnnouncements, handleCreateAnnouncement, handlePinAnnouncement, handleDeleteAnnouncement };
}
