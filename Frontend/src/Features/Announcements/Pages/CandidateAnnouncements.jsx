import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CandidateSidebar from "../../Shared/Components/CandidateSidebar";
import Navbar from "../../Shared/Components/Navbar";
import { useAnnouncements } from "../Hooks/useAnnouncements";
import ErrorToast from "../../Shared/Components/ErrorToast";
import { setError } from "../state/announcements.slice";

const CandidateAnnouncements = () => {
    const dispatch = useDispatch();
    const [filter, setFilter] = useState("All updates");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const announcements = useSelector((state) => (
        Array.isArray(state.announcements.announcements)
            ? state.announcements.announcements
            : []
    ));
    const error = useSelector((state) => state.announcements.error);

    const {
        handleGetAllAnnouncements,
        handlePinAnnouncement,
    } = useAnnouncements();

    const visibleAnnouncements = announcements.filter((announcement) => (
        filter === "All updates" || announcement.category === filter
    ));

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                await handleGetAllAnnouncements();
            } catch (error) {
                console.error("Error fetching announcements:", error);
            }
        };

        fetchAnnouncements();
    }, []);

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900">
            <ErrorToast message={error} onDismiss={() => dispatch(setError(null))} />

            <CandidateSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <Navbar onMenuToggle={() => setSidebarOpen((open) => !open)} />

                <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <div className="mb-7">
                        <p className="mb-1 text-sm font-medium text-indigo-600">
                            Stay in the loop
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Announcements
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Read the latest news, reminders, and updates from your team.
                        </p>
                    </div>

                    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="font-semibold text-slate-900">Latest updates</h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Important information from your organization.
                            </p>
                        </div>

                        <select
                            value={filter}
                            onChange={(event) => setFilter(event.target.value)}
                            aria-label="Filter announcements"
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"
                        >
                            <option>All updates</option>
                            <option>Team update</option>
                            <option>Reminder</option>
                            <option>Company update</option>
                        </select>
                    </div>

                    <section className="space-y-4">
                        {visibleAnnouncements.map((announcement) => (
                            <article
                                key={announcement.id}
                                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                                        📢
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
                                                {announcement.category}
                                            </span>
                                            {announcement.pinned && (
                                                <span className="text-[11px] font-medium text-amber-600">
                                                    Pinned
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="mt-3 text-lg font-semibold text-slate-900">
                                            {announcement.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            {announcement.body}
                                        </p>

                                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                                            <p className="text-xs text-slate-500">
                                                <span className="font-medium text-slate-700">
                                                    {announcement.author}
                                                </span>{" "}
                                                · {announcement.date}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() => handlePinAnnouncement({ id: announcement.id })}
                                                className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                                            >
                                                {announcement.pinned ? "Unpin" : "Pin announcement"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}

                        {visibleAnnouncements.length === 0 && (
                            <p className="rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm text-slate-500">
                                No announcements in this category yet.
                            </p>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default CandidateAnnouncements;
