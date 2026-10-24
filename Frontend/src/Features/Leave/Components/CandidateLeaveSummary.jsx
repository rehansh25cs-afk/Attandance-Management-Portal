const CandidateLeaveSummary = ({ availableLeaveDays, usedLeaveDays, approvedRequestCount, pendingRequestCount }) => (
    <section className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
            ["Available balance", `${availableLeaveDays} days`, "Remaining this year"],
            ["Used this year", `${usedLeaveDays} days`, "Across approved requests"],
            ["Pending requests", pendingRequestCount, "Awaiting approval"],
        ].map(([label, value, note], index) => (
            <article key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
                <p className="mt-1 text-xs text-slate-400">
                    {index === 1
                        ? `Across ${approvedRequestCount} ${approvedRequestCount === 1 ? "request" : "requests"}`
                        : note}
                </p>
            </article>
        ))}
    </section>
);

export default CandidateLeaveSummary;
