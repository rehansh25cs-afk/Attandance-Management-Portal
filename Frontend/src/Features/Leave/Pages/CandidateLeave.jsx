import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CandidateSidebar from "../../Shared/Components/CandidateSidebar";
import Navbar from "../../Shared/Components/Navbar";
import CandidateLeaveHeader from "../Components/CandidateLeaveHeader";
import CandidateLeaveRequestList from "../Components/CandidateLeaveRequestList";
import CandidateLeaveSummary from "../Components/CandidateLeaveSummary";
import LeaveRequestForm from "../Components/LeaveRequestForm";
import {
    ANNUAL_LEAVE_ALLOWANCE,
    toCandidateRequest,
} from "../Components/leave.utils";
import { useLeaves } from "../Hooks/useLeaves";
import ErrorToast from "../../Shared/Components/ErrorToast";
import { setError } from "../state/leaves.slice";

const CandidateLeave = () => {
    const dispatch = useDispatch();
    const [showForm, setShowForm] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { handleRequestLeave, handleGetLeaves } = useLeaves();
    const { leaves, loading, error } = useSelector((state) => state.leaves);

    const requests = leaves.map(toCandidateRequest);
    const approvedRequests = requests.filter((request) => request.status === "Approved");
    const usedLeaveDays = approvedRequests.reduce((total, request) => total + request.days, 0);
    const availableLeaveDays = Math.max(ANNUAL_LEAVE_ALLOWANCE - usedLeaveDays, 0);
    const pendingRequestCount = requests.filter((request) => request.status === "Pending").length;

    useEffect(() => {
        handleGetLeaves().catch((loadError) => {
            console.error("Failed to load leave requests", loadError);
        });
    }, []);

    const submitLeaveRequest = async ({ leaveType, Dates }) => {
        try {
            await handleRequestLeave({ leaveType, Dates });
            await handleGetLeaves();
            setShowForm(false);
        } catch (submitError) {
            console.error("Failed to submit leave request", submitError);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900">
            <ErrorToast message={error} onDismiss={() => dispatch(setError(null))} />

            <CandidateSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex min-w-0 flex-1 flex-col">
                <Navbar onMenuToggle={() => setSidebarOpen((open) => !open)} />
                <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <CandidateLeaveHeader
                        onRequestLeave={() => setShowForm(true)}
                    />

                    <CandidateLeaveSummary
                        availableLeaveDays={availableLeaveDays}
                        usedLeaveDays={usedLeaveDays}
                        approvedRequestCount={approvedRequests.length}
                        pendingRequestCount={pendingRequestCount}
                    />

                    <CandidateLeaveRequestList loading={loading} requests={requests} />
                </main>
            </div>

            {showForm && <LeaveRequestForm onClose={() => setShowForm(false)} onSubmit={submitLeaveRequest} />}
        </div>
    );
};

export default CandidateLeave;
