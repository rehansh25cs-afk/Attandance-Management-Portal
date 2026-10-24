import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../Shared/Components/AdminSidebar";
import Navbar from "../../Shared/Components/Navbar";
import TaskBoard from "../Components/TaskBoard";
import TaskDetails from "../Components/TaskDetails";
import TaskForm from "../Components/TaskForm";
import TaskSummaryCard from "../Components/TaskSummaryCard";
import { normalizeTask, taskStatuses } from "../Components/task.utils";
import { useTasks } from "../Hooks/useTasks";

const AdminTasks = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const {
        tasks,
        loading,
        error,
        handleCreateTask,
        handleGetAllTasks,
    } = useTasks();

    const normalizedTasks = useMemo(
        () => tasks.map(normalizeTask),
        [tasks],
    );

    const filteredTasks = useMemo(() => {
        const searchTerm = query.trim().toLowerCase();

        if (!searchTerm) return normalizedTasks;

        return normalizedTasks.filter((task) => (
            `${task.title} ${task.description} ${task.project} ${task.assignee}`
                .toLowerCase()
                .includes(searchTerm)
        ));
    }, [normalizedTasks, query]);

    useEffect(() => {
        handleGetAllTasks().catch(() => undefined);
    }, [handleGetAllTasks]);

    const createTask = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const taskData = {
            title: formData.get("title").trim(),
            description: formData.get("description").trim(),
            project: formData.get("project").trim(),
            dueDate: formData.get("due"),
            priority: formData.get("priority"),
            assignedTo: formData.get("assignee").trim(),
            status: "To Do",
        };

        try {
            await handleCreateTask({ taskData });
            setShowCreateForm(false);
        } catch {
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <Navbar onMenuToggle={() => setSidebarOpen((open) => !open)} />

                <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <PageHeader onCreateTask={() => setShowCreateForm(true)} />

                        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <TaskSummaryCard
                                label="Total tasks"
                                value={normalizedTasks.length}
                                hint="Across all projects"
                            />
                            <TaskSummaryCard
                                label="In progress"
                                value={normalizedTasks.filter((task) => task.status === "In Progress").length}
                                hint="Being worked on now"
                            />
                            <TaskSummaryCard
                                label="Completed"
                                value={normalizedTasks.filter((task) => task.status === "Done").length}
                                hint="Finished tasks"
                            />
                        </section>

                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">Task board</h2>
                                <p className="mt-0.5 text-xs text-gray-500">
                                    Select a task to view its full details.
                                </p>
                            </div>

                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search tasks"
                                aria-label="Search tasks"
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-64"
                            />
                        </div>

                        {error && (
                            <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </p>
                        )}

                        {loading && normalizedTasks.length === 0 ? (
                            <p className="py-12 text-center text-sm text-gray-500">
                                Loading tasks...
                            </p>
                        ) : (
                            <TaskBoard
                                tasks={filteredTasks}
                                statuses={taskStatuses}
                                onTaskSelect={setSelectedTask}
                            />
                        )}
                    </div>
                </main>
            </div>

            {showCreateForm && (
                <TaskForm
                    error={error}
                    onSubmit={createTask}
                    onClose={() => setShowCreateForm(false)}
                />
            )}

            {selectedTask && (
                <TaskDetails
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </div>
    );
};

const PageHeader = ({ onCreateTask }) => (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
            <p className="mb-1 text-sm font-medium text-indigo-600">Work management</p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tasks</h1>
            <p className="mt-1 text-sm text-gray-500">
                Create tasks and monitor your team&apos;s work.
            </p>
        </div>

        <button
            type="button"
            onClick={onCreateTask}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
            <span className="text-lg leading-none">+</span>
            Create task
        </button>
    </div>
);

export default AdminTasks;