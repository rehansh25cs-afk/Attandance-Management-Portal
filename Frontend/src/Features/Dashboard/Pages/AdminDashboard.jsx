import { useState } from "react";
import Sidebar from "../../Shared/Components/AdminSidebar";
import Navbar from "../../Shared/Components/Navbar";
import Statcard from "../Components/Statcard";
import AnnouncementsCard from "../Components/AnnouncementsCard";

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

/* ── Recent Activity Data ───────────────────────────────── */
const recentActivity = [
    {
        id: 1,
        type: "check-in",
        user: "Sarah Johnson",
        action: "checked in",
        time: "9:02 AM",
        avatar: "SJ",
        color: "green",
    },
    {
        id: 2,
        type: "task",
        user: "Ali Raza",
        action: "completed Task #12 – Report Submission",
        time: "9:45 AM",
        avatar: "AR",
        color: "indigo",
    },
    {
        id: 3,
        type: "leave",
        user: "Maria Khan",
        action: "submitted a leave request",
        time: "10:15 AM",
        avatar: "MK",
        color: "amber",
    },
    {
        id: 4,
        type: "announcement",
        user: "Admin",
        action: "posted a new announcement",
        time: "11:00 AM",
        avatar: "AD",
        color: "rose",
    },
    {
        id: 5,
        type: "check-in",
        user: "Omar Sheikh",
        action: "checked in (late)",
        time: "11:32 AM",
        avatar: "OS",
        color: "amber",
    },
];

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

/* ── Announcements Data ─────────────────────────────────── */
const announcementItems = [
    {
        id: 1,
        emoji: "📢",
        title: "Q4 Review Schedule",
        body: "All departments must submit their Q4 reports by Oct 15.",
        meta: "Posted today · Admin",
        accent: "indigo",
    },
    {
        id: 2,
        emoji: "🎉",
        title: "Team Outing – Oct 20",
        body: "Company outing planned. Mark your calendars!",
        meta: "Yesterday · HR Team",
        accent: "gray",
    },
];

/* ── Dashboard Page ─────────────────────────────────────── */
const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Navbar */}
                <Navbar onMenuToggle={() => setSidebarOpen((o) => !o)} />

                {/* Scrollable body */}
                <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">

                    {/* Welcome banner */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Welcome back, Admin! </h2>
                        <p className="text-sm text-gray-500 mt-0.5">Here's your organization's overview for today.</p>
                    </div>

                    {/* Stat cards grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                        <Statcard
                            title="Candidates"
                            value={48}
                            icon={<CandidatesIcon />}
                            trend={4}
                            trendLabel="vs last month"
                            accentColor="indigo"
                        />
                        <Statcard
                            title="Present Today"
                            value={36}
                            icon={<PresentIcon />}
                            trend={2}
                            trendLabel="vs yesterday"
                            accentColor="green"
                        />
                        <Statcard
                            title="Pending Tasks"
                            value={12}
                            icon={<TasksIcon />}
                            trend={-3}
                            trendLabel="vs last week"
                            accentColor="amber"
                        />
                        <Statcard
                            title="Leave Requests"
                            value={3}
                            icon={<LeaveIcon />}
                            trendLabel="Awaiting approval"
                            accentColor="rose"
                        />
                    </div>

                    {/* Bottom section: Activity + Quick Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                        {/* Recent Activity */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-800">Recent Activity</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">Recent check-ins, task updates and announcements.</p>
                                </div>
                                <button className="text-xs text-indigo-600 font-medium hover:underline">View all</button>
                            </div>

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
                        </div>

                        {/* Quick Summary */}
                        <div className="flex flex-col gap-4">
                            {/* Attendance Rate */}
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Today's Attendance Rate</h3>
                                <div className="flex items-end gap-2 mb-3">
                                    <span className="text-3xl font-bold text-gray-800">75%</span>
                                    <span className="text-sm text-green-500 font-medium mb-0.5">▲ On Track</span>
                                </div>
                                {/* Progress bar */}
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "75%" }} />
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-gray-400">
                                    <span>36 present</span>
                                    <span>48 total</span>
                                </div>
                            </div>

                            {/* Announcements */}
                            <AnnouncementsCard
                                title="Latest Announcements"
                                items={announcementItems}
                                onViewAll={() => console.log("View all announcements")}
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

