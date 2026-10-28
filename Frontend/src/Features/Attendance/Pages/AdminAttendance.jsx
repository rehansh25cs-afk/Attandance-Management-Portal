import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import AdminSidebar from "../../Shared/Components/AdminSidebar";
import Navbar from "../../Shared/Components/Navbar";
import AttendancePageHeader from "../Components/AttendancePageHeader";
import AttendanceSummaryCards from "../Components/AttendanceSummaryCards";
import AdminAttendanceTable from "../Components/AdminAttendanceTable";
import { useAttendance } from "../Hooks/useAttendance";
import {
    downloadAttendanceCsv,
    getAdminAttendanceSummary,
    getLocalDateInputValue,
    toAdminAttendanceRow,
} from "../utils/attendance.utils";
import ErrorToast from "../../Shared/Components/ErrorToast";
import { useDispatch } from "react-redux";
import { setError } from "../state/attendance.slice";

const STATUS_FILTERS = ["All statuses", "Present", "Late", "Absent", "On leave"];

const AdminAttendance = () => {
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(getLocalDateInputValue());
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All statuses");
    const { handleGetAllAttendance } = useAttendance();
    const {
        attendanceRecords,
        totalTeam,
        loading,
        error,
    } = useSelector((state) => state.attendance);

    useEffect(() => {
        handleGetAllAttendance(selectedDate);
    }, [handleGetAllAttendance, selectedDate]);

    const attendanceRows = useMemo(
        () => attendanceRecords.map(toAdminAttendanceRow),
        [attendanceRecords]
    );

    const filteredRows = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        return attendanceRows.filter((record) => {
            const searchableText = `${record.name} ${record.role}`.toLowerCase();
            const matchesSearch = searchableText.includes(normalizedQuery);
            const matchesStatus =
                statusFilter === "All statuses" || record.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [attendanceRows, searchQuery, statusFilter]);

    const summary = getAdminAttendanceSummary(attendanceRecords, totalTeam);
    const summaryCards = [
        {
            label: "Total team",
            value: summary.totalTeam,
            note: "Registered candidates",
            tone: "indigo",
        },
        {
            label: "Present",
            value: summary.present,
            note: `${summary.attendanceRate}% attendance rate`,
            tone: "emerald",
        },
        {
            label: "Late arrivals",
            value: summary.late,
            note: "Arrived after the start time",
            tone: "amber",
        },
        {
            label: "Absent",
            value: summary.absent,
            note: "No attendance record today",
            tone: "rose",
        },
    ];

    const handleExport = () => {
        downloadAttendanceCsv(filteredRows, selectedDate);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
            <ErrorToast message={error} onDismiss={() => dispatch(setError(null))} />

            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <Navbar onMenuToggle={() => setSidebarOpen((open) => !open)} />

                <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <div className="mx-auto max-w-7xl">
                    <AttendancePageHeader
                        eyebrow="People management"
                        title="Attendance"
                        description="Monitor daily check-ins and attendance across your team."
                        action={
                            <button
                                type="button"
                                onClick={handleExport}
                                disabled={filteredRows.length === 0}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Export report
                            </button>
                        }
                    />

                    <section className="mb-5 rounded-xl border border-slate-200 bg-white p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-800">
                                    Daily attendance
                                </p>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Review check-ins and working hours for a selected day.
                                </p>
                            </div>

                            <label className="flex items-center gap-2 text-sm text-slate-500">
                                <span className="whitespace-nowrap">Select date</span>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(event) => setSelectedDate(event.target.value)}
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                />
                            </label>
                        </div>
                    </section>

                    <AttendanceSummaryCards
                        cards={summaryCards}
                        columns="sm:grid-cols-2 xl:grid-cols-4"
                    />

                    <section className="mb-5 rounded-xl border border-slate-200 bg-white p-5">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <label className="flex-1">
                                <span className="sr-only">Search team members</span>
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Search team members"
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                />
                            </label>

                            <label>
                                <span className="sr-only">Filter by status</span>
                                <select
                                    value={statusFilter}
                                    onChange={(event) => setStatusFilter(event.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-44"
                                >
                                    {STATUS_FILTERS.map((status) => (
                                        <option key={status}>{status}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </section>

                        <AdminAttendanceTable
                            records={filteredRows}
                            selectedDate={selectedDate}
                            loading={loading}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminAttendance;
