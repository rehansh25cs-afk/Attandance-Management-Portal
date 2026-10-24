import { leaveStatusStyles } from "./leave.utils";

const CandidateLeaveRequestList = ({ loading, requests }) => (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
            <h2 className="font-semibold text-slate-900">Your requests</h2>
            <p className="mt-1 text-xs text-slate-500">
                View the status of your submitted leave requests.
            </p>
        </div>
        <div className="divide-y divide-slate-100">
            {loading && requests.length === 0 ? (
                <p className="p-5 text-sm text-slate-500">Loading your leave requests...</p>
            ) : requests.length === 0 ? (
                <p className="p-5 text-sm text-slate-500">You have not submitted any leave requests.</p>
            ) : requests.map((request) => (
                <div
                    key={request.id}
                    className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium text-slate-900">{request.type}</h3>
                            <span className="text-xs text-slate-400">{request.id}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                            {request.dates} · {request.days} {request.days === 1 ? "day" : "days"}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                            Submitted {request.submitted}
                        </p>
                    </div>
                    <span
                        className={`self-start rounded-full px-2.5 py-1 text-xs font-medium sm:self-auto ${leaveStatusStyles[request.status]}`}
                    >
                        {request.status}
                    </span>
                </div>
            ))}
        </div>
    </section>
);

export default CandidateLeaveRequestList;
