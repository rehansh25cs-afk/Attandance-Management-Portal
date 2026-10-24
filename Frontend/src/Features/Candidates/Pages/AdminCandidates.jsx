import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../Shared/Components/AdminSidebar";
import Navbar from "../../Shared/Components/Navbar";
import { useAuth } from "../../Auth/Hooks/useAuth";

const statusStyles = {
    Active: "bg-emerald-50 text-emerald-700",
    "On leave": "bg-amber-50 text-amber-700",
    Inactive: "bg-gray-100 text-gray-600",
};

const avatarStyles = [
    "bg-indigo-100 text-indigo-700",
    "bg-rose-100 text-rose-700",
    "bg-amber-100 text-amber-700",
    "bg-emerald-100 text-emerald-700",
    "bg-sky-100 text-sky-700",
    "bg-violet-100 text-violet-700",
];

const candidateStatuses = ["All candidates", "Active", "On leave", "Inactive"];

const AdminCandidates = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showAddCandidateForm, setShowAddCandidateForm] = useState(false);
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [isLoadingCandidates, setIsLoadingCandidates] = useState(true);
    const [candidateError, setCandidateError] = useState("");
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All candidates");

    const { handleRegister, handleGetAllCandidates } = useAuth();

    const visibleCandidates = useMemo(() => {
        const searchTerm = query.trim().toLowerCase();

        return candidates.filter((candidate) => {
            const candidateText = `${candidate.name} ${candidate.email} ${candidate.role} ${candidate.id}`.toLowerCase();
            const matchesQuery = candidateText.includes(searchTerm);
            const matchesStatus = statusFilter === "All candidates"
                || candidate.status === statusFilter;

            return matchesQuery && matchesStatus;
        });
    }, [candidates, query, statusFilter]);

    const loadCandidates = async () => {
        setIsLoadingCandidates(true);
        setCandidateError("");

        try {
            const data = await handleGetAllCandidates();
            const receivedCandidates = Array.isArray(data?.candidates)
                ? data.candidates
                : [];

            setCandidates(receivedCandidates.map((candidate, index) => ({
                ...candidate,
                id: candidate._id || candidate.id,
                status: candidate.status || (candidate.isActive ? "Active" : "Inactive"),
                joined: candidate.createdAt
                    ? new Date(candidate.createdAt).toLocaleDateString()
                    : "N/A",
                initials: getInitials(candidate.name),
                color: avatarStyles[index % avatarStyles.length],
            })));
        } catch (error) {
            setCandidateError(error?.message || "Could not load candidates.");
        } finally {
            setIsLoadingCandidates(false);
        }
    };

    useEffect(() => {
        loadCandidates();
    }, []);

    const handleCreateCandidate = async (event) => {
        event.preventDefault();
        setFormError("");
        setIsSubmitting(true);

        const form = event.currentTarget;
        const formData = new FormData(form);

        try {
            await handleRegister({
                name: formData.get("name"),
                email: formData.get("email"),
                password: formData.get("password"),
                role: formData.get("role"),
                permissions: formData.get("permissions") || "candidate",
            });

            form.reset();
            setShowAddCandidateForm(false);
            await loadCandidates();
        } catch (error) {
            setFormError(error?.message || "Could not create candidate. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <Navbar onMenuToggle={() => setSidebarOpen((open) => !open)} />

                <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <PageHeader onAddCandidate={() => setShowAddCandidateForm(true)} />

                        <CandidateSummary candidates={candidates} />

                        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                            <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">
                                        All candidates
                                        <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                            {candidates.length}
                                        </span>
                                    </h2>
                                    <p className="mt-1 text-xs text-gray-500">
                                        A directory of everyone in your organization.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <label className="relative block">
                                        <span className="sr-only">Search candidates</span>
                                        <input
                                            value={query}
                                            onChange={(event) => setQuery(event.target.value)}
                                            placeholder="Search candidates"
                                            className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-56"
                                        />
                                    </label>

                                    <select
                                        value={statusFilter}
                                        onChange={(event) => setStatusFilter(event.target.value)}
                                        aria-label="Filter by status"
                                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                    >
                                        {candidateStatuses.map((status) => (
                                            <option key={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <CandidateTable
                                candidates={visibleCandidates}
                                isLoading={isLoadingCandidates}
                                error={candidateError}
                            />

                            <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-3 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                                <span>
                                    Showing {visibleCandidates.length ? 1 : 0} - {visibleCandidates.length} of {candidates.length} candidates
                                </span>
                            </div>
                        </section>
                    </div>
                </main>
            </div>

            {showAddCandidateForm && (
                <CandidateForm
                    formError={formError}
                    isSubmitting={isSubmitting}
                    onSubmit={handleCreateCandidate}
                    onClose={() => setShowAddCandidateForm(false)}
                />
            )}
        </div>
    );
};

const getInitials = (name = "") => (
    name
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "?"
);

const PageHeader = ({ onAddCandidate }) => (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
            <p className="mb-1 text-sm font-medium text-indigo-600">People management</p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Candidates</h1>
            <p className="mt-1 text-sm text-gray-500">
                Manage your team members and candidate records.
            </p>
        </div>

        <button
            type="button"
            onClick={onAddCandidate}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
            Add candidate
        </button>
    </div>
);

const CandidateSummary = ({ candidates }) => {
    const activeCount = candidates.filter((candidate) => candidate.status === "Active").length;
    const leaveCount = candidates.filter((candidate) => candidate.status === "On leave").length;

    return (
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard label="Total candidates" value={candidates.length} hint="Current team members" />
            <SummaryCard label="Active" value={activeCount} hint="Currently active" />
            <SummaryCard label="On leave" value={leaveCount} hint="Returning soon" />
        </section>
    );
};

const SummaryCard = ({ label, value, hint }) => (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
    </div>
);

const CandidateTable = ({ candidates, isLoading, error }) => (
    <div className="overflow-x-auto">
        <table className="w-full min-w-190 text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                    <th className="px-5 py-3 font-medium">Candidate</th>
                    <th className="px-5 py-3 font-medium">Role</th>
                    <th className="px-5 py-3 font-medium">Joined</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3">
                        <span className="sr-only">Actions</span>
                    </th>
                </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
                {candidates.map((candidate) => (
                    <CandidateRow key={candidate.id} candidate={candidate} />
                ))}
            </tbody>
        </table>

        {isLoading && (
            <div className="px-5 py-12 text-center text-sm text-gray-500">
                Loading candidates...
            </div>
        )}

        {!isLoading && error && (
            <div role="alert" className="px-5 py-12 text-center text-sm text-red-600">
                {error}
            </div>
        )}

        {!isLoading && !error && candidates.length === 0 && (
            <div className="px-5 py-12 text-center">
                <p className="text-sm font-medium text-gray-700">No candidates found</p>
                <p className="mt-1 text-sm text-gray-500">
                    Try changing your search or status filter.
                </p>
            </div>
        )}
    </div>
);

const CandidateRow = ({ candidate }) => (
    <tr className="transition hover:bg-gray-50/70">
        <td className="px-5 py-4">
            <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${candidate.color}`}>
                    {candidate.initials}
                </div>
                <div>
                    <p className="font-medium text-gray-900">{candidate.name}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{candidate.email}</p>
                    <p className="mt-0.5 text-xs text-gray-400">ID: {candidate.id}</p>
                </div>
            </div>
        </td>
        <td className="px-5 py-4 text-gray-700">{candidate.role}</td>
        <td className="px-5 py-4 text-gray-600">{candidate.joined}</td>
        <td className="px-5 py-4">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[candidate.status]}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {candidate.status}
            </span>
        </td>
        <td className="px-5 py-4 text-right">
            <button
                type="button"
                aria-label={`More actions for ${candidate.name}`}
                className="rounded-md px-2 py-1 text-lg leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
                ...
            </button>
        </td>
    </tr>
);

const CandidateForm = ({ formError, isSubmitting, onSubmit, onClose }) => (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900/40 p-4"
        onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
        }}
    >
        <form
            onSubmit={onSubmit}
            className="my-auto w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
            aria-labelledby="add-candidate-title"
        >
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <h2 id="add-candidate-title" className="text-lg font-semibold text-gray-900">
                        Add candidate
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Enter the account details for the new team member.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close form"
                    className="rounded-md px-2 text-xl leading-6 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                    x
                </button>
            </div>

            <div className="space-y-4">
                <FormInput name="name" label="Name" type="text" autoComplete="name" required placeholder="e.g. Alex Morgan" />
                <FormInput name="email" label="Email" type="email" autoComplete="email" required placeholder="name@example.com" />
                <FormInput name="password" label="Password" type="password" autoComplete="new-password" required placeholder="Enter a password" />
                <FormInput name="role" label="Role" type="text" required placeholder="e.g. Frontend Developer" />

                <fieldset className="block text-sm font-medium text-gray-700">
                    <legend>Permissions</legend>
                    <label className="mt-2 flex cursor-pointer items-center gap-2 font-normal">
                        <input name="permissions" type="radio" value="admin" className="h-4 w-4 accent-indigo-600" />
                        Register as an admin
                    </label>
                </fieldset>
            </div>

            {formError && (
                <p role="alert" className="mt-4 text-sm text-red-600">
                    {formError}
                </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
                    {isSubmitting ? "Creating..." : "Create candidate"}
                </button>
            </div>
        </form>
    </div>
);

const FormInput = ({ label, name, ...props }) => (
    <label className="block text-sm font-medium text-gray-700">
        {label}
        <input
            name={name}
            {...props}
            className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
    </label>
);

export default AdminCandidates;