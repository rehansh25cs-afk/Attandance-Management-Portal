import { useMemo, useState } from "react";
import Sidebar from "../../Shared/Components/AdminSidebar";
import Navbar from "../../Shared/Components/Navbar";

const attendanceRecords = [
    { id: "GN-1048", name: "Aarav Sharma", role: "Frontend Developer", department: "Engineering", checkIn: "08:54 AM", checkOut: "05:42 PM", hours: "8h 48m", status: "Present", initials: "AS", color: "bg-indigo-100 text-indigo-700" },
    { id: "GN-1047", name: "Meera Kapoor", role: "Product Designer", department: "Design", checkIn: "09:02 AM", checkOut: "05:31 PM", hours: "8h 29m", status: "Present", initials: "MK", color: "bg-rose-100 text-rose-700" },
    { id: "GN-1046", name: "Zayan Ahmed", role: "Backend Developer", department: "Engineering", checkIn: "09:24 AM", checkOut: "—", hours: "In progress", status: "Late", initials: "ZA", color: "bg-amber-100 text-amber-700" },
    { id: "GN-1045", name: "Priya Nair", role: "HR Associate", department: "People", checkIn: "08:47 AM", checkOut: "05:38 PM", hours: "8h 51m", status: "Present", initials: "PN", color: "bg-emerald-100 text-emerald-700" },
    { id: "GN-1044", name: "Rohan Mehta", role: "QA Analyst", department: "Quality", checkIn: "—", checkOut: "—", hours: "—", status: "Absent", initials: "RM", color: "bg-sky-100 text-sky-700" },
    { id: "GN-1043", name: "Sara Khan", role: "Content Strategist", department: "Marketing", checkIn: "08:58 AM", checkOut: "—", hours: "In progress", status: "Present", initials: "SK", color: "bg-violet-100 text-violet-700" },
];

const statusStyles = {
    Present: "bg-emerald-50 text-emerald-700",
    Late: "bg-amber-50 text-amber-700",
    Absent: "bg-rose-50 text-rose-700",
};

const AdminAttandance = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("All statuses");
    const [date, setDate] = useState("2026-10-11");

    const visibleRecords = useMemo(() => attendanceRecords.filter((record) => {
        const matchesQuery = `${record.name} ${record.role} ${record.department} ${record.id}`.toLowerCase().includes(query.toLowerCase());
        return matchesQuery && (status === "All statuses" || record.status === status);
    }), [query, status]);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <Navbar onMenuToggle={() => setSidebarOpen((open) => !open)} />
                <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                            <div>
                                <p className="mb-1 text-sm font-medium text-indigo-600">People management</p>
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Attendance</h1>
                                <p className="mt-1 text-sm text-gray-500">Monitor daily check-ins and attendance across your team.</p>
                            </div>
                            <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3" /></svg>
                                Export report
                            </button>
                        </div>

                        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div><p className="text-sm font-semibold text-gray-800">Daily attendance</p><p className="mt-0.5 text-xs text-gray-500">Review check-ins and working hours for a selected day.</p></div>
                            <label className="flex items-center gap-2 text-sm text-gray-500"><span className="whitespace-nowrap">Select date</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /></label>
                        </div>

                        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-xl border border-gray-200 bg-white p-5"><div className="flex items-center justify-between"><p className="text-sm text-gray-500">Total team</p><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m16 0v-2a4 4 0 00-3-3.87M10 11a4 4 0 100-8 4 4 0 000 8zm7-7.87a4 4 0 010 7.75" /></svg></span></div><p className="mt-3 text-2xl font-bold text-gray-900">48</p><p className="mt-1 text-xs text-gray-400">Registered candidates</p></div>
                            <div className="rounded-xl border border-gray-200 bg-white p-5"><div className="flex items-center justify-between"><p className="text-sm text-gray-500">Present</p><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" /></svg></span></div><p className="mt-3 text-2xl font-bold text-gray-900">36</p><p className="mt-1 text-xs font-medium text-emerald-600">75% attendance rate</p></div>
                            <div className="rounded-xl border border-gray-200 bg-white p-5"><div className="flex items-center justify-between"><p className="text-sm text-gray-500">Late arrivals</p><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" d="M12 7v5l3 2" /></svg></span></div><p className="mt-3 text-2xl font-bold text-gray-900">4</p><p className="mt-1 text-xs text-gray-400">Arrived after 9:15 AM</p></div>
                            <div className="rounded-xl border border-gray-200 bg-white p-5"><div className="flex items-center justify-between"><p className="text-sm text-gray-500">Absent</p><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" d="m9 9 6 6m0-6-6 6" /></svg></span></div><p className="mt-3 text-2xl font-bold text-gray-900">5</p><p className="mt-1 text-xs text-gray-400">3 on approved leave</p></div>
                        </section>

                        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                            <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                <div><h2 className="text-base font-semibold text-gray-900">Attendance records <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{visibleRecords.length}</span></h2><p className="mt-1 text-xs text-gray-500">Daily check-in and check-out overview.</p></div>
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <label className="relative block"><span className="sr-only">Search team</span><svg className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path strokeLinecap="round" d="m20 20-4-4"/></svg><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search team" className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-52" /></label>
                                    <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by attendance status" className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"><option>All statuses</option><option>Present</option><option>Late</option><option>Absent</option></select>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[850px] text-left text-sm">
                                    <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-3 font-medium">Team member</th><th className="px-5 py-3 font-medium">Check in</th><th className="px-5 py-3 font-medium">Check out</th><th className="px-5 py-3 font-medium">Working hours</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3"><span className="sr-only">Actions</span></th></tr></thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {visibleRecords.map((record) => <tr key={record.id} className="transition hover:bg-gray-50/70">
                                            <td className="px-5 py-4"><div className="flex items-center gap-3"><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${record.color}`}>{record.initials}</div><div><p className="font-medium text-gray-900">{record.name}</p><p className="mt-0.5 text-xs text-gray-500">{record.role} · {record.id}</p></div></div></td>
                                            <td className="px-5 py-4 font-medium text-gray-700">{record.checkIn}</td><td className="px-5 py-4 text-gray-600">{record.checkOut}</td><td className="px-5 py-4 text-gray-600">{record.hours}</td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[record.status]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{record.status}</span></td><td className="px-5 py-4 text-right"><button aria-label={`More attendance actions for ${record.name}`} className="rounded-md px-2 py-1 text-lg leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700">···</button></td>
                                        </tr>)}
                                    </tbody>
                                </table>
                                {visibleRecords.length === 0 && <div className="px-5 py-12 text-center"><p className="text-sm font-medium text-gray-700">No attendance records found</p><p className="mt-1 text-sm text-gray-500">Try changing your search or status filter.</p></div>}
                            </div>
                            <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-3 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between"><span>Showing {visibleRecords.length ? 1 : 0}–{visibleRecords.length} of 48 team members</span><div className="flex items-center gap-2"><button disabled className="rounded-md border border-gray-200 px-3 py-1.5 text-gray-400">Previous</button><button className="rounded-md border border-gray-200 px-3 py-1.5 text-gray-600 hover:bg-gray-50">Next</button></div></div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminAttandance;
