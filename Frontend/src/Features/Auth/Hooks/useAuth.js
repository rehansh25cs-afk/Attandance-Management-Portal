import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, setLoading, setError } from '../state/auth.slice';
import { register, login, getMe, GetAllCandidates, logOut } from '../service/auth.api';

export const useAuth = () => {

    const dispatch = useDispatch();

    const handleRegister = async ({ email, password, name, role, permissions }) => {

        dispatch(setLoading(true));

        try {
            const data = await register({ email, password, name, role, permissions });
            dispatch(setUser(data.user ?? data));
            dispatch(setError(null));
            return data;
        } catch (error) {
            const msg = error?.message || 'Registration failed. Please try again.';
            dispatch(setError(msg));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }

    }


    const handleLogin = async ({ email, password }) => {

        dispatch(setLoading(true));

        try {
            const data = await login({ email, password });
            dispatch(setUser(data.user ?? data));
            dispatch(setError(null));
            return data;
        } catch (error) {
            // Always show a generic credential error — never hint which field is wrong.
            const msg = error?.message || 'Invalid credentials. Please check your email and password.';
            dispatch(setError(msg));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }


    const handleGetMe = useCallback(async () => {

        dispatch(setLoading(true));
        try {
            const data = await getMe();
            dispatch(setUser(data.user ?? data));
            dispatch(setError(null));
            return data;
        } catch (error) {
            dispatch(setError(error?.message || 'Failed to get user info'));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch])



    const handleGetAllCandidates = async () => {

        dispatch(setLoading(true));
        try {
            const data = await GetAllCandidates();
            dispatch(setError(null));
            return data;
        } catch (error) {
            dispatch(setError(error?.message || 'Failed to get candidates'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }



    const handleLogOut = async () => {

        dispatch(setLoading(true));
        try {
            const data = await logOut();
            dispatch(setUser(null));
            dispatch(setError(null));
            return data;
        } catch (error) {
            dispatch(setError(error?.message || 'Failed to log out'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    return { handleRegister, handleLogin, handleGetMe, handleGetAllCandidates, handleLogOut };
}
