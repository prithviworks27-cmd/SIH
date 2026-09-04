import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";
import { validateRegisterInput, validateLoginInput } from "../validators/authValidator.js";
import { clearAuthCookie, setAuthCookie } from "../utils/authCookie.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in backend environment");
}

export const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validate input
    const validation = validateRegisterInput(email, password, name, role);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 means no rows found (expected)
      console.error("Database error:", checkError);
      return res.status(500).json({ error: "Database error" });
    }

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in Supabase
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          email: email.toLowerCase(),
          password: hashedPassword,
          name,
          role: role.toLowerCase(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Error creating user:", insertError);
      return res.status(500).json({ error: "Failed to create user" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    setAuthCookie(res, token);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Validate input
    const validation = validateLoginInput(email, password);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Find user by email
    const { data: user, error: queryError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (queryError && queryError.code === "PGRST116") {
      // No user found
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (queryError) {
      console.error("Database error:", queryError);
      return res.status(500).json({ error: "Database error" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    setAuthCookie(res, token, Boolean(rememberMe));

    // Update last login
    await supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", user.id);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const userIdColumn = req.supabaseUser ? "auth_user_id" : "id";
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, name, role, created_at, last_login")
      .eq(userIdColumn, userId)
      .single();

    if (error) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const syncSupabaseUser = async (req, res) => {
  try {
    if (!req.supabaseUser) {
      return res.status(401).json({ error: "A Supabase access token is required" });
    }

    const { name, role } = req.body;
    const email = req.supabaseUser.email?.toLowerCase();
    const userId = req.supabaseUser.id;
    const validRoles = ["student", "academician", "industry"];

    if (!email) {
      return res.status(400).json({ error: "Google account has no email" });
    }

    if (role && !validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const { data: existingUser, error: lookupError } = await supabase
      .from("users")
      .select("id, auth_user_id, email, name, role, created_at, last_login")
      .eq("auth_user_id", userId)
      .maybeSingle();

    if (lookupError) {
      console.error("Profile lookup error:", lookupError);
      return res.status(500).json({ error: "Failed to load user profile" });
    }

    let profile = existingUser;
    const normalizedRole = role?.toLowerCase() || null;

    if (!profile) {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          auth_user_id: userId,
          email,
          name: name?.trim() || email,
          role: normalizedRole,
          last_login: new Date().toISOString(),
        })
        .select("id, email, name, role, created_at, last_login")
        .single();

      if (insertError) {
        console.error("Profile creation error:", insertError);
        return res.status(500).json({
          error: "Failed to create user profile",
          ...(process.env.NODE_ENV !== "production" && { details: insertError.message }),
        });
      }
      profile = newUser;
    } else if (!profile.role && normalizedRole) {
      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({ role: normalizedRole, last_login: new Date().toISOString() })
        .eq("auth_user_id", userId)
        .select("id, email, name, role, created_at, last_login")
        .single();

      if (updateError) {
        console.error("Profile update error:", updateError);
        return res.status(500).json({ error: "Failed to update user profile" });
      }
      profile = updatedUser;
    }

    const token = jwt.sign(
      { id: profile.id, email: profile.email, role: profile.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    setAuthCookie(res, token);
    res.status(200).json({ user: profile });
  } catch (error) {
    console.error("Sync profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (req, res) => {
  clearAuthCookie(res);
  res.status(204).send();
};

// POST /api/auth/change-password — Settings > Security. Only applies to
// legacy email/password accounts (users.password is set); a Google/Supabase
// account has no local password to change, so it's rejected with a clear
// message rather than silently no-op'ing.
export const changePassword = async (req, res) => {
  try {
    if (req.supabaseUser) {
      return res.status(400).json({ error: "This account signs in with Google — change your password from your Google Account settings." });
    }

    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password are required" });
    }
    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters" });
    }

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("id, password")
      .eq("id", userId)
      .single();

    if (fetchError || !user?.password) {
      return res.status(400).json({ error: "This account doesn't support password changes." });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (updateError) {
      console.error("Change password error:", updateError);
      return res.status(500).json({ error: "Failed to update password" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
