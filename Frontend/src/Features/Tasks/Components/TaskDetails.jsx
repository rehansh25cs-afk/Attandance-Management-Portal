import { formatDueDate, statusStyles, taskStatuses } from "./task.utils";

const TaskDetails = ({ task, onClose, onStatusChange, isStatusEditable = false, isCandidateView = false }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900/40 p-4">
        <div className="my-auto w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-medium text-gray-400">
                        {isCandidateView ? task.assignedByName : task.assignee}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-gray-900">{task.title}</h2>
                </div>
                <button type="button" onClick={onClose} aria-label="Close details" className="rounded-md px-2 text-xl text-gray-400 hover:bg-gray-100">
                    x
                </button>
            </div>

            <p className="mt-6 whitespace-pre-line text-sm leading-6 text-gray-600">
                {task.description || "No details were added for this task."}
            </p>

            <div className="mt-6 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2">
                <Detail label="Project" value={task.project} />
                <Detail
                    label={isCandidateView ? "Assigned by" : "Assigned to"}
                    value={isCandidateView ? task.assignedByName : task.assignee}
                />
                <Detail label="Due date" value={formatDueDate(task.due)} />
                <Detail label="Priority" value={task.priority} />
                {isStatusEditable ? (
                    <label className="block text-xs font-medium text-gray-500">
                        Update progress
                        <select
                            value={task.status}
                            onChange={onStatusChange}
                            className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-normal text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        >
                            {taskStatuses.map((status) => (
                                <option key={status}>{status}</option>
                            ))}
                        </select>
                    </label>
                ) : (
                    <div>
                        <p className="text-xs font-medium text-gray-500">Status</p>
                        <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[task.status]}`}>
                            {task.status}
                        </span>
                    </div>
                )}
            </div>

            <div className="mt-6 flex justify-end">
                <button type="button" onClick={onClose} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                    Close
                </button>
            </div>
        </div>
    </div>
);

const Detail = ({ label, value }) => (
    <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-sm text-gray-800">{value || "Not provided"}</p>
    </div>
);

export default TaskDetails;