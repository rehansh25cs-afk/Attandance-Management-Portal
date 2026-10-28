import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import Sidebar from "../../Shared/Components/AdminSidebar";
import Navbar from "../../Shared/Components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import AdminLeaveHeader from "../Components/AdminLeaveHeader";
import AdminLeaveRequestFilters from "../Components/AdminLeaveRequestFilters";
import AdminLeaveRequestTable from "../Components/AdminLeaveRequestTable";
import AdminLeaveSummary from "../Components/AdminLeaveSummary";
import { isDateWithinLeaveRange, toAdminRequest } from "../Components/leave.utils";
import { useLeaves } from "../Hooks/useLeaves";
import ErrorToast from "../../Shared/Components/ErrorToast";
import { setError } from "../state/leaves.slice";

const AdminLeave = () => {
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState("All requests");
    const [query, setQuery] = useState("");
    const { handleGetAllLeaves, handleUpdateLeaveStatus } = useLeaves();
    const { leaves, loading, error } = useSelector((state) => state.leaves);

    useEffect(() => {
        handleGetAllLeaves().catch((loadError) => {
            console.error("Failed to load all leave requests", loadError);
        });
    }, []);

    useEffect(() => {
        setRequests(leaves.map(toAdminRequest));
    }, [leaves]);

    const visibleRequests = useMemo(
        () =>
            requests.filter((request) => {
                const matchesQuery = `${request.name} ${request.type} ${request.id}`
                    .toLowerCase()
                    .includes(query.toLowerCase());

                return (
                    matchesQuery &&
                    (filter === "All requests" || request.status === filter)
                );
            }),
        [requests, query, filter],
    );
    const currentMonth = dayjs();
    const today = dayjs();
    const pendingRequestCount = requests.filter(
        (request) => request.status === "Pending",
    ).length;
    const approvedThisMonthCount = requests.filter(
        (request) =>
            request.status === "Approved" &&
            request.createdAt &&
            dayjs(request.createdAt).isSame(currentMonth, "month"),
    ).length;
    const peopleOnLeaveTodayCount = requests.filter(
        (request) =>
            request.status === "Approved" &&
            isDateWithinLeaveRange(request.dates, today),
    ).length;

    const updateStatus = async (id, nextStatus) => {
        try {
            await handleUpdateLeaveStatus({
                leaveId: id,
                status: nextStatus === "Declined" ? "Rejected" : nextStatus,
            });
            await handleGetAllLeaves();
        } catch (statusError) {
            console.error("Failed to update leave status", statusError);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <ErrorToast message={error} onDismiss={() => dispatch(setError(null))} />

            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <Navbar onMenuToggle={() => setSidebarOpen((open) => !open)} />
                <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <AdminLeaveHeader />

                        <AdminLeaveSummary
                            pendingRequestCount={pendingRequestCount}
                            approvedThisMonthCount={approvedThisMonthCount}
                            peopleOnLeaveTodayCount={peopleOnLeaveTodayCount}
                        />

                        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                            <AdminLeaveRequestFilters
                                visibleRequestCount={visibleRequests.length}
                                query={query}
                                onQueryChange={setQuery}
                                filter={filter}
                                onFilterChange={setFilter}
                            />
                            <AdminLeaveRequestTable
                                loading={loading}
                                visibleRequests={visibleRequests}
                                requestCount={requests.length}
                                onUpdateStatus={updateStatus}
                            />
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLeave;
