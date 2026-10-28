import AttendanceStatusBadge from "./AttendanceStatusBadge";

const AdminAttendanceTable = ({ records, selectedDate, loading }) => (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 className="font-semibold text-slate-900">
                    Attendance records
                    <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        {records.length}
                    </span>
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                    Daily check-in and check-out overview.
                </p>
            </div>
            <p className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600">
                {selectedDate}
            </p>
        </div>

        {loading ? (
            <p className="p-6 text-sm text-slate-500">Loading attendance records...</p>
        ) : records.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">
                No attendance records match the selected filters.
            </p>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                        <th className="px-5 py-3 font-medium">Team member</th>
                        <th className="px-5 py-3 font-medium">Check in</th>
                        <th className="px-5 py-3 font-medium">Check out</th>
                        <th className="px-5 py-3 font-medium">Working hours</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {records.map((record) => (
                            <tr key={record.id} className="transition hover:bg-slate-50/70">
                            <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${record.color}`}
                                    >
                                        {record.initials}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{record.name}</p>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {record.role} · {record.id}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-5 py-4 font-medium text-slate-700">
                                {record.checkIn}
                            </td>
                            <td className="px-5 py-4 text-slate-600">{record.checkOut}</td>
                            <td className="px-5 py-4 text-slate-600">{record.hours}</td>
                            <td className="px-5 py-4">
                                <AttendanceStatusBadge status={record.status} />
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </section>
);

export default AdminAttendanceTable;
