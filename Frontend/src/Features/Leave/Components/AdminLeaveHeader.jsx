const AdminLeaveHeader = ({ error }) => (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
            <p className="mb-1 text-sm font-medium text-indigo-600">
                People management
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Leave requests
            </h1>
            <p className="mt-1 text-sm text-gray-500">
                Review time off requests and keep track of your team’s leave.
            </p>
            {error && (
                <p className="mt-2 text-sm text-rose-600">{error}</p>
            )}
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
            <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path
                    strokeLinecap="round"
                    d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3"
                />
            </svg>
            Export requests
        </button>
    </div>
);

export default AdminLeaveHeader;
