import { createContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";
import { supabase } from "../config/supabase";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const syncSession = async (session) => {
      if (!session) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const pendingRole = localStorage.getItem("pendingGoogleRole");
        const { user: currentUser } = await authAPI.syncSupabaseUser(
          session.access_token,
          {
            role: pendingRole || undefined,
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email,
          }
        );
        localStorage.removeItem("pendingGoogleRole");
        localStorage.setItem("user", JSON.stringify(currentUser));
        localStorage.setItem("authToken", session.access_token);
        if (mounted) setUser(currentUser);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const restoreLegacySession = () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        if (mounted) setLoading(false);
        return;
      }

      authAPI
        .getCurrentUser()
        .then(({ user: currentUser }) => {
          localStorage.setItem("user", JSON.stringify(currentUser));
          if (mounted) setUser(currentUser);
        })
        .catch(() => {
          authAPI.clearLocalUser();
          if (mounted) setUser(null);
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });
    };

    if (!supabase) {
      restoreLegacySession();
      return () => {
        mounted = false;
      };
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) syncSession(session);
      else restoreLegacySession();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.login(email, password, rememberMe);

      localStorage.setItem("user", JSON.stringify(response.user));
      if (response.token) localStorage.setItem("authToken", response.token);

      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email, password, name, role) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.register(email, password, name, role);

      localStorage.setItem("user", JSON.stringify(response.user));
      if (response.token) localStorage.setItem("authToken", response.token);

      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const loginWithGoogle = async (role) => {
    setError(null);
    if (!supabase) {
      throw new Error("Supabase is not configured. Add the VITE_SUPABASE_* variables.");
    }

    if (role) localStorage.setItem("pendingGoogleRole", role);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/login` },
    });

    if (oauthError) {
      localStorage.removeItem("pendingGoogleRole");
      setError(oauthError.message);
      throw oauthError;
    }
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    await authAPI.logout();
    authAPI.clearLocalUser();
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
