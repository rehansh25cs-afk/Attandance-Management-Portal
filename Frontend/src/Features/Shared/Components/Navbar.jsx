import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useAuth } from "../../Auth/Hooks/useAuth";

const Navbar = ({ onMenuToggle }) => {
    const { pathname } = useLocation();
    const pageTitle = {
        "/admin/dashboard": "Dashboard",
        "/admin/candidates": "Candidates",
        "/admin/attendance": "Attendance",
        "/admin/tasks": "Tasks",
        "/admin/leave": "Leave",
        "/admin/announcements": "Announcements",
        "/candidate/dashboard": "Candidate Dashboard",
        "/candidate/attendance": "My Attendance",
        "/candidate/tasks": "My Tasks",
        "/candidate/leave": "Leave Requests",
        "/candidate/announcements": "Announcements",
    }[pathname] ?? "Admin Portal";
    const [searchOpen, setSearchOpen] = useState(false);
    const [notifications] = useState(3);

    const {handleGetMe} = useAuth();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            await handleGetMe();
        };

        fetchCurrentUser();
    }, []);

    const user = useSelector((state) => state.auth.user);

    console.log(user)

    return (
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between px-4 sm:px-6 h-16">

                {/* Left: Hamburger + Page title */}
                <div className="flex items-center gap-3">
                    {/* Mobile hamburger */}
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                        aria-label="Toggle sidebar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div>
                        <h1 className="text-base font-semibold text-gray-800">{pageTitle}</h1>
                        <p className="text-xs text-gray-400 hidden sm:block">
                            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </p>
                    </div>
                </div>

                {/* Right: Search + Notifications + Profile */}
                <div className="flex items-center gap-2">

                    {/* Search */}
                    <div className={`flex items-center transition-all duration-200 ${searchOpen ? "w-48 sm:w-64" : "w-9"} overflow-hidden`}>
                        {searchOpen ? (
                            <div className="relative w-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                                </svg>
                                <input
                                    autoFocus
                                    onBlur={() => setSearchOpen(false)}
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                                />
                            </div>
                        ) : (
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                                aria-label="Search"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Notifications */}
                    <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors" aria-label="Notifications">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9.33-5M13 21a2 2 0 01-4 0" />
                        </svg>
                        {notifications > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold bg-indigo-600 text-white rounded-full flex items-center justify-center">
                                {notifications}
                            </span>
                        )}
                    </button>

                    {/* Profile */}
                    <button className="flex items-center gap-2 ml-1 pl-3 border-l border-gray-200 group" aria-label="Profile">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-semibold">
                            {user?.name ? user.name.charAt(0) : "A"}
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-medium text-gray-700 leading-tight group-hover:text-indigo-600 transition-colors">{user?.name || "Admin"}</p>
                            <p className="text-xs text-gray-400">{user?.role || "Super Admin"}</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                </div>
            </div>
        </header>
    );
};

export default Navbar;
