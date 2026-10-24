const CandidateLeaveHeader = ({ error, onRequestLeave }) => (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
            <p className="mb-1 text-sm font-medium text-indigo-600">Time away</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Leave requests
            </h1>
            <p className="mt-2 text-sm text-slate-500">
                Request time off and keep track of your leave balance.
            </p>
            {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
        </div>
        <button
            type="button"
            onClick={onRequestLeave}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
            <span className="text-lg leading-none">+</span> Request leave
        </button>
    </div>
);

export default CandidateLeaveHeader;
