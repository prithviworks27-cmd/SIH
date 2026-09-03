const COOKIE_NAME = "auth_token";

export function getAuthToken(req) {
  const cookies = req.headers.cookie?.split(";") || [];
  const authCookie = cookies.find((cookie) => cookie.trim().startsWith(`${COOKIE_NAME}=`));

  return authCookie ? decodeURIComponent(authCookie.trim().slice(COOKIE_NAME.length + 1)) : null;
}

export function setAuthCookie(res, token) {
  const secure = process.env.NODE_ENV === "production";
  const sameSite = secure ? "None" : "Lax";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=604800; SameSite=${sameSite}${secure ? "; Secure" : ""}`
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
