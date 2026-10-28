const statusStyles = {
    Present: "bg-emerald-50 text-emerald-700",
    Late: "bg-amber-50 text-amber-700",
    Absent: "bg-rose-50 text-rose-700",
    "On leave": "bg-indigo-50 text-indigo-700",
};

const AttendanceStatusBadge = ({ status }) => (
    <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            statusStyles[status] || "bg-slate-100 text-slate-600"
        }`}
    >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {status}
    </span>
);

export default AttendanceStatusBadge;
