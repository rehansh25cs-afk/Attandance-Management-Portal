import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask, getAllTasks, updateTask } from "../service/tasks.api";
import { setError, setLoading, setTasks } from "../state/tasks.slice";

export const useTasks = () => {
    const dispatch = useDispatch();
    const { tasks, loading, error } = useSelector((state) => state.tasks);

    const handleCreateTask = async ({ taskData }) => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const response = await createTask({ taskData });
            const createdTask = response.task ?? response;

            dispatch(setTasks([...tasks, createdTask]));
            return createdTask;
        } catch (requestError) {
            const message = requestError.response?.data?.message
                || requestError.message
                || "Could not create task.";

            dispatch(setError(message));
            throw new Error(message);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleGetAllTasks = useCallback(async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const response = await getAllTasks();
            const fetchedTasks = response.tasks ?? response;
            const taskList = Array.isArray(fetchedTasks) ? fetchedTasks : [];

            dispatch(setTasks(taskList));
            return taskList;
        } catch (requestError) {
            const message = requestError.response?.data?.message
                || requestError.message
                || "Could not load tasks.";

            dispatch(setError(message));
            throw new Error(message);
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleUpdateTask = async ({ taskId, updatedData }) => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const response = await updateTask({ taskId, updatedData });
            const updatedTask = response.task ?? response;
            const updatedTaskId = updatedTask._id ?? updatedTask.id;

            dispatch(setTasks(tasks.map((task) => (
                (task._id ?? task.id) === updatedTaskId ? updatedTask : task
            ))));

            return updatedTask;
        } catch (requestError) {
            const message = requestError.response?.data?.message
                || requestError.message
                || "Could not update task.";

            dispatch(setError(message));
            throw new Error(message);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        tasks,
        loading,
        error,
        handleCreateTask,
        handleGetAllTasks,
        handleUpdateTask,
    };
};