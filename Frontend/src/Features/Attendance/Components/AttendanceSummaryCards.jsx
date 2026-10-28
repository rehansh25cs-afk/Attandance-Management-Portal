const valueStyles = {
    indigo: "text-indigo-600",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
    slate: "text-slate-700",
};

const AttendanceSummaryCards = ({ cards, columns }) => (
    <section className={`mb-6 grid gap-4 ${columns}`}>
        {cards.map((card) => (
            <article
                key={card.label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className={`mt-3 text-2xl font-bold ${valueStyles[card.tone]}`}>
                    {card.value}
                </p>
                <p className="mt-1 text-xs text-slate-400">{card.note}</p>
            </article>
        ))}
    </section>
);

export default AttendanceSummaryCards;
