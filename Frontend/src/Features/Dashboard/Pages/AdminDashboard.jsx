import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Sidebar from "../../Shared/Components/AdminSidebar";
import Navbar from "../../Shared/Components/Navbar";
import Statcard from "../Components/Statcard";
import AnnouncementsCard from "../Components/AnnouncementsCard";
import { useAttendance } from "../../Attendance/Hooks/useAttendance";
import {
    formatAttendanceTime,
    getAdminAttendanceSummary,
    getLocalDateInputValue,
} from "../../Attendance/utils/attendance.utils";
import { useTasks } from "../../Tasks/Hooks/useTasks";
import { normalizeTask } from "../../Tasks/Components/task.utils";
import { useLeaves } from "../../Leave/Hooks/useLeaves";
import { getCandidateName } from "../../Leave/Components/leave.utils";
import { useAnnouncements } from "../../Announcements/Hooks/useAnnouncements";

/* ── Stat Icons ─────────────────────────────────────────── */
const CandidatesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6 5.87a4 4 0 10-8 0m8 0H9m4-8a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const PresentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
);

const TasksIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
);

const LeaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const avatarColors = {
    green: "bg-green-100 text-green-700",
    indigo: "bg-indigo-100 text-indigo-700",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-700",
};

const dotColors = {
    green: "bg-green-400",
    indigo: "bg-indigo-400",
    amber: "bg-amber-400",
    rose: "bg-rose-400",
};

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

const getInitials = (name) =>
    String(name || "AD")
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

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
        return "Posted today";
    }

    if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

