import {useDispatch} from 'react-redux';
import {setUser, setLoading, setError} from '../state/auth.slice';
import {register, login, getMe, GetAllCandidates} from '../service/auth.api';

export const useAuth = () => {

    const dispatch = useDispatch();

    const handleRegister = async({email, password, name, role, permissions}) => {

        dispatch(setLoading(true));

        try{
            const data = await register({email, password, name, role, permissions});
            dispatch(setUser(data.user ?? data));
            dispatch(setError(null));
            return data;
        }catch(error) {
            dispatch(setError(error.message || 'Registration failed'));
            throw error;
        }finally{
            dispatch(setLoading(false));
        }
        
    }


    const handleLogin = async({email, password}) => {

        dispatch(setLoading(true));

        try{
            const data = await login({email, password});
            dispatch(setUser(data.user ?? data));
            dispatch(setError(null));
            return data;
        }catch(error) {
            dispatch(setError(error.message || 'Login failed'));
            throw error;
        }finally{
            dispatch(setLoading(false));
        }
    }


    const handleGetMe = async() => {

        dispatch(setLoading(true));
        try{
            const data = await getMe();
            dispatch(setUser(data.user ?? data));
            dispatch(setError(null));
        }catch(error) {
            dispatch(setError(error.message || 'Failed to get user info'));
        }finally{
            dispatch(setLoading(false));
        }
    }



    const handleGetAllCandidates = async() => {

        dispatch(setLoading(true));
        try{
            const data = await GetAllCandidates();
            dispatch(setError(null));
            return data;
        }
        catch(error) {
            dispatch(setError(error.message || 'Failed to get candidates'));
            throw error;
        }
        finally{
            dispatch(setLoading(false));
        }
    }

    return {handleRegister, handleLogin, handleGetMe, handleGetAllCandidates};
}
