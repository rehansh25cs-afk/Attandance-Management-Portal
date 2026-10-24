import { leaveStatusStyles } from "./leave.utils";

const AdminLeaveRequestTable = ({ loading, visibleRequests, requestCount, onUpdateStatus }) => (
    <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                    <th className="px-5 py-3 font-medium">Team member</th>
                    <th className="px-5 py-3 font-medium">Leave type</th>
                    <th className="px-5 py-3 font-medium">Dates</th>
                    <th className="px-5 py-3 font-medium">Duration</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {loading && requestCount === 0 ? (
                    <tr>
                        <td colSpan="6" className="px-5 py-8 text-center text-sm text-gray-500">
                            Loading leave requests...
                        </td>
                    </tr>
                ) : (
                    visibleRequests.map((request) => (
                        <tr
                            key={request.id}
                            className="hover:bg-gray-50/70"
                        >
                            <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${request.color}`}
                                    >
                                        {request.initials}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {request.name}
                                        </p>
                                        <p className="mt-0.5 text-xs text-gray-500">
                                            {request.role} · {request.id}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-5 py-4">
                                <p className="font-medium text-gray-700">
                                    {request.type}
                                </p>
                                <p className="mt-0.5 text-xs text-gray-400">
                                    {request.reason}
                                </p>
                            </td>
                            <td className="px-5 py-4 text-gray-600">
                                {request.dates}
                                <p className="mt-0.5 text-xs text-gray-400">
                                    Submitted {request.submitted}
                                </p>
                            </td>
                            <td className="px-5 py-4 text-gray-600">
                                {request.days}{" "}
                                {request.days === 1 ? "day" : "days"}
                            </td>
                            <td className="px-5 py-4">
                                <span
                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${leaveStatusStyles[request.status]}`}
                                >
                                    {request.status}
                                </span>
                            </td>
                            <td className="px-5 py-4">
                                {request.status === "Pending" ? (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onUpdateStatus(request.id, "Approved")}
                                            className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => onUpdateStatus(request.id, "Declined")}
                                            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-400">
                                        Reviewed
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
        {!loading && visibleRequests.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-gray-500">
                No leave requests match these filters.
            </div>
        )}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
            <span>
                Showing {visibleRequests.length} of {requestCount} requests
            </span>
            <span>Updated just now</span>
        </div>
    </div>
);

export default AdminLeaveRequestTable;
