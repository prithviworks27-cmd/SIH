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

    const {
      data: { user: supabaseUser },
      error: supabaseError,
    } = await supabase.auth.getUser(token);

    if (!supabaseError && supabaseUser) {
      req.supabaseUser = supabaseUser;
      req.user = { id: supabaseUser.id, email: supabaseUser.email };
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
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
