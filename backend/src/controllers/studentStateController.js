import { supabase } from "../config/supabase.js";
import { resolveUserId } from "../utils/resolveUserId.js";

// Small per-user state pieces (target role, learning progress, notification
// prefs/read-state, course enrollments) grouped in one controller since each
// is a tiny CRUD surface over a single simple table — same pattern, not
// worth a dedicated controller file per table.

// --- Target role (careerRoleService.js) ---

export const getTargetRole = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { data, error } = await supabase
      .from("student_target_role")
      .select("role_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Fetch target role error:", error);
      return res.status(500).json({ error: "Failed to load target role" });
    }

    res.status(200).json({ roleId: data?.role_id ?? null });
  } catch (error) {
    console.error("Get target role error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const setTargetRole = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { roleId } = req.body;
    if (!roleId || typeof roleId !== "string") {
      return res.status(400).json({ error: "roleId is required" });
    }

    const { error } = await supabase
      .from("student_target_role")
      .upsert({ user_id: userId, role_id: roleId, updated_at: new Date().toISOString() }, { onConflict: "user_id" });

    if (error) {
      console.error("Set target role error:", error);
      return res.status(500).json({ error: "Failed to save target role" });
    }

    res.status(200).json({ roleId });
  } catch (error) {
    console.error("Set target role error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- Learning path progress (learningPathsService.js) ---

export const getLearningProgress = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { data, error } = await supabase
      .from("learning_path_progress")
      .select("skill_name, completed_modules")
      .eq("user_id", userId);

    if (error) {
      console.error("Fetch learning progress error:", error);
      return res.status(500).json({ error: "Failed to load learning progress" });
    }

    const progress = Object.fromEntries(data.map((row) => [row.skill_name, row.completed_modules]));
    res.status(200).json({ progress });
  } catch (error) {
    console.error("Get learning progress error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const setLearningProgress = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { skillName, completedModules } = req.body;
    if (!skillName || typeof completedModules !== "number") {
      return res.status(400).json({ error: "skillName and completedModules are required" });
    }

    const { error } = await supabase.from("learning_path_progress").upsert(
      {
        user_id: userId,
        skill_name: skillName,
        completed_modules: completedModules,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,skill_name" }
    );

    if (error) {
      console.error("Set learning progress error:", error);
      return res.status(500).json({ error: "Failed to save learning progress" });
    }

    res.status(200).json({ skillName, completedModules });
  } catch (error) {
    console.error("Set learning progress error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- Notification preferences (preferencesService.js) ---

const DEFAULT_PREFS = { emailNotifications: true, smsAlerts: false, applicationUpdates: true };

export const getNotificationPreferences = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { data, error } = await supabase
      .from("notification_preferences")
      .select("email_notifications, sms_alerts, application_updates")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Fetch notification preferences error:", error);
      return res.status(500).json({ error: "Failed to load preferences" });
    }

    const prefs = data
      ? {
          emailNotifications: data.email_notifications,
          smsAlerts: data.sms_alerts,
          applicationUpdates: data.application_updates,
        }
      : DEFAULT_PREFS;

    res.status(200).json({ preferences: prefs });
  } catch (error) {
    console.error("Get notification preferences error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const saveNotificationPreferences = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { emailNotifications, smsAlerts, applicationUpdates } = req.body;

    const { error } = await supabase.from("notification_preferences").upsert(
      {
        user_id: userId,
        email_notifications: emailNotifications,
        sms_alerts: smsAlerts,
        application_updates: applicationUpdates,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) {
      console.error("Save notification preferences error:", error);
      return res.status(500).json({ error: "Failed to save preferences" });
    }

    res.status(200).json({ preferences: { emailNotifications, smsAlerts, applicationUpdates } });
  } catch (error) {
    console.error("Save notification preferences error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- Notification read-state (notificationsService.js) ---

export const getReadNotificationIds = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { data, error } = await supabase
      .from("notification_read_state")
      .select("notification_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Fetch notification read-state error:", error);
      return res.status(500).json({ error: "Failed to load notification state" });
    }

    res.status(200).json({ readIds: data.map((row) => row.notification_id) });
  } catch (error) {
    console.error("Get notification read-state error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markNotificationsRead = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { notificationIds } = req.body;
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({ error: "notificationIds must be a non-empty array" });
    }

    const rows = notificationIds.map((id) => ({
      user_id: userId,
      notification_id: id,
      read_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("notification_read_state").upsert(rows, { onConflict: "user_id,notification_id" });

    if (error) {
      console.error("Mark notifications read error:", error);
      return res.status(500).json({ error: "Failed to update notification state" });
    }

    res.status(200).json({ notificationIds });
  } catch (error) {
    console.error("Mark notifications read error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- Course enrollments (enrollmentsService.js) ---

export const getEnrolledCourseIds = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { data, error } = await supabase.from("course_enrollments").select("course_id").eq("user_id", userId);

    if (error) {
      console.error("Fetch enrollments error:", error);
      return res.status(500).json({ error: "Failed to load enrollments" });
    }

    res.status(200).json({ courseIds: data.map((row) => row.course_id) });
  } catch (error) {
    console.error("Get enrollments error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const enrollInCourse = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) return res.status(404).json({ error: "User not found" });

    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ error: "courseId is required" });

    const { error } = await supabase
      .from("course_enrollments")
      .upsert({ user_id: userId, course_id: courseId }, { onConflict: "user_id,course_id" });

    if (error) {
      console.error("Enroll in course error:", error);
      return res.status(500).json({ error: "Failed to enroll" });
    }

    res.status(200).json({ courseId, enrolled: true });
  } catch (error) {
    console.error("Enroll in course error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
