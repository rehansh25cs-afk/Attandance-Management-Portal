const PRESENT_STATUSES = new Set(["Present", "Late"]);
const AVATAR_COLORS = [
    "bg-indigo-100 text-indigo-700",
    "bg-rose-100 text-rose-700",
    "bg-amber-100 text-amber-700",
    "bg-emerald-100 text-emerald-700",
    "bg-sky-100 text-sky-700",
    "bg-violet-100 text-violet-700",
];

export const getAttendanceDate = (record) => record.date || record.createdAt;

export const isToday = (value) => {
    if (!value) {
        return false;
    }

    const date = new Date(value);
    const today = new Date();

    return date.toDateString() === today.toDateString();
};

export const formatAttendanceTime = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? "—"
        : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const formatAttendanceDate = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? "—"
        : date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
};

export const formatWorkedHours = (hoursWorked) => {
    const totalMinutes = Math.round(Number(hoursWorked || 0) * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
};

export const getLocalDateInputValue = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export const toCandidateAttendanceRow = (record) => ({
    id: record._id,
    date: formatAttendanceDate(getAttendanceDate(record)),
    checkIn: formatAttendanceTime(record.checkInTime),
    checkOut: formatAttendanceTime(record.checkOutTime),
    hours: record.hoursWorked == null ? "—" : formatWorkedHours(record.hoursWorked),
    status: record.status === "On Leave" ? "On leave" : record.status,
});

export const toAdminAttendanceRow = (record, index) => {
    const user = typeof record.user === "object" ? record.user : null;
    const name = user?.name || user?.email || "Candidate";
    const initials = name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return {
        id: record._id,
        name,
        role: user?.role || "Candidate",
        checkIn: formatAttendanceTime(record.checkInTime),
        checkOut: formatAttendanceTime(record.checkOutTime),
        hours: record.hoursWorked == null ? "In progress" : formatWorkedHours(record.hoursWorked),
        status: record.status === "On Leave" ? "On leave" : record.status,
        initials,
        color: AVATAR_COLORS[index % AVATAR_COLORS.length],
    };
};

export const getAttendanceSummary = (records) => {
    const attendedRecords = records.filter((record) => PRESENT_STATUSES.has(record.status));
    const totalRecords = records.length;
    const totalHours = records.reduce(
        (total, record) => total + Number(record.hoursWorked || 0),
        0
    );

    return {
        attendanceRate: totalRecords
            ? Math.round((attendedRecords.length / totalRecords) * 100)
            : 0,
        daysPresent: attendedRecords.length,
        totalRecords,
        hoursWorked: formatWorkedHours(totalHours),
    };
};

export const getAdminAttendanceSummary = (records, totalTeam) => {
    const presentRecords = records.filter((record) => PRESENT_STATUSES.has(record.status));
    const presentCount = presentRecords.length;
    const lateCount = records.filter((record) => record.status === "Late").length;
    const teamCount = Math.max(Number(totalTeam) || 0, presentCount);

    return {
        totalTeam: teamCount,
        present: presentCount,
        late: lateCount,
        absent: Math.max(teamCount - presentCount, 0),
        attendanceRate: teamCount ? Math.round((presentCount / teamCount) * 100) : 0,
    };
};

export const downloadAttendanceCsv = (records, date) => {
    const headers = ["Name", "Role", "Check in", "Check out", "Working hours", "Status"];
    const values = records.map((record) => [
        record.name,
        record.role,
        record.checkIn,
        record.checkOut,
        record.hours,
        record.status,
    ]);
    const escapeValue = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const csv = [headers, ...values].map((row) => row.map(escapeValue).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `attendance-${date}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
};

export const getTodayAttendance = (records) =>
    records.find((record) => isToday(getAttendanceDate(record))) || null;
