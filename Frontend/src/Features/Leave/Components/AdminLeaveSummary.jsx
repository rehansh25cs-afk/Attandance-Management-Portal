const AdminLeaveSummary = ({ pendingRequestCount, approvedThisMonthCount, peopleOnLeaveTodayCount }) => (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Pending review</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
                {pendingRequestCount}
            </p>
            <p className="mt-1 text-xs text-amber-600">
                Needs your attention
            </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Approved this month</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
                {approvedThisMonthCount}
            </p>
            <p className="mt-1 text-xs text-emerald-600">
                Across the organization
            </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">People on leave today</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
                {peopleOnLeaveTodayCount}
            </p>
            <p className="mt-1 text-xs text-gray-400">
                Including approved leave
            </p>
        </div>
    </section>
);

export default AdminLeaveSummary;
