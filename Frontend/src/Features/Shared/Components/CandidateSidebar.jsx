import { NavLink } from "react-router";
import { useSelector } from "react-redux";

const navItems = [
    {
        label: "Dashboard",
        to: "/candidate/dashboard",
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    },
    {
        label: "My Attendance",
        to: "/candidate/attendance",
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
    },
    {
        label: "My Tasks",
        to: "/candidate/tasks",
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    },
    {
        label: "Leave Requests",
        to: "/candidate/leave",
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    },
    {
        label: "Announcements",
        to: "/candidate/announcements",
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />,
    },
];

const CandidateSidebar = ({ isOpen = false, onClose = () => {} }) => {
    const user = useSelector((state) => state.auth.user);
    const userName = user?.name || user?.email || "Candidate";
    const userInitials = userName
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <>
        {isOpen && (
            <button
                type="button"
                aria-label="Close navigation"
                className="fixed inset-0 z-20 bg-slate-950/40 lg:hidden"
                onClick={onClose}
            />
        )}
        <aside className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-bold leading-tight text-slate-800">Genius Network</p>
                    <p className="text-xs text-slate-400">Candidate Portal</p>
                </div>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label="Candidate navigation">
                <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Workspace</p>
                {navItems.map(({ label, to, icon }) => (
                    <NavLink
                        key={label}
                        to={to}
                        onClick={onClose}
                        className={({ isActive }) => `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                    >
                        {({ isActive }) => <>
                            <svg className={`h-5 w-5 ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{icon}</svg>
                            {label}
                            {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600" />}
                        </>}
                    </NavLink>
                ))}
            </nav>

            <div className="border-t border-slate-100 p-4">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">{userInitials}</div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">{userName}</p>
                        <p className="truncate text-xs text-slate-500">Candidate</p>
                    </div>
                </div>
            </div>
        </aside>
        </>
    );
};

export default CandidateSidebar;
