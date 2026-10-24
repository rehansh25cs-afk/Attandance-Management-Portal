/**
 * Reusable announcement item.
 *
 * Props:
 *  - announcement {Object} Announcement data. Supported fields:
 *      id, emoji, title, body, meta, accent, category, color,
 *      author, date, initials, pinned
 *  - variant      {"compact" | "detailed"} Presentation style. Defaults to
 *                 "detailed" for full announcement pages.
 *  - onTogglePin  {Function} Optional callback used by admin screens.
 *  - className    {string} Extra classes for the card wrapper.
 */

const accentStyles = {
  indigo: {
    wrapper: "bg-indigo-50 border-indigo-100",
    title: "text-indigo-700",
  },
  green: {
    wrapper: "bg-green-50 border-green-100",
    title: "text-green-700",
  },
  amber: {
    wrapper: "bg-amber-50 border-amber-100",
    title: "text-amber-700",
  },
  rose: {
    wrapper: "bg-rose-50 border-rose-100",
    title: "text-rose-700",
  },
  gray: {
    wrapper: "bg-gray-50 border-gray-100",
    title: "text-gray-700",
  },
};

const fallbackAccentByColor = {
  "bg-indigo-50 text-indigo-700": "indigo",
  "bg-emerald-50 text-emerald-700": "green",
  "bg-amber-50 text-amber-700": "amber",
  "bg-rose-50 text-rose-700": "rose",
};

const AnnouncementCard = ({
  announcement = {},
  variant = "detailed",
  onTogglePin,
  className = "",
}) => {
  const item = announcement;
  const accent = item.accent ?? fallbackAccentByColor[item.color] ?? "gray";
  const styles = accentStyles[accent] ?? accentStyles.gray;

  if (variant === "compact") {
    return (
      <div className={`rounded-lg border p-3 ${styles.wrapper} ${className}`}>
        <p className={`text-xs font-semibold ${styles.title}`}>
          {item.emoji && <span className="mr-1">{item.emoji}</span>}
          {item.title}
        </p>
        {item.body && <p className="mt-1 text-xs text-gray-500">{item.body}</p>}
        {item.meta && (
          <p className="mt-1.5 text-[11px] text-gray-400">{item.meta}</p>
        )}
      </div>
    );
  }

  return (
    <article
      className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {item.emoji ? (
            <span className="text-xl" aria-hidden="true">
              {item.emoji}
            </span>
          ) : (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {(item.category || item.pinned) && (
            <div className="flex flex-wrap items-center gap-2">
              {item.category && (
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.color ?? "bg-gray-100 text-gray-700"}`}
                >
                  {item.category}
                </span>
              )}
              {item.pinned && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M16 3a1 1 0 011 1v5.586l2.707 2.707A1 1 0 0119 14h-5v7a1 1 0 01-2 0v-7H7a1 1 0 01-.707-1.707L9 9.586V4a1 1 0 011-1h6z" />
                  </svg>
                  Pinned
                </span>
              )}
            </div>
          )}

          <h3 className="mt-3 text-lg font-semibold text-gray-900">
            {item.title}
          </h3>
          {item.body && (
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
              {item.body}
            </p>
          )}

          {(item.author || item.date || onTogglePin) && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
              {(item.author || item.date) && (
                <div className="flex items-center gap-2">
                  {item.author && (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600">
                  {item.initials ?? String(item.author).slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  {item.author && (
                    <span className="text-xs font-medium text-gray-700">
                      {item.author}
                    </span>
                  )}
                  {item.date && <span className="text-xs text-gray-400">· {item.date}</span>}
                </div>
              )}

              {onTogglePin && (
                <button
                  type="button"
                  onClick={() => onTogglePin(item)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  {item.pinned ? "Unpin" : "Pin"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default AnnouncementCard;
