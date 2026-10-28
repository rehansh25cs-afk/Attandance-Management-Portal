import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CandidateSidebar from "../../Shared/Components/CandidateSidebar";
import Navbar from "../../Shared/Components/Navbar";
import AttendancePageHeader from "../Components/AttendancePageHeader";
import AttendanceSummaryCards from "../Components/AttendanceSummaryCards";
import CandidateAttendanceTable from "../Components/CandidateAttendanceTable";
import { useAttendance } from "../Hooks/useAttendance";
import {
    getAttendanceSummary,
    toCandidateAttendanceRow,
} from "../utils/attendance.utils";
import ErrorToast from "../../Shared/Components/ErrorToast";
import { setError } from "../state/attendance.slice";

const CandidateAttendance = () => {
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { handleGetAttendanceByUser } = useAttendance();
    const { attendanceRecords, loading, error } = useSelector(
        (state) => state.attendance
    );

    useEffect(() => {
        handleGetAttendanceByUser();
    }, [handleGetAttendanceByUser]);

    const summary = getAttendanceSummary(attendanceRecords);
    const tableRecords = attendanceRecords.map(toCandidateAttendanceRow);
    const summaryCards = [
        {
            label: "Attendance rate",
            value: `${summary.attendanceRate}%`,
            note: `${summary.daysPresent} of ${summary.totalRecords} recorded days`,
            tone: "indigo",
        },
        {
            label: "Days present",
            value: summary.daysPresent,
            note: "Across all records",
            tone: "emerald",
        },
        {
            label: "Hours worked",
            value: summary.hoursWorked,
            note: "Across all records",
            tone: "slate",
        },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900">
            <ErrorToast message={error} onDismiss={() => dispatch(setError(null))} />

            <CandidateSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <Navbar onMenuToggle={() => setSidebarOpen((open) => !open)} />

                <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <AttendancePageHeader
                        eyebrow="Your time at work"
                        title="My attendance"
                        description="Review your check-ins, working hours, and attendance history."
                    />

                    <AttendanceSummaryCards
                        cards={summaryCards}
                        columns="sm:grid-cols-3"
                    />

                    {loading && attendanceRecords.length === 0 ? (
                        <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                            Loading your attendance records...
                        </p>
                    ) : (
                        <CandidateAttendanceTable
                            records={tableRecords}
                            periodLabel="All recorded days"
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

export default CandidateAttendance;
