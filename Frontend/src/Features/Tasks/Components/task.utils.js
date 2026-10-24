export const taskStatuses = ["To Do", "In Progress", "Done"];
export const taskPriorities = ["High", "Medium", "Low"];

export const priorityStyles = {
    High: "bg-rose-50 text-rose-700",
    Medium: "bg-amber-50 text-amber-700",
    Low: "bg-gray-100 text-gray-600",
};

export const statusStyles = {
    "To Do": "bg-gray-100 text-gray-600",
    "In Progress": "bg-indigo-50 text-indigo-700",
    Done: "bg-emerald-50 text-emerald-700",
};

const statusAliases = {
    "To do": "To Do",
    "In progress": "In Progress",
};

export const normalizeTask = (task) => ({
    ...task,
    id: task._id ?? task.id,
    description: task.description ?? "",
    project: task.project ?? "General",
    assignee: task.assignedTo?.name ?? task.assignee ?? task.assignedTo ?? "Unassigned",
    assignedByName: task.assignedBy?.name ?? task.assignedBy ?? "Unknown",
    due: task.dueDate ?? task.due ?? "",
    status: statusAliases[task.status] ?? task.status ?? "To Do",
});

export const formatDueDate = (date) => {
    if (!date) return "No due date";

    return new Date(`${String(date).slice(0, 10)}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};