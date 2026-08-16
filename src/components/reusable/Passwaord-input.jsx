export const validatePassword = (password) => {
  const minLength = 8;
  const maxLength = 12;

  const checks = {
    length: password.length >= minLength && password.length <= maxLength,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  return {
    ...checks,
    isValid: Object.values(checks).every(Boolean),
  };
};

function PasswordLimit({ password = '' }) {
  const status = validatePassword(password);

  return (
    <div className="max-w-[300px] text-xs mt-2">
      <ul className="list-none p-0 space-y-1">
        <li style={{ color: status.length ? 'green' : 'red' }}>
          8–12 characters
        </li>
        <li style={{ color: status.hasUpper ? 'green' : 'red' }}>
          At least one uppercase letter
        </li>
        <li style={{ color: status.hasLower ? 'green' : 'red' }}>
          At least one lowercase letter
        </li>
        <li style={{ color: status.hasNumber ? 'green' : 'red' }}>
          At least one number
        </li>
        <li style={{ color: status.hasSpecial ? 'green' : 'red' }}>
          At least one special character
        </li>
      </ul>
    </div>
  );
}

export default PasswordLimit;