import AttendanceStatusBadge from "./AttendanceStatusBadge";

const CandidateAttendanceTable = ({ records, periodLabel = "All recorded days" }) => (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 className="font-semibold text-slate-900">Attendance history</h2>
                <p className="mt-1 text-xs text-slate-500">Your daily attendance record.</p>
            </div>
            <p className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600">
                {periodLabel}
            </p>
        </div>

        {records.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">
                No attendance records found.
            </p>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-5 py-3 font-medium">Date</th>
                            <th className="px-5 py-3 font-medium">Check in</th>
                            <th className="px-5 py-3 font-medium">Check out</th>
                            <th className="px-5 py-3 font-medium">Hours</th>
                            <th className="px-5 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {records.map((record) => (
                            <tr key={record.id || record.date} className="hover:bg-slate-50/70">
                                <td className="px-5 py-4 text-slate-600">{record.date}</td>
                                <td className="px-5 py-4 text-slate-600">{record.checkIn}</td>
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

export default CandidateAttendanceTable;