const formatActivityTime = (value) => {
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
    const time = formatAttendanceTime(date);

    if (date.toDateString() === today.toDateString()) {
        return time;
    }

    if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${time}`;
    }

    return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${time}`;
};

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const { handleGetAllAttendance } = useAttendance();
    const { handleGetAllTasks, tasks } = useTasks();
    const { handleGetAllLeaves } = useLeaves();
    const { handleGetAllAnnouncements } = useAnnouncements();

    const user = useSelector((state) => state.auth.user);
    const {
        attendanceRecords,
        totalTeam,
        loading: attendanceLoading,
        error: attendanceError,
    } = useSelector((state) => state.attendance);
    const { loading: tasksLoading, error: tasksError } = useSelector((state) => state.tasks);
    const {
        leaves,
        loading: leavesLoading,
        error: leavesError,
    } = useSelector((state) => state.leaves);
    const announcements = useSelector((state) =>
        Array.isArray(state.announcements.announcements)
            ? state.announcements.announcements
            : []
    );
    const announcementsError = useSelector((state) => state.announcements.error);

    useEffect(() => {
        handleGetAllAttendance(getLocalDateInputValue());
        handleGetAllTasks().catch(() => undefined);
        handleGetAllLeaves().catch(() => undefined);
        handleGetAllAnnouncements();
    }, [handleGetAllAttendance, handleGetAllTasks]);

    const summary = getAdminAttendanceSummary(attendanceRecords, totalTeam);
    const pendingTasks = useMemo(
        () => tasks.map(normalizeTask).filter((task) => task.status !== "Done"),
        [tasks]
    );
    const leaveList = useMemo(
        () => (Array.isArray(leaves) ? leaves : []),
        [leaves]
    );
    const pendingLeaves = leaveList.filter((leave) => leave.status === "Pending");
    const firstName = user?.name?.split(" ")[0] || "Admin";
    const errorMessage = attendanceError || tasksError || leavesError || announcementsError;

    const announcementItems = useMemo(() => {
        return [...announcements]
            .sort((left, right) => new Date(right.time || 0) - new Date(left.time || 0))
            .slice(0, 3)
            .map((announcement) => ({
                id: announcement._id ?? announcement.id,
                emoji: announcementEmojis[announcement.category] || "📢",
                title: announcement.title,
                body: announcement.body,
                meta: `${formatRelativeDay(announcement.time)} · ${announcement.author || "Admin"}`,
                accent: announcementAccents[announcement.category] || "gray",
            }));
    }, [announcements]);

    const recentActivity = useMemo(() => {
        const checkInItems = attendanceRecords.map((record) => {
            const person = typeof record.user === "object" && record.user
                ? record.user.name || record.user.email || "Candidate"
                : "Candidate";
            const isLate = record.status === "Late";

            return {
                id: `attendance-${record._id}`,
                type: "check-in",
                user: person,
                action: isLate ? "checked in (late)" : "checked in",
                time: formatActivityTime(record.checkInTime),
                timestamp: new Date(record.checkInTime || 0).getTime(),
                avatar: getInitials(person),
                color: isLate ? "amber" : "green",
            };
        });

        const taskItems = tasks.map(normalizeTask)
            .filter((task) => task.status === "Done")
            .map((task) => ({
                id: `task-${task.id}`,
                type: "task",
                user: task.assignee || "Candidate",
                action: `completed ${task.title}`,
                time: formatActivityTime(task.updatedAt || task.createdAt),
                timestamp: new Date(task.updatedAt || task.createdAt || 0).getTime(),
                avatar: getInitials(task.assignee),
                color: "indigo",
            }));

        const leaveItems = leaveList.map((leave) => {
            const person = getCandidateName(leave.sentBy);

            return {
                id: `leave-${leave._id}`,
                type: "leave",
                user: person,
                action: "submitted a leave request",
                time: formatActivityTime(leave.createdAt),
                timestamp: new Date(leave.createdAt || 0).getTime(),
                avatar: getInitials(person),
                color: "amber",
            };
        });

        const announcementActivity = announcements.map((announcement) => ({
            id: `announcement-${announcement._id ?? announcement.id}`,
            type: "announcement",
            user: announcement.author || "Admin",
            action: "posted a new announcement",
            time: formatActivityTime(announcement.time),
            timestamp: new Date(announcement.time || 0).getTime(),
            avatar: getInitials(announcement.author || "Admin"),
            color: "rose",
        }));

        return [...checkInItems, ...taskItems, ...leaveItems, ...announcementActivity]
            .sort((left, right) => right.timestamp - left.timestamp)
            .slice(0, 5);
    }, [announcements, attendanceRecords, leaveList, tasks]);

    const isLoading = attendanceLoading || tasksLoading || leavesLoading;

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar onMenuToggle={() => setSidebarOpen((open) => !open)} />

                <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Welcome back, {firstName}!</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Here's your organization's overview for today.</p>
                    </div>

                    {errorMessage && (
                        <p className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {errorMessage}
                        </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                        <Statcard
                            title="Candidates"
                            value={isLoading && !summary.totalTeam ? "—" : summary.totalTeam}
                            icon={<CandidatesIcon />}
                            trendLabel="Registered team members"
                            accentColor="indigo"
                        />
                        <Statcard
                            title="Present Today"
                            value={attendanceLoading ? "—" : summary.present}
                            icon={<PresentIcon />}
                            trendLabel={`${summary.attendanceRate}% of the team`}
                            accentColor="green"
                        />
                        <Statcard
                            title="Pending Tasks"
                            value={tasksLoading ? "—" : pendingTasks.length}
                            icon={<TasksIcon />}
                            trendLabel="Not completed"
                            accentColor="amber"
                        />
                        <Statcard
                            title="Leave Requests"
                            value={leavesLoading ? "—" : pendingLeaves.length}
                            icon={<LeaveIcon />}
                            trendLabel="Awaiting approval"
                            accentColor="rose"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-800">Recent Activity</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">Recent check-ins, task updates and announcements.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => navigate("/admin/attendance")}
                                    className="text-xs text-indigo-600 font-medium hover:underline"
                                >
                                    View all
                                </button>
                            </div>

                            {recentActivity.length === 0 ? (
                                <p className="py-8 text-center text-sm text-gray-400">
                                    No recent activity yet.
                                </p>
                            ) : (
                                <ul className="space-y-3">
                                    {recentActivity.map((item) => (
                                        <li key={item.id} className="flex items-start gap-3">
                                            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold ${avatarColors[item.color]}`}>
                                                {item.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-medium">{item.user}</span>{" "}
                                                    <span className="text-gray-500">{item.action}</span>
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                                            </div>
                                            <span className={`mt-2 w-2 h-2 rounded-full shrink-0 ${dotColors[item.color]}`} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Today's Attendance Rate</h3>
                                <div className="flex items-end gap-2 mb-3">
                                    <span className="text-3xl font-bold text-gray-800">{summary.attendanceRate}%</span>
                                    <span className={`text-sm font-medium mb-0.5 ${summary.attendanceRate >= 75 ? "text-green-500" : "text-amber-500"}`}>
                                        {summary.attendanceRate >= 75 ? "▲ On Track" : "Needs attention"}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className="bg-indigo-500 h-2 rounded-full"
                                        style={{ width: `${summary.attendanceRate}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-gray-400">
                                    <span>{summary.present} present</span>
                                    <span>{summary.totalTeam} total</span>
                                </div>
                            </div>

                            <AnnouncementsCard
                                title="Latest Announcements"
                                items={announcementItems}
                                onViewAll={() => navigate("/admin/announcements")}
                                className="flex-1"
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
