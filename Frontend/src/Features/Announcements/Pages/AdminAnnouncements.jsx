import { useState } from "react";
import Sidebar from "../../Shared/Components/AdminSidebar";
import Navbar from "../../Shared/Components/Navbar";
import { useEffect } from "react";
import { useAnnouncements } from "../Hooks/useAnnouncements";
import { useDispatch, useSelector } from "react-redux";
import ErrorToast from "../../Shared/Components/ErrorToast";
import { setError } from "../state/announcements.slice";



const AdminAnnouncements = () => {

    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState("All updates");

    const {
        handleGetAllAnnouncements,
        handleCreateAnnouncement,
        handlePinAnnouncement,
        handleDeleteAnnouncement,
    } = useAnnouncements();

    const announcements = useSelector((state) =>
        Array.isArray(state.announcements.announcements)
            ? state.announcements.announcements
            : [],
    );
    const error = useSelector((state) => state.announcements.error);



    useEffect(() => {
        async function fetchAnnouncements() {
            try {
                await handleGetAllAnnouncements();
            } catch (error) {
                console.error("Error fetching announcements:", error);
            }
        }

        fetchAnnouncements();
    }, []);

    const publishAnnouncement = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const title = formData.get("title").trim();
        const body = formData.get("body").trim();

        if (!title || !body) return;

        const category = formData.get("category");
        await handleCreateAnnouncement({ category, title, body, pinned: false });
        setShowForm(false);
    };

    const togglePinned = async (announcementId) => {
        await handlePinAnnouncement({ id: announcementId });
    };

    const removeAnnouncement = async (announcementId) => {
        if (!window.confirm("Delete this announcement?")) return;

        await handleDeleteAnnouncement({ id: announcementId });
    };

    const visibleAnnouncements = announcements.filter(
        (announcement) =>
            filter === "All updates" || announcement.category === filter,
    );




    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <ErrorToast message={error} onDismiss={() => dispatch(setError(null))} />

            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <Navbar
                    onMenuToggle={() =>
                        setSidebarOpen((isOpen) => !isOpen)
                    }
                />

                <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                            <div>
                                <p className="mb-1 text-sm font-medium text-indigo-600">
                                    Keep everyone in the loop
                                </p>
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                    Announcements
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Share updates, reminders, and good news with
                                    your team.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowForm(true)}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                            >
                                <span className="text-lg leading-none">+</span>
                                New announcement
                            </button>
                        </div>

                        <section className="mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-sm sm:p-8">
                            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                                <div className="max-w-xl">
                                    <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                                        TEAM NOTICEBOARD
                                    </span>
                                    <h2 className="mt-3 text-xl font-bold sm:text-2xl">
                                        Good communication keeps great teams
                                        moving.
                                    </h2>
                                    <p className="mt-2 text-sm leading-6 text-indigo-100">
                                        Post important information where
                                        everyone can find it. Your latest
                                        updates appear here for the whole team.
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
                                    <span className="text-2xl font-bold">
                                        {announcements.length}
                                    </span>
                                    <span className="text-xs leading-4 text-indigo-100">
                                        Published
                                        <br />
                                        updates
                                    </span>
                                </div>
                            </div>
                        </section>

                        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">
                                    Latest updates
                                </h2>
                                <p className="mt-0.5 text-xs text-gray-500">
                                    News and information from your
                                    organization.
                                </p>
                            </div>

                            <select
                                value={filter}
                                onChange={(event) =>
                                    setFilter(event.target.value)
                                }
                                aria-label="Filter announcements by category"
                                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 outline-none focus:border-indigo-400"
                            >
                                <option>All updates</option>
                                <option>Company update</option>
                                <option>Team update</option>
                                <option>Reminder</option>
                            </select>
                        </div>

                        <section className="space-y-4">
                            {visibleAnnouncements.map((announcement) => (
                                <article
                                    key={announcement.id}
                                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                            <svg
                                                className="h-5 w-5"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                                                />
                                            </svg>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${announcement.color}`}
                                                >
                                                    {announcement.category}
                                                </span>

                                                {announcement.pinned && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600">
                                                        <svg
                                                            className="h-3.5 w-3.5"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M16 3a1 1 0 011 1v5.586l2.707 2.707A1 1 0 0119 14h-5v7a1 1 0 01-2 0v-7H7a1 1 0 01-.707-1.707L9 9.586V4a1 1 0 011-1h6z" />
                                                        </svg>
                                                        Pinned
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="mt-3 text-lg font-semibold text-gray-900">
                                                {announcement.title}
                                            </h3>
                                            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
                                                {announcement.body}
                                            </p>

                                            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600">
                                                        {announcement.initials}
                                                    </span>
                                                    <span className="text-xs font-medium text-gray-700">
                                                        {announcement.author}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        · {announcement.date}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            togglePinned(
                                                                announcement._id,
                                                            )
                                                        }
                                                        className="rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
                                                    >
                                                        {announcement.pinned
                                                            ? "Unpin"
                                                            : "Pin announcement"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeAnnouncement(
                                                                announcement._id,
                                                            )
                                                        }
                                                        className="rounded-md px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}

                            {visibleAnnouncements.length === 0 && (
                                <p className="rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center text-sm text-gray-500">
                                    No announcements in this category yet.
                                </p>
                            )}
                        </section>
                    </div>
                </main>
            </div>

            {showForm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setShowForm(false);
                        }
                    }}
                >
                    <form
                        onSubmit={publishAnnouncement}
                        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
                    >
                        <div className="mb-5 flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    New announcement
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Write an update for your team.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                aria-label="Close"
                                className="rounded-md px-2 text-xl text-gray-400 hover:bg-gray-100"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Title
                                <input
                                    name="title"
                                    required
                                    placeholder="Give your update a clear title"
                                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                />
                            </label>

                            <label className="block text-sm font-medium text-gray-700">
                                Category
                                <select
                                    name="category"
                                    className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
                                >
                                    <option>Company update</option>
                                    <option>Team update</option>
                                    <option>Reminder</option>
                                </select>
                            </label>

                            <label className="block text-sm font-medium text-gray-700">
                                Message
                                <textarea
                                    name="body"
                                    rows="5"
                                    required
                                    placeholder="Share the details with your team..."
                                    className="mt-1.5 w-full resize-y rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                />
                            </label>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                                Publish update
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminAnnouncements;
