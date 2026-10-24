import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import CandidateSidebar from "../../Shared/Components/CandidateSidebar";
import Navbar from "../../Shared/Components/Navbar";
import CandidateTaskCard from "../Components/CandidateTaskCard";
import CandidateTaskFilters from "../Components/CandidateTaskFilters";
import TaskDetails from "../Components/TaskDetails";
import { normalizeTask } from "../Components/task.utils";
import { useTasks } from "../Hooks/useTasks";

const CandidateTasks = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filter, setFilter] = useState("All tasks");
    const [query, setQuery] = useState("");
    const [selectedTask, setSelectedTask] = useState(null);

    const user = useSelector((state) => state.auth.user);
    const currentUserId = user?._id ?? user?.id;
    const { tasks, loading, error, handleGetAllTasks, handleUpdateTask } = useTasks();

    const assignedTasks = useMemo(() => (
        tasks
            .filter((task) => isTaskAssignedToUser(task, currentUserId))
            .map(normalizeTask)
    ), [tasks, currentUserId]);

    const visibleTasks = useMemo(() => {
        const searchTerm = query.trim().toLowerCase();

        return assignedTasks.filter((task) => {
            const matchesFilter = filter === "All tasks" || task.status === filter;
            const matchesSearch = !searchTerm || (
                `${task.title} ${task.description} ${task.project}`
                    .toLowerCase()
                    .includes(searchTerm)
            );

            return matchesFilter && matchesSearch;
        });
    }, [assignedTasks, filter, query]);

    useEffect(() => {
        if (currentUserId) {
            handleGetAllTasks().catch(() => undefined);
        }
    }, [currentUserId, handleGetAllTasks]);

    const updateTaskStatus = async (event) => {
        const nextStatus = event.target.value;

        try {
            await handleUpdateTask({
                taskId: selectedTask.id,
                updatedData: { status: nextStatus },
            });

            setSelectedTask((currentTask) => ({
                ...currentTask,
                status: nextStatus,
            }));
        } catch {
            return;
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900">
            <CandidateSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <Navbar onMenuToggle={() => setSidebarOpen((open) => !open)} />

                <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <div className="mb-7">
                        <p className="mb-1 text-sm font-medium text-indigo-600">Work management</p>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            My tasks
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Review your assignments and update your progress.
                        </p>
                    </div>

                    <CandidateTaskFilters
                        query={query}
                        filter={filter}
                        taskCount={visibleTasks.length}
                        onQueryChange={setQuery}
                        onFilterChange={setFilter}
                    />

                    {error && (
                        <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </p>
                    )}

                    {loading && tasks.length === 0 ? (
                        <p className="py-12 text-center text-sm text-slate-500">
                            Loading your tasks...
                        </p>
                    ) : (
                        <section className="grid gap-4 md:grid-cols-2">
                            {visibleTasks.map((task) => (
                                <CandidateTaskCard
                                    key={task.id}
                                    task={task}
                                    onSelect={setSelectedTask}
                                />
                            ))}

                            {visibleTasks.length === 0 && (
                                <p className="rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm text-slate-500 md:col-span-2">
                                    No assigned tasks match your search or filter.
                                </p>
                            )}
                        </section>
                    )}
                </main>
            </div>

            {selectedTask && (
                <TaskDetails
                    task={selectedTask}
                    isStatusEditable
                    isCandidateView
                    onStatusChange={updateTaskStatus}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </div>
    );
};

const isTaskAssignedToUser = (task, userId) => {
    if (!userId) return false;

    const assignedTo = typeof task.assignedTo === "object"
        ? task.assignedTo?._id
        : task.assignedTo;

    return assignedTo === userId;
};

export default CandidateTasks;