const COOKIE_NAME = "auth_token";

export function getAuthToken(req) {
  const cookies = req.headers.cookie?.split(";") || [];
  const authCookie = cookies.find((cookie) => cookie.trim().startsWith(`${COOKIE_NAME}=`));

  return authCookie ? decodeURIComponent(authCookie.trim().slice(COOKIE_NAME.length + 1)) : null;
}

// rememberMe=false (default) issues a session cookie — no Max-Age, so the
// browser drops it on close and the user is logged out. rememberMe=true
// issues a persistent cookie that survives a browser restart, matching the
// login page's "Remember my credentials" checkbox.
export function setAuthCookie(res, token, rememberMe = false) {
  const secure = process.env.NODE_ENV === "production";
  const sameSite = secure ? "None" : "Lax";
  const maxAge = rememberMe ? "; Max-Age=604800" : "";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/${maxAge}; SameSite=${sameSite}${secure ? "; Secure" : ""}`
  );
}

export function clearAuthCookie(res) {
  const secure = process.env.NODE_ENV === "production";
  const sameSite = secure ? "None" : "Lax";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=${sameSite}${secure ? "; Secure" : ""}`
  );
}
