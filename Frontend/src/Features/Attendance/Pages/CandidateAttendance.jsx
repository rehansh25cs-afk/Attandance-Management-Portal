import { useState } from "react";
import CandidateSidebar from "../../Shared/Components/CandidateSidebar";
import Navbar from "../../Shared/Components/Navbar";

const records = [
    ["Mon, Oct 12", "09:02 AM", "05:38 PM", "8h 36m", "Present"],
    ["Fri, Oct 9", "08:56 AM", "05:31 PM", "8h 35m", "Present"],
    ["Thu, Oct 8", "09:24 AM", "05:40 PM", "8h 16m", "Late"],
    ["Wed, Oct 7", "08:51 AM", "05:44 PM", "8h 53m", "Present"],
    ["Tue, Oct 6", "—", "—", "—", "On leave"],
];
const statusStyles = { Present: "bg-emerald-50 text-emerald-700", Late: "bg-amber-50 text-amber-700", "On leave": "bg-indigo-50 text-indigo-700" };

const CandidateAttendance = () => {
    const [month, setMonth] = useState("October 2026");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return <div className="flex min-h-screen bg-slate-50 text-slate-900">
        <CandidateSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col"><Navbar onMenuToggle={() => setSidebarOpen((open) => !open)} /><main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-7"><p className="mb-1 text-sm font-medium text-indigo-600">Your time at work</p><h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">My attendance</h1><p className="mt-2 text-sm text-slate-500">Review your check-ins, working hours, and attendance history.</p></div>
        <section className="mb-6 grid gap-4 sm:grid-cols-3">
            {[["Attendance rate", "92%", "21 of 23 working days", "text-indigo-600"], ["Days present", "21", "This month", "text-emerald-600"], ["Hours worked", "168h 24m", "This month", "text-slate-700"]].map(([label, value, note, tone]) => <article key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className={`mt-3 text-2xl font-bold ${tone}`}>{value}</p><p className="mt-1 text-xs text-slate-400">{note}</p></article>)}
        </section>
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold text-slate-900">Attendance history</h2><p className="mt-1 text-xs text-slate-500">Your daily attendance record.</p></div><select value={month} onChange={(event) => setMonth(event.target.value)} aria-label="Select month" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"><option>October 2026</option><option>September 2026</option></select></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{["Date", "Check in", "Check out", "Hours", "Status"].map((heading) => <th key={heading} className="px-5 py-3 font-medium">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{records.map((record) => <tr key={record[0]} className="hover:bg-slate-50/70">{record.map((cell, index) => <td key={`${record[0]}-${index}`} className="px-5 py-4 text-slate-600">{index === 4 ? <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[cell]}`}>{cell}</span> : cell}</td>)}</tr>)}</tbody></table></div>
        </section>
        </main></div>
    </div>;
};
export default CandidateAttendance;
