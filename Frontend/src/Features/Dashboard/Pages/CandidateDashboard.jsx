import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import CandidateSidebar from "../../Shared/Components/CandidateSidebar";
import Navbar from "../../Shared/Components/Navbar";
import AnnouncementCard from "../../Announcements/Components/AnnouncementCard";
import { useAttendance } from "../../Attendance/Hooks/useAttendance";
import {
    formatAttendanceTime,
    getAttendanceDate,
    getAttendanceSummary,
    getTodayAttendance,
} from "../../Attendance/utils/attendance.utils";
import { useTasks } from "../../Tasks/Hooks/useTasks";
import { formatDueDate, normalizeTask } from "../../Tasks/Components/task.utils";
import { useLeaves } from "../../Leave/Hooks/useLeaves";
import { ANNUAL_LEAVE_ALLOWANCE, toCandidateRequest } from "../../Leave/Components/leave.utils";
import { useAnnouncements } from "../../Announcements/Hooks/useAnnouncements";

const announcementAccents = {
    "Company update": "indigo",
    "People & culture": "green",
    Reminder: "amber",
};

const announcementEmojis = {
    "Company update": "📢",
    "People & culture": "🎉",
    Reminder: "⏰",
};

const upcomingStatusStyles = {
    rose: "bg-rose-50 text-rose-700",
    indigo: "bg-indigo-50 text-indigo-700",
    slate: "bg-slate-100 text-slate-600",
};

const DashboardIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const isTaskAssignedToUser = (task, userId) => {
    if (!userId) {
        return false;
    }

    const assignedTo = typeof task.assignedTo === "object"
        ? task.assignedTo?._id ?? task.assignedTo?.id
        : task.assignedTo;

    return String(assignedTo) === String(userId);
};

const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
        return "Good morning";
    }

    if (hour < 17) {
        return "Good afternoon";
    }

    return "Good evening";
};

const startOfDay = (date) => {
    const nextDate = new Date(date);
    nextDate.setHours(0, 0, 0, 0);
    return nextDate;
};

const countWeekdaysThroughToday = () => {
    const today = startOfDay(new Date());
    const cursor = new Date(today.getFullYear(), today.getMonth(), 1);
    let count = 0;

    while (cursor <= today) {
        const day = cursor.getDay();

        if (day !== 0 && day !== 6) {
            count += 1;
        }

        cursor.setDate(cursor.getDate() + 1);
    }

    return count;
};

const isSameMonth = (value) => {
    if (!value) {
        return false;
    }

    const date = new Date(value);
    const today = new Date();

    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
};

const getTaskDueDate = (task) => {
    if (!task.due) {
        return null;
    }

    const date = new Date(`${String(task.due).slice(0, 10)}T00:00:00`);

    return Number.isNaN(date.getTime()) ? null : date;
};

const formatRelativeDay = (value) => {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return "Today";
    }

    if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

const getUpcomingTaskMeta = (task) => {
    const dueDate = getTaskDueDate(task);
    const today = startOfDay(new Date());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (dueDate && dueDate.getTime() === today.getTime()) {
        return { label: "Due today", tone: "rose", dueText: "Today" };
    }

    if (dueDate && dueDate.getTime() === tomorrow.getTime()) {
        return { label: task.status === "In Progress" ? "In progress" : "Due tomorrow", tone: "indigo", dueText: "Tomorrow" };
    }

    if (task.status === "In Progress") {
        return { label: "In progress", tone: "indigo", dueText: formatDueDate(task.due) };
    }

    return { label: "To do", tone: "slate", dueText: formatDueDate(task.due) };
};

const CandidateDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const {
        handleCheckIn,
        handleCheckOut,
        handleGetAttendanceByUser,
    } = useAttendance();
    const { handleGetAllTasks, tasks } = useTasks();
    const { handleGetLeaves } = useLeaves();
    const { handleGetAllAnnouncements } = useAnnouncements();

    const user = useSelector((state) => state.auth.user);
    const { attendanceRecords, loading, error } = useSelector(
        (state) => state.attendance
    );
    const leaveRecords = useSelector((state) =>
        Array.isArray(state.leaves.leaves) ? state.leaves.leaves : []
    );
    const announcements = useSelector((state) =>
        Array.isArray(state.announcements.announcements)
            ? state.announcements.announcements
            : []
    );
    const tasksError = useSelector((state) => state.tasks.error);
    const leavesError = useSelector((state) => state.leaves.error);
    const announcementsError = useSelector((state) => state.announcements.error);

    const currentUserId = user?._id ?? user?.id;
    const firstName = user?.name?.split(" ")[0] || "there";

    useEffect(() => {
        handleGetAttendanceByUser();
        handleGetAllTasks().catch(() => undefined);
        handleGetLeaves().catch(() => undefined);
        handleGetAllAnnouncements();
    }, [handleGetAttendanceByUser, handleGetAllTasks]);

    const todayAttendance = getTodayAttendance(attendanceRecords);
    const workSession = {
        status: todayAttendance?.checkOutTime
            ? "Completed"
            : todayAttendance?.checkInTime
                ? "In progress"
                : "Not started",
        checkIn: formatAttendanceTime(todayAttendance?.checkInTime),
        checkOut: formatAttendanceTime(todayAttendance?.checkOutTime),
    };

    const canCheckIn = !todayAttendance && !loading;
    const canCheckOut = Boolean(todayAttendance?.checkInTime) &&
        !todayAttendance?.checkOutTime &&
        !loading;

    const assignedTasks = useMemo(
        () => tasks
            .filter((task) => isTaskAssignedToUser(task, currentUserId))
            .map(normalizeTask),
        [tasks, currentUserId]
    );

    const tasksInProgress = assignedTasks.filter((task) => task.status === "In Progress");
    const openTasks = assignedTasks.filter((task) => task.status !== "Done");
    const dueThisWeekCount = openTasks.filter((task) => {
        const dueDate = getTaskDueDate(task);

        if (!dueDate) {
            return false;
        }

        const today = startOfDay(new Date());
        const weekFromNow = new Date(today);
        weekFromNow.setDate(today.getDate() + 7);

        return dueDate >= today && dueDate <= weekFromNow;
    }).length;

    const monthRecords = attendanceRecords.filter((record) =>
        isSameMonth(getAttendanceDate(record))
    );
    const monthSummary = getAttendanceSummary(monthRecords);
    const weekdaysSoFar = countWeekdaysThroughToday();
    const attendanceRate = weekdaysSoFar
        ? Math.round((monthSummary.daysPresent / weekdaysSoFar) * 100)
        : 0;

    const leaveRequests = leaveRecords.map(toCandidateRequest);
    const usedLeaveDays = leaveRequests
        .filter((request) => request.status === "Approved")
        .reduce((total, request) => total + request.days, 0);
    const availableLeaveDays = Math.max(ANNUAL_LEAVE_ALLOWANCE - usedLeaveDays, 0);

    const upcomingTasks = [...openTasks]
        .sort((left, right) => {
            const leftDue = getTaskDueDate(left)?.getTime() ?? Number.MAX_SAFE_INTEGER;
            const rightDue = getTaskDueDate(right)?.getTime() ?? Number.MAX_SAFE_INTEGER;

            return leftDue - rightDue;
        })
        .slice(0, 4)
        .map((task) => ({
            ...task,
            ...getUpcomingTaskMeta(task),
        }));

    const latestAnnouncements = [...announcements]
        .sort((left, right) => {
            if (Boolean(right.pinned) !== Boolean(left.pinned)) {
                return right.pinned ? 1 : -1;
            }

            return new Date(right.time || 0) - new Date(left.time || 0);
        })
        .slice(0, 2)
        .map((announcement) => ({
            id: announcement._id ?? announcement.id,
            emoji: announcementEmojis[announcement.category] || "📢",
            title: announcement.title,
            body: announcement.body,
            author: announcement.author || "Admin",
            date: formatRelativeDay(announcement.time),
            category: announcement.category,
            accent: announcementAccents[announcement.category] || "indigo",
            pinned: announcement.pinned,
        }));

    const statCards = [
        {
            label: "Attendance this month",
            value: `${attendanceRate}%`,
            note: `${monthSummary.daysPresent} of ${weekdaysSoFar} working days`,
            tone: "indigo",
            icon: "↗",
        },
        {
            label: "Tasks in progress",
            value: String(tasksInProgress.length),
            note: `${dueThisWeekCount} due this week`,
            tone: "amber",
            icon: "✓",
        },
        {
            label: "Leave balance",
            value: `${availableLeaveDays} days`,
            note: `${usedLeaveDays} used of ${ANNUAL_LEAVE_ALLOWANCE} this year`,
            tone: "green",
            icon: "◷",
        },
    ];

    const dashboardError = tasksError || leavesError || announcementsError;

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900">
            <CandidateSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex min-w-0 flex-1 flex-col">
                <Navbar onMenuToggle={() => setSidebarOpen((open) => !open)} />

                <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <section className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <p className="mb-1 text-sm font-medium text-indigo-600">Your workspace</p>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                {getGreeting()}, {firstName} <span aria-hidden="true">👋</span>
                            </h1>
                            <p className="mt-2 text-sm text-slate-500">Here’s what’s happening with your work today.</p>
                        </div>
                        <Link to="/candidate/attendance" className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:self-auto">
                            <DashboardIcon />
                            View my attendance
                        </Link>
                    </section>

                    {dashboardError && (
                        <p className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {dashboardError}
                        </p>
                    )}

                    <section aria-label="Your summary" className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {statCards.map((card) => (
                            <article key={card.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
                                <div className="flex items-start justify-between">
                                    <p className="text-sm font-medium text-slate-500">{card.label}</p>
                                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg font-semibold ${card.tone === "indigo" ? "bg-indigo-50 text-indigo-600" : card.tone === "amber" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`} aria-hidden="true">{card.icon}</span>
                                </div>
                                <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{card.value}</p>
                                <p className="mt-1 text-xs text-slate-400">{card.note}</p>
                            </article>
                        ))}
                    </section>

                    <section className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50/70 p-5 shadow-sm shadow-indigo-100/50 sm:p-6" aria-labelledby="work-session-heading">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 id="work-session-heading" className="text-base font-semibold text-slate-900">Today’s work session</h2>
                                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${workSession.status === "In progress" ? "bg-emerald-100 text-emerald-700" : workSession.status === "Completed" ? "bg-slate-200 text-slate-700" : "bg-white text-slate-600"}`}>
                                        {workSession.status}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-slate-500">Track your workday with a quick check-in and check-out.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 sm:min-w-[18rem]">
                                <div className="rounded-lg border border-indigo-100 bg-white px-4 py-3">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Check-in</p>
                                    <p className="mt-1 text-lg font-semibold text-slate-800" aria-live="polite">{workSession.checkIn}</p>
                                </div>
                                <div className="rounded-lg border border-indigo-100 bg-white px-4 py-3">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Check-out</p>
                                    <p className="mt-1 text-lg font-semibold text-slate-800" aria-live="polite">{workSession.checkOut}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                                <button
                                    type="button"
                                    onClick={handleCheckIn}
                                    disabled={!canCheckIn}
                                    className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-300"
                                >
                                    Check in
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCheckOut}
                                    disabled={!canCheckOut}
                                    className="rounded-lg border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:text-slate-400"
                                >
                                    Check out
                                </button>
                            </div>
                        </div>
                        {error && (
                            <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                {error}
                            </p>
                        )}
                    </section>

                    <div className="grid gap-6 xl:grid-cols-5">
                        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6 xl:col-span-3" aria-labelledby="tasks-heading">
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div>
                                    <h2 id="tasks-heading" className="text-base font-semibold text-slate-900">Upcoming tasks</h2>
                                    <p className="mt-1 text-sm text-slate-500">Keep an eye on your next deadlines.</p>
                                </div>
                                <Link to="/candidate/tasks" className="shrink-0 text-sm font-medium text-indigo-600 hover:text-indigo-700">All tasks <span aria-hidden="true">→</span></Link>
                            </div>
                            {upcomingTasks.length === 0 ? (
                                <p className="py-8 text-center text-sm text-slate-400">
                                    You have no upcoming tasks.
                                </p>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {upcomingTasks.map((task) => (
                                        <div key={task.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
                                            <div className="flex min-w-0 flex-1 items-start gap-3">
                                                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-slate-800">{task.title}</p>
                                                    <p className="mt-1 text-xs text-slate-400">{task.project} <span className="px-1">·</span> Due {task.dueText}</p>
                                                </div>
                                            </div>
                                            <span className={`self-start rounded-full px-2.5 py-1 text-xs font-medium sm:self-auto ${upcomingStatusStyles[task.tone]}`}>{task.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="space-y-4 xl:col-span-2" aria-labelledby="announcements-heading">
                            <div className="flex items-end justify-between gap-3">
                                <div>
                                    <h2 id="announcements-heading" className="text-base font-semibold text-slate-900">Latest announcements</h2>
                                    <p className="mt-1 text-sm text-slate-500">Updates from your team.</p>
                                </div>
                                <Link to="/candidate/announcements" className="shrink-0 text-sm font-medium text-indigo-600 hover:text-indigo-700">View all</Link>
                            </div>
                            {latestAnnouncements.length === 0 ? (
                                <p className="rounded-xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-400">
                                    No announcements yet.
                                </p>
                            ) : (
                                latestAnnouncements.map((announcement) => (
                                    <AnnouncementCard key={announcement.id} announcement={announcement} className="!rounded-xl !p-4 !shadow-none" />
                                ))
                            )}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CandidateDashboard;
