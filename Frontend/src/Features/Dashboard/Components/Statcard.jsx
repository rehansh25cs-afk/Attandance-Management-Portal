const Statcard = ({ title, value, icon, trend, trendLabel, accentColor = "indigo" }) => {
    const colorMap = {
        indigo: {
            bg: "bg-indigo-50",
            text: "text-indigo-600",
            badge: "bg-indigo-100 text-indigo-700",
        },
        green: {
            bg: "bg-green-50",
            text: "text-green-600",
            badge: "bg-green-100 text-green-700",
        },
        amber: {
            bg: "bg-amber-50",
            text: "text-amber-600",
            badge: "bg-amber-100 text-amber-700",
        },
        rose: {
            bg: "bg-rose-50",
            text: "text-rose-600",
            badge: "bg-rose-100 text-rose-700",
        },
    };

    const colors = colorMap[accentColor] || colorMap.indigo;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4 hover:border-indigo-200 hover:shadow-sm transition-all duration-200">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center ${colors.text}`}>
                    {icon}
                </div>
            </div>

            {(trend !== undefined || trendLabel) && (
                <div className="flex items-center gap-1.5">
                    {trend !== undefined && (
                        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md ${colors.badge}`}>
                            {trend > 0 ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            )}
                            {Math.abs(trend)}%
                        </span>
                    )}
                    {trendLabel && (
                        <span className="text-xs text-gray-400">{trendLabel}</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default Statcard;
