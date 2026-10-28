import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../Auth/Hooks/useAuth";

const pageTitles = {
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
};

const navigationItems = [
    { label: "Dashboard", adminPath: "/admin/dashboard", candidatePath: "/candidate/dashboard" },
    { label: "Candidates", adminPath: "/admin/candidates" },
    { label: "Attendance", adminPath: "/admin/attendance", candidatePath: "/candidate/attendance" },
    { label: "Tasks", adminPath: "/admin/tasks", candidatePath: "/candidate/tasks" },
    { label: "Leave", adminPath: "/admin/leave", candidatePath: "/candidate/leave" },
    { label: "Announcements", adminPath: "/admin/announcements", candidatePath: "/candidate/announcements" },
];

const getAccountType = (user) => {
    const accountType = user?.permissions || user?.role || "";
    return accountType.toLowerCase();
};

const getTimeLabel = (date) => {
    if (!date) {
        return "Recently";
    }

    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

const SearchIcon = ({ className = "h-5 w-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="m20 20-4-4" />
    </svg>
);

const BellIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9.33-5M13 21a2 2 0 01-4 0" />
    </svg>
);

const Navbar = ({ onMenuToggle }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { handleLogOut } = useAuth();
    const user = useSelector((state) => state.auth.user);
    const announcements = useSelector((state) => state.announcements.announcements ?? []);
    const tasks = useSelector((state) => state.tasks.tasks ?? []);
    const leaves = useSelector((state) => state.leaves.leaves ?? []);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [readNotificationIds, setReadNotificationIds] = useState([]);
    const [loggingOut, setLoggingOut] = useState(false);

    const accountType = getAccountType(user);
    const isAdmin = accountType === "admin" || accountType === "superadmin";
    const pageTitle = pageTitles[pathname] ?? "Attendance Portal";

    const searchResults = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return navigationItems
            .map((item) => ({
                label: item.label,
                path: isAdmin ? item.adminPath : item.candidatePath,
            }))
            .filter((item) => item.path && item.label.toLowerCase().includes(query));
    }, [isAdmin, searchQuery]);

    const notifications = useMemo(() => {
        const items = [];

        if (isAdmin) {
            leaves
                .filter((leave) => leave.status === "Pending")
                .slice(0, 5)
                .forEach((leave) => {
                    items.push({
                        id: `leave-${leave._id}`,
                        title: "Pending leave request",
                        message: `${leave.leaveType || "Leave"} needs your review.`,
                        date: leave.createdAt,
                        path: "/admin/leave",
                    });
                });
        } else {
            tasks
                .filter((task) => task.status !== "Done")
                .slice(0, 3)
                .forEach((task) => {
                    items.push({
                        id: `task-${task._id || task.id}`,
                        title: "Task needs attention",
                        message: task.title || "You have an unfinished task.",
                        date: task.dueDate || task.createdAt,
                        path: "/candidate/tasks",
                    });
                });
        }

        announcements.slice(0, 5).forEach((announcement) => {
            items.push({
                id: `announcement-${announcement._id}`,
                title: announcement.title || "New announcement",
                message: announcement.body || "Your team posted a new announcement.",
                date: announcement.createdAt,
                path: isAdmin ? "/admin/announcements" : "/candidate/announcements",
            });
        });

        return items.slice(0, 8);
    }, [announcements, isAdmin, leaves, tasks]);

    const unreadNotifications = notifications.filter(
        (notification) => !readNotificationIds.includes(notification.id)
    );

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const firstResult = searchResults[0];

        if (firstResult) {
            navigate(firstResult.path);
            setSearchOpen(false);
            setSearchQuery("");
        }
    };

    const handleNotificationClick = (notification) => {
        setReadNotificationIds((currentIds) => [
            ...new Set([...currentIds, notification.id]),
        ]);
        setNotificationsOpen(false);
        navigate(notification.path);
    };

    const markNotificationsAsRead = () => {
        setReadNotificationIds(notifications.map((notification) => notification.id));
    };

    const handleLogout = async () => {
        setLoggingOut(true);

        try {
            await handleLogOut();
            navigate("/", { replace: true });
        } finally {
            setLoggingOut(false);
            setProfileOpen(false);
        }
    };

    return (
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onMenuToggle}
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 lg:hidden"
                        aria-label="Toggle sidebar"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div>
                        <h1 className="text-base font-semibold text-gray-800">{pageTitle}</h1>
                        <p className="hidden text-xs text-gray-400 sm:block">
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        {searchOpen ? (
                            <form onSubmit={handleSearchSubmit} className="relative w-48 sm:w-64">
                                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <input
                                    autoFocus
                                    type="search"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    onKeyDown={(event) => event.key === "Escape" && setSearchOpen(false)}
                                    placeholder="Search pages..."
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    aria-label="Search pages"
                                />
                                {searchQuery && (
                                    <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                                        {searchResults.length > 0 ? searchResults.map((result) => (
                                            <button
                                                key={result.path}
                                                type="button"
                                                onClick={() => {
                                                    navigate(result.path);
                                                    setSearchOpen(false);
                                                    setSearchQuery("");
                                                }}
                                                className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                                            >
                                                {result.label}
                                            </button>
                                        )) : (
                                            <p className="px-3 py-2 text-sm text-gray-500">No pages found.</p>
                                        )}
                                    </div>
                                )}
                            </form>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setSearchOpen(true)}
                                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
                                aria-label="Search pages"
                            >
                                <SearchIcon />
                            </button>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setNotificationsOpen((open) => !open)}
                            className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
                            aria-label="Notifications"
                            aria-expanded={notificationsOpen}
                        >
                            <BellIcon />
                            {unreadNotifications.length > 0 && (
                                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                                    {unreadNotifications.length > 9 ? "9+" : unreadNotifications.length}
                                </span>
                            )}
                        </button>

                        {notificationsOpen && (
                            <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                                    <h2 className="text-sm font-semibold text-gray-800">Notifications</h2>
                                    {unreadNotifications.length > 0 && (
                                        <button type="button" onClick={markNotificationsAsRead} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                {notifications.length > 0 ? (
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <button
                                                key={notification.id}
                                                type="button"
                                                onClick={() => handleNotificationClick(notification)}
                                                className={`block w-full border-b border-gray-100 px-4 py-3 text-left hover:bg-gray-50 ${readNotificationIds.includes(notification.id) ? "opacity-60" : ""}`}
                                            >
                                                <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                                                <p className="mt-1 line-clamp-2 text-xs text-gray-500">{notification.message}</p>
                                                <p className="mt-1 text-[11px] text-gray-400">{getTimeLabel(notification.date)}</p>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="px-4 py-8 text-center text-sm text-gray-500">You are all caught up.</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setProfileOpen((open) => !open)}
                            className="group ml-1 flex items-center gap-2 border-l border-gray-200 pl-3"
                            aria-label="Open profile menu"
                            aria-expanded={profileOpen}
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                            </div>
                            <div className="hidden text-left sm:block">
                                <p className="text-sm font-medium leading-tight text-gray-700 transition-colors group-hover:text-indigo-600">
                                    {user?.name || "User"}
                                </p>
                                <p className="text-xs capitalize text-gray-400">
                                    {user?.permissions || user?.role || "User"}
                                </p>
                            </div>
                            <svg className="hidden h-4 w-4 text-gray-400 sm:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                            </svg>
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                                <div className="border-b border-gray-100 px-3 py-2">
                                    <p className="truncate text-sm font-medium text-gray-800">{user?.name || "User"}</p>
                                    <p className="truncate text-xs text-gray-500">{user?.email || ""}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loggingOut ? "Logging out..." : "Log out"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
