import { formatDueDate, priorityStyles, taskStatuses } from "./task.utils";

const TaskBoard = ({ tasks, statuses = taskStatuses, onTaskSelect }) => (
    <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        {statuses.map((status) => {
            const columnTasks = tasks.filter((task) => task.status === status);

            return (
                <div key={status} className="rounded-xl border border-gray-200 bg-gray-100/70 p-3">
                    <div className="mb-3 flex items-center justify-between px-1">
                        <h3 className="text-sm font-semibold text-gray-800">{status}</h3>
                        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-500">
                            {columnTasks.length}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {columnTasks.map((task) => (
                            <button
                                type="button"
                                key={task.id}
                                onClick={() => onTaskSelect(task)}
                                className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md"
                            >
                                <div className="mb-3 flex items-start justify-between gap-2">
                                    <span className="text-xs font-medium text-gray-400">{task.assignee}</span>
                                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${priorityStyles[task.priority]}`}>
                                        {task.priority}
                                    </span>
                                </div>
                                <h4 className="text-sm font-semibold leading-5 text-gray-900">{task.title}</h4>
                                <p className="mt-1 text-xs text-gray-500">{task.project}</p>
                                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                                    <span className="text-xs text-gray-600">{task.assignee}</span>
                                    <span className="text-[11px] text-gray-400">Due {formatDueDate(task.due)}</span>
                                </div>
                            </button>
                        ))}

                        {columnTasks.length === 0 && (
                            <p className="rounded-lg border border-dashed border-gray-300 px-3 py-8 text-center text-xs text-gray-500">
                                No tasks here
                            </p>
                        )}
                    </div>
                </div>
            );
        })}
    </section>
);

export default TaskBoard;