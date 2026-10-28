const AttendancePageHeader = ({ eyebrow, title, description, action }) => (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
            <p className="mb-1 text-sm font-medium text-indigo-600">{eyebrow}</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {title}
            </h1>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
        {action}
    </div>
);

export default AttendancePageHeader;
