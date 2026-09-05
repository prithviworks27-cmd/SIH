import { useEffect, useRef, useState } from "react";

const MAX_STRIKES = 3;

// Lightweight anti-cheating guard for a timed test screen: requests
// fullscreen on mount, and counts one shared "strike" toward MAX_STRIKES
// for either leaving fullscreen or the tab/window losing focus
// (visibilitychange) — real exam software treats both as the same signal
// ("the student left the test screen"), not two separate systems. On the
// 3rd strike, `onMaxStrikes` fires (the caller auto-submits). A native
// browser "leave site?" confirmation is also armed via beforeunload for as
// long as `active` is true — this is intentionally NOT part of the strike
// count: browsers block any custom logic/countdown on tab close, it's a
// one-shot dialog the page can't observe the outcome of, so it can only be
// a separate deterrent, never a counted strike.
//
// active: whether proctoring should be armed at all (e.g. false once the
// test has been submitted, so the fullscreen-exit/visibility warnings don't
// fire while navigating away to the results page).
export function useExamProctoring({ active, onMaxStrikes }) {
  const [strikes, setStrikes] = useState(0);
  const [warning, setWarning] = useState(null); // { reason, strikeNumber } | null
  const [fullscreenBlocked, setFullscreenBlocked] = useState(false);
  const maxStrikeHandledRef = useRef(false);
  const onMaxStrikesRef = useRef(onMaxStrikes);
  onMaxStrikesRef.current = onMaxStrikes;

  const registerStrike = (reason) => {
    setStrikes((prev) => {
      const next = prev + 1;
      if (next >= MAX_STRIKES) {
        setWarning(null);
        if (!maxStrikeHandledRef.current) {
          maxStrikeHandledRef.current = true;
          onMaxStrikesRef.current();
        }
      } else {
        setWarning({ reason, strikeNumber: next });
      }
      return next;
    });
  };

  // Request fullscreen once proctoring becomes active. Browsers require a
  // user gesture for this — the click that navigated here (starting the
  // test from the skill picker) usually still counts, but some browsers are
  // stricter, so a failure just surfaces a one-click "Enter Fullscreen"
  // prompt instead of silently failing to protect the test.
  useEffect(() => {
    if (!active) return;
    const el = document.documentElement;
    const request = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (!request) return; // Fullscreen API unsupported — degrade silently, no proctoring possible
    request
      .call(el)
      .then(() => setFullscreenBlocked(false))
      .catch(() => setFullscreenBlocked(true));
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const isFullscreen = () =>
      Boolean(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);

    const handleFullscreenChange = () => {
      if (!isFullscreen()) registerStrike("fullscreen");
    };

    const handleVisibilityChange = () => {
      if (document.hidden) registerStrike("visibility");
    };

    // Best-effort screenshot deterrence. Browsers cannot observe or block
    // every OS-level capture tool, but common screenshot shortcuts and the
    // context menu can be blocked and counted as exam warnings.
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const isScreenshotShortcut =
        event.key === "PrintScreen" ||
        (event.ctrlKey && event.shiftKey && (key === "s" || key === "4")) ||
        (event.metaKey && event.shiftKey && ["3", "4", "5"].includes(key)) ||
        (event.ctrlKey && key === "p");

      if (isScreenshotShortcut) {
        event.preventDefault();
        registerStrike("screenshot");
      }
    };

    const handleContextMenu = (event) => {
      event.preventDefault();
      registerStrike("screenshot");
    };

    // Native close/refresh confirmation — separate from the strike system
    // per the constraint above. Most browsers ignore the custom message and
    // show their own fixed text, but returnValue must still be set to
    // trigger the prompt at all.
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Best-effort: leave fullscreen once proctoring is switched off (test
  // submitted) rather than stranding the student in fullscreen on the
  // results page.
  useEffect(() => {
    if (active) return;
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }, [active]);

  const resumeFullscreen = () => {
    const el = document.documentElement;
    const request = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (!request) return;
    request
      .call(el)
      .then(() => setFullscreenBlocked(false))
      .catch(() => setFullscreenBlocked(true));
  };

  const dismissWarning = () => setWarning(null);
  const registerViolation = (reason) => registerStrike(reason);

  return { strikes, maxStrikes: MAX_STRIKES, warning, dismissWarning, fullscreenBlocked, resumeFullscreen, registerViolation };
}
