export function getPostLoginRedirect(role) {
  switch (role) {
    case "student":
      return "/dashboard";
    case "industry":
      return "/industry/profile";
    case "admin":
      return "/admin/dashboard";
    case "academician":
      return "/academician/dashboard";
    default:
      return "/portal-pending";
  }
}
