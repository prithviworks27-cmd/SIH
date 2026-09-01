import validator from "validator";

export const validateEmail = (email) => {
  if (!email || !validator.isEmail(email)) {
    return { valid: false, error: "Invalid email format" };
  }
  return { valid: true };
};

export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number" };
  }
  return { valid: true };
};

export const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return { valid: false, error: "Name must be at least 2 characters long" };
  }
  if (name.trim().length > 50) {
    return { valid: false, error: "Name must not exceed 50 characters" };
  }
  return { valid: true };
};

export const validateRegisterInput = (email, password, name, role) => {
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return emailValidation;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return passwordValidation;
  }

  const nameValidation = validateName(name);
  if (!nameValidation.valid) {
    return nameValidation;
  }

  const validRoles = ["student", "academician", "industry"];
  if (!role || !validRoles.includes(role.toLowerCase())) {
    return { valid: false, error: "Invalid role. Must be student, academician, or industry" };
  }

  return { valid: true };
};

export const validateLoginInput = (email, password) => {
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return emailValidation;
  }

  if (!password) {
    return { valid: false, error: "Password is required" };
  }

  return { valid: true };
};
