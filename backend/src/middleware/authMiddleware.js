import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";
import { getAuthToken } from "../utils/authCookie.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in backend environment");
}

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || getAuthToken(req);

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Try our own JWT first — it's a local, synchronous check. Only a
    // Supabase-issued token (Google sign-in) fails this, since it's signed
    // with Supabase's key rather than JWT_SECRET; that's the sole case that
    // needs the network round-trip to Supabase's auth servers below. Most
    // requests are email/password accounts carrying our own JWT, so trying
    // the free local check first (instead of always paying for the network
    // call, which was previously tried first and would fail for these
    // tokens anyway) avoids one wasted round-trip on every request.
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (jwtError) {
      // An expired token of ours is still recognizably ours (valid
      // signature, just past exp) — no point paying for the Supabase round
      // trip only to fail there too. Anything else (bad signature/malformed)
      // means it isn't our JWT at all — likely a genuine Supabase-issued
      // token — so that's the one case that falls through below.
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      }
    }

    const {
      data: { user: supabaseUser },
      error: supabaseError,
    } = await supabase.auth.getUser(token);

    if (!supabaseError && supabaseUser) {
      req.supabaseUser = supabaseUser;
      req.user = { id: supabaseUser.id, email: supabaseUser.email };
      return next();
    }

    return res.status(401).json({ error: "Invalid token" });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};
