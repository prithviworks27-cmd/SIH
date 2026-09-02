export function getPostLoginRedirect(role) {
  switch (role) {
    case "student":
      return "/dashboard";
    case "industry":
      return "/industry/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/portal-pending";
  }
}
