import dayjs from "dayjs";

export const ANNUAL_LEAVE_ALLOWANCE = 15;

export const leaveStatusStyles = {
    Pending: "bg-amber-50 text-amber-700",
    Approved: "bg-emerald-50 text-emerald-700",
    Declined: "bg-rose-50 text-rose-700",
};

export const candidateColors = [
    "bg-rose-100 text-rose-700",
    "bg-amber-100 text-amber-700",
    "bg-violet-100 text-violet-700",
    "bg-indigo-100 text-indigo-700",
    "bg-sky-100 text-sky-700",
];

export const formatDateRange = ([startDate, endDate]) => {
    if (!startDate || !endDate) {
        return "";
    }

    const start = startDate.format("YYYY-MM-DD");
    const end = endDate.format("YYYY-MM-DD");
    return start === end ? start : `${start} - ${end}`;
};

export const getLeaveDays = ([startDate, endDate]) => {
    if (!startDate || !endDate) {
        return 0;
    }

    return endDate.diff(startDate, "day") + 1;
};

export const getDaysFromDates = (dates) => {
    const [start, end = start] = dates.split(" - ");
    const startDate = dayjs(start);
    const endDate = dayjs(end);

    return startDate.isValid() && endDate.isValid()
        ? endDate.diff(startDate, "day") + 1
        : 0;
};

export const toCandidateRequest = (leave) => ({
    id: leave._id,
    type: leave.leaveType,
    dates: leave.Dates,
    days: getDaysFromDates(leave.Dates),
    submitted: leave.createdAt ? dayjs(leave.createdAt).format("MMM D, YYYY") : "Unknown",
    status: leave.status === "Rejected" ? "Declined" : leave.status,
});

export const isDateWithinLeaveRange = (dates, date) => {
    const [start, end = start] = dates.split(" - ");
    const startDate = dayjs(start);
    const endDate = dayjs(end);

    return (
        startDate.isValid() &&
        endDate.isValid() &&
        !date.isBefore(startDate, "day") &&
        !date.isAfter(endDate, "day")
    );
};

export const getCandidateName = (sentBy) => {
    if (typeof sentBy === "object" && sentBy !== null) {
        return sentBy.name || sentBy.email || "Candidate";
    }

    return "Candidate";
};

export const getCandidateInitials = (name) =>
    name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

export const toAdminRequest = (leave, index) => {
    const name = getCandidateName(leave.sentBy);

    return {
        id: leave._id,
        name,
        role: typeof leave.sentBy === "object" ? leave.sentBy.role || "Candidate" : "Candidate",
        type: leave.leaveType,
        dates: leave.Dates,
        days: getDaysFromDates(leave.Dates),
        submitted: leave.createdAt
            ? dayjs(leave.createdAt).format("MMM D, YYYY")
            : "Unknown",
        createdAt: leave.createdAt,
        reason: "Leave request",
        status: leave.status === "Rejected" ? "Declined" : leave.status,
        initials: getCandidateInitials(name),
        color: candidateColors[index % candidateColors.length],
    };
};
