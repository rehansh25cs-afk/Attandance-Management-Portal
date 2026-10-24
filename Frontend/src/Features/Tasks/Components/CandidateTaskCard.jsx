import { formatDueDate, priorityStyles, statusStyles } from "./task.utils";

const CandidateTaskCard = ({ task, onSelect }) => (
    <button
        type="button"
        onClick={() => onSelect(task)}
        className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md"
    >
        <div className="flex items-start justify-between gap-3">
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${priorityStyles[task.priority]}`}>
                {task.priority} priority
            </span>
            <span className="text-xs text-slate-400">Due {formatDueDate(task.due)}</span>
        </div>

        <h3 className="mt-4 font-semibold text-slate-900">{task.title}</h3>
        <p className="mt-1 text-sm text-slate-500">{task.project}</p>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-xs text-slate-500">
                Assigned by {task.assignedByName}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[task.status]}`}>
                {task.status}
            </span>
        </div>
    </button>
);

export default CandidateTaskCard;