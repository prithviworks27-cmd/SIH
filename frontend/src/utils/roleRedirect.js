export function getPostLoginRedirect(role) {
  switch (role) {
    case "student":
      return "/dashboard";
    default:
      return "/portal-pending";
  }
}
