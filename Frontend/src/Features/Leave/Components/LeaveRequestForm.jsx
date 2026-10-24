import { useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { formatDateRange, getLeaveDays } from "./leave.utils";

const LeaveRequestForm = ({ onClose, onSubmit }) => {
    const [dateRange, setDateRange] = useState([null, null]);
    const selectedDates = formatDateRange(dateRange);
    const selectedDays = getLeaveDays(dateRange);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!selectedDates) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        onSubmit({
            leaveType: formData.get("leaveType"),
            Dates: formData.get("Dates"),
            days: Number(formData.get("days")),
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
            onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
            <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <div className="mb-5 flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Request leave</h2>
                        <p className="mt-1 text-sm text-slate-500">Send a request to your manager.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="text-xl text-slate-400 hover:text-slate-600"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-5">
                    <label className="block text-sm font-medium text-slate-700">
                        Leave type
                        <select
                            name="leaveType"
                            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                            defaultValue="Annual Leave"
                        >
                            <option>Annual Leave</option>
                            <option>Sick Leave</option>
                            <option>Personal Leave</option>
                        </select>
                    </label>

                    <div>
                        <p className="text-sm font-medium text-slate-700">Dates</p>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className="mt-1.5 grid gap-3 sm:grid-cols-2">
                                <DatePicker
                                    label="Start date"
                                    value={dateRange[0]}
                                    onChange={(startDate) =>
                                        setDateRange([
                                            startDate,
                                            startDate &&
                                            dateRange[1] &&
                                            dateRange[1].isBefore(startDate, "day")
                                                ? null
                                                : dateRange[1],
                                        ])
                                    }
                                    minDate={dayjs()}
                                    slotProps={{ textField: { size: "small", fullWidth: true } }}
                                />
                                <DatePicker
                                    label="End date"
                                    value={dateRange[1]}
                                    onChange={(endDate) => setDateRange([dateRange[0], endDate])}
                                    minDate={dateRange[0] || dayjs()}
                                    slotProps={{ textField: { size: "small", fullWidth: true } }}
                                />
                            </div>
                        </LocalizationProvider>
                        <input type="hidden" name="Dates" value={selectedDates} readOnly />
                        <p className="mt-2 text-xs text-slate-500">
                            {selectedDays > 0
                                ? `${selectedDays} ${selectedDays === 1 ? "day" : "days"} selected`
                                : "Select a start and end date"}
                        </p>
                    </div>

                    <input type="hidden" name="days" value={selectedDays} readOnly />
                </div>

                <button
                    type="submit"
                    disabled={!selectedDates}
                    className="mt-6 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    Submit request
                </button>
            </form>
        </div>
    );
};

export default LeaveRequestForm;
