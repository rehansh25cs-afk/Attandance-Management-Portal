import { taskPriorities } from "./task.utils";

const TaskForm = ({ error, onSubmit, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900/40 p-4">
        <form
            onSubmit={onSubmit}
            className="my-auto w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
        >
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Create a task</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Add the task information your candidate needs.
                    </p>
                </div>
                <button type="button" onClick={onClose} aria-label="Close form" className="rounded-md px-2 text-xl text-gray-400 hover:bg-gray-100">
                    x
                </button>
            </div>

            <div className="space-y-4">
                <FormInput name="title" label="Task title" required placeholder="e.g. Prepare weekly report" />
                <FormInput name="description" label="Task details" multiline required placeholder="Describe what needs to be done..." />

                <div className="grid gap-4 sm:grid-cols-2">
                    <FormInput name="project" label="Project" required placeholder="e.g. Operations" />
                    <FormInput name="assignee" label="Assign to" required placeholder="Candidate name or ID" />
                    <FormInput name="due" label="Due date" type="date" required />
                    <label className="block text-sm font-medium text-gray-700">
                        Priority
                        <select name="priority" defaultValue="Medium" className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400">
                            {taskPriorities.map((priority) => <option key={priority}>{priority}</option>)}
                        </select>
                    </label>
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
                {error && (
                    <p role="alert" className="mr-auto self-center text-sm text-red-600">
                        {error}
                    </p>
                )}
                <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                    Cancel
                </button>
                <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                    Create task
                </button>
            </div>
        </form>
    </div>
);

const FormInput = ({ name, label, multiline = false, ...props }) => {
    const Input = multiline ? "textarea" : "input";

    return (
        <label className="block text-sm font-medium text-gray-700">
            {label}
            <Input
                name={name}
                rows={multiline ? 5 : undefined}
                className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                {...props}
            />
        </label>
    );
};

export default TaskForm;