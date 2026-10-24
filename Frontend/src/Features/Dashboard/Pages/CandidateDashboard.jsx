import { useState } from "react";
import { Link } from "react-router";
import CandidateSidebar from "../../Shared/Components/CandidateSidebar";
import Navbar from "../../Shared/Components/Navbar";
import AnnouncementCard from "../../Announcements/Components/AnnouncementCard";

const announcements = [
    {
        id: 1,
        emoji: "📢",
        title: "Weekly project check-in",
        body: "Please update your task progress before Friday's team sync.",
        author: "HR Team",
        date: "Today",
        category: "Team update",
        accent: "indigo",
    },
    {
        id: 2,
        emoji: "🎉",
        title: "Welcome to the new sprint",
        body: "The new sprint is underway. Review your assigned tasks and reach out if you need support.",
        author: "Admin",
        date: "Yesterday",
        category: "Reminder",
        accent: "green",
    },
];

const statCards = [
    { label: "Attendance this month", value: "92%", note: "21 of 23 working days", tone: "indigo", icon: "↗" },
    { label: "Tasks in progress", value: "4", note: "2 due this week", tone: "amber", icon: "✓" },
    { label: "Leave balance", value: "8 days", note: "Available this year", tone: "green", icon: "◷" },
];

const upcomingTasks = [
    { title: "Prepare weekly progress report", project: "Operations", due: "Today", status: "Due today", tone: "rose" },
    { title: "Review onboarding checklist", project: "Team onboarding", due: "Tomorrow", status: "In progress", tone: "indigo" },
    { title: "Submit sprint notes", project: "Product team", due: "Oct 16", status: "To do", tone: "slate" },
];

const statusStyles = {
    rose: "bg-rose-50 text-rose-700",
    indigo: "bg-indigo-50 text-indigo-700",
    slate: "bg-slate-100 text-slate-600",
};

const DashboardIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CandidateDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [workSession, setWorkSession] = useState({ status: "Not started", checkIn: "—", checkOut: "—" });

    const handleStartWork = () => {
        setWorkSession({
            status: "In progress",
            checkIn: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
            checkOut: "—",
        });
    };

    const handleEndWork = () => {
        setWorkSession((session) => ({
            ...session,
            status: "Completed",
            checkOut: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        }));
    };

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900">
            <CandidateSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex min-w-0 flex-1 flex-col">
                <Navbar onMenuToggle={() => setSidebarOpen((open) => !open)} />

                <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <section className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <p className="mb-1 text-sm font-medium text-indigo-600">Your workspace</p>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Good morning, Sarah <span aria-hidden="true">👋</span></h1>
                            <p className="mt-2 text-sm text-slate-500">Here’s what’s happening with your work today.</p>
                        </div>
                        <Link to="/candidate/attendance" className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:self-auto">
                            <DashboardIcon />
                            View my attendance
                        </Link>
                    </section>

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
                                <button type="button" onClick={handleStartWork} disabled={workSession.status !== "Not started"} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-300">Start Work</button>
                                <button type="button" onClick={handleEndWork} disabled={workSession.status !== "In progress"} className="rounded-lg border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:text-slate-400">End Work</button>
                            </div>
                        </div>
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
                            <div className="divide-y divide-slate-100">
                                {upcomingTasks.map((task) => (
                                    <div key={task.title} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
                                        <div className="flex min-w-0 flex-1 items-start gap-3">
                                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                            </span>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-slate-800">{task.title}</p>
                                                <p className="mt-1 text-xs text-slate-400">{task.project} <span className="px-1">·</span> Due {task.due}</p>
                                            </div>
                                        </div>
                                        <span className={`self-start rounded-full px-2.5 py-1 text-xs font-medium sm:self-auto ${statusStyles[task.tone]}`}>{task.status}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4 xl:col-span-2" aria-labelledby="announcements-heading">
                            <div className="flex items-end justify-between gap-3">
                                <div>
                                    <h2 id="announcements-heading" className="text-base font-semibold text-slate-900">Latest announcements</h2>
                                    <p className="mt-1 text-sm text-slate-500">Updates from your team.</p>
                                </div>
                                <Link to="/candidate/announcements" className="shrink-0 text-sm font-medium text-indigo-600 hover:text-indigo-700">View all</Link>
                            </div>
                            {announcements.map((announcement) => (
                                <AnnouncementCard key={announcement.id} announcement={announcement} className="!rounded-xl !p-4 !shadow-none" />
                            ))}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CandidateDashboard;
