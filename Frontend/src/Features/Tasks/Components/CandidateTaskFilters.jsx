import { taskStatuses } from "./task.utils";

const CandidateTaskFilters = ({ query, filter, taskCount, onQueryChange, onFilterChange }) => (
    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
            <h2 className="font-semibold text-slate-900">
                Assigned to you
                <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {taskCount}
                </span>
            </h2>
            <p className="mt-1 text-xs text-slate-500">
                Select a task to view its full details.
            </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
            <input
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Search tasks"
                aria-label="Search tasks"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            <select
                value={filter}
                onChange={(event) => onFilterChange(event.target.value)}
                aria-label="Filter tasks by status"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"
            >
                <option>All tasks</option>
                {taskStatuses.map((status) => <option key={status}>{status}</option>)}
            </select>
        </div>
    </div>
);

export default CandidateTaskFilters;