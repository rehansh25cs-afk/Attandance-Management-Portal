import { useEffect, useRef, useState } from "react";

/**
 * ErrorToast
 *
 * A portal-style error notification that slides in from the top of the
 * viewport, stays for `duration` milliseconds, then slides back out.
 *
 * Props
 * ─────
 * message  {string|null}  – The error text to display. Pass null / "" to hide.
 * onDismiss {function}    – Called when the user clicks ✕ or after auto-dismiss.
 * duration  {number}      – Auto-dismiss delay in ms (default: 4000).
 */
const ErrorToast = ({ message, onDismiss, duration = 4000 }) => {
    const [visible, setVisible]     = useState(false);   // controls CSS transition
    const [rendered, setRendered]   = useState(false);   // controls DOM presence
    const timerRef                  = useRef(null);

    /* ── Show when message arrives ──────────────────────────────────────── */
    useEffect(() => {
        if (!message) return;

        setRendered(true);
        // Give the browser one frame to paint the initial (hidden) state so
        // the CSS transition can actually animate.
        const showTimer = requestAnimationFrame(() => setVisible(true));

        // Auto-dismiss
        timerRef.current = setTimeout(() => dismiss(), duration);

        return () => {
            cancelAnimationFrame(showTimer);
            clearTimeout(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message]);

    /* ── Dismiss: animate out, then remove from DOM ──────────────────────── */
    const dismiss = () => {
        clearTimeout(timerRef.current);
        setVisible(false);
        // Wait for the slide-out transition (300 ms) before un-mounting.
        setTimeout(() => {
            setRendered(false);
            onDismiss?.();
        }, 320);
    };

    if (!rendered || !message) return null;

    return (
        <>
            {/* ── Keyframe styles injected once ─────────────────────────── */}
            <style>{`
                @keyframes _agy_toast_slide_in {
                    from { opacity: 0; transform: translateY(-100%); }
                    to   { opacity: 1; transform: translateY(0);     }
                }
                @keyframes _agy_toast_slide_out {
                    from { opacity: 1; transform: translateY(0);     }
                    to   { opacity: 0; transform: translateY(-100%); }
                }
                ._agy_toast_show {
                    animation: _agy_toast_slide_in 0.32s cubic-bezier(0.34,1.56,0.64,1) forwards;
                }
                ._agy_toast_hide {
                    animation: _agy_toast_slide_out 0.28s ease-in forwards;
                }
            `}</style>

            {/* ── Fixed banner pinned to the top-centre ─────────────────── */}
            <div
                role="alert"
                aria-live="assertive"
                className={visible ? "_agy_toast_show" : "_agy_toast_hide"}
                style={{
                    position:        "fixed",
                    top:             "16px",
                    left:            "50%",
                    transform:       "translateX(-50%)",
                    zIndex:          9999,
                    width:           "calc(100% - 32px)",
                    maxWidth:        "520px",
                    display:         "flex",
                    alignItems:      "flex-start",
                    gap:             "12px",
                    backgroundColor: "#fff1f2",
                    border:          "1px solid #fecdd3",
                    borderRadius:    "12px",
                    boxShadow:       "0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)",
                    padding:         "14px 16px",
                    pointerEvents:   "auto",
                }}
            >
                {/* Error icon */}
                <span
                    style={{
                        flexShrink: 0,
                        marginTop:  "1px",
                        color:      "#e11d48",
                        display:    "flex",
                        alignItems: "center",
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ width: "18px", height: "18px" }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                    </svg>
                </span>

                {/* Message */}
                <p
                    style={{
                        flex:       1,
                        margin:     0,
                        fontSize:   "13.5px",
                        lineHeight: 1.55,
                        fontWeight: 500,
                        color:      "#be123c",
                    }}
                >
                    {message}
                </p>

                {/* Dismiss button */}
                <button
                    type="button"
                    onClick={dismiss}
                    aria-label="Dismiss error"
                    style={{
                        flexShrink:  0,
                        marginLeft:  "4px",
                        background:  "none",
                        border:      "none",
                        cursor:      "pointer",
                        color:       "#f43f5e",
                        padding:     "2px 4px",
                        borderRadius:"6px",
                        display:     "flex",
                        alignItems:  "center",
                        lineHeight:  1,
                        fontSize:    "18px",
                        transition:  "background 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#ffe4e6"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
                >
                    &times;
                </button>
            </div>
        </>
    );
};

export default ErrorToast;
