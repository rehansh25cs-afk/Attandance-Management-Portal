const AdminLeaveRequestFilters = ({ visibleRequestCount, query, onQueryChange, filter, onFilterChange }) => (
    <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
            <h2 className="text-base font-semibold text-gray-900">
                Requests
                <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    {visibleRequestCount}
                </span>
            </h2>
            <p className="mt-1 text-xs text-gray-500">
                Submitted leave requests and their current status.
            </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative block">
                <span className="sr-only">Search requests</span>
                <svg
                    className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="11" cy="11" r="7" />
                    <path strokeLinecap="round" d="m20 20-4-4" />
                </svg>
                <input
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder="Search requests"
                    className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-52"
                />
            </label>
            <select
                aria-label="Filter by request status"
                value={filter}
                onChange={(event) => onFilterChange(event.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 outline-none focus:border-indigo-400"
            >
                <option>All requests</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Declined</option>
            </select>
        </div>
    </div>
);

export default AdminLeaveRequestFilters;
