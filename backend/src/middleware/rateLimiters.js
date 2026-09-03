import rateLimit from "express-rate-limit";

const createAuthLimiter = (limit, message) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: message },
  });

export const loginLimiter = createAuthLimiter(
  10,
  "Too many login attempts. Please try again later."
);

export const registerLimiter = createAuthLimiter(
  5,
  "Too many registration attempts. Please try again later."
);

export const syncLimiter = createAuthLimiter(
  20,
  "Too many profile sync requests. Please try again later."
);

// Tighter window for the AI advisor — each request is a real OpenRouter API
// call, unlike the other limiters which just guard local DB writes.
export const aiAdvisorLimiter = createAuthLimiter(
  15,
  "Too many AI advisor requests. Please wait a moment and try again."
);
