import AnnouncementCard from "../../Announcements/Components/AnnouncementCard";

/**
 * AnnouncementsCard
 *
 * Props:
 *  - title       {string}   Card heading. Default: "Latest Announcements"
 *  - items       {Array}    Array of announcement objects:
 *                             { id, emoji, title, body, meta, accent }
 *                             accent: "indigo" | "gray" | "green" | "amber" | "rose"
 *  - onViewAll   {Function} Optional callback for "View all" button
 *  - className   {string}   Extra Tailwind classes for the wrapper
 */

const AnnouncementsCard = ({
  title = "Latest Announcements",
  items = [],
  onViewAll,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs text-indigo-600 font-medium hover:underline"
          >
            View all
          </button>
        )}
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <p className="text-xs text-gray-400 py-2 text-center">
          No announcements yet.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <AnnouncementCard
              key={item.id}
              announcement={item}
              variant="compact"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementsCard;
