import { useState } from "react";
// @ts-ignore
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { GdprOptIn, PasswordForm } from './components';
import { useSessionTracking } from './hooks/useSessionTracking.tsx';
import { passwordValidation } from "./utils/passwordValidation.ts";
import { saveGdpr, savePassword } from "./utils/apiRequests.ts";

type GdprUpdatePasswordProps = {
  redirect: string;
  company: string;
}

type Company = {
  name: string;
  email: string;
  location: string;
}

export function GdprUpdatePassword({ redirect, company: initialCompany }: GdprUpdatePasswordProps) {
  const [passwordFirst, setPasswordFirst] = useState('');
  const [passwordSecond, setPasswordSecond] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [gdpr, setGdpr] = useState(false);
  const [company, setCompany] = useState({ name: initialCompany, email: "", location: "" });
  const [companyError, setCompanyError] = useState('');
  const [saving, setSaving] = useState(false);

  // Session and engagement tracking hooks
  const { sessionTime, engagement } = useSessionTracking();

  const validateForm = () => {
    setPasswordError('');
    setCompanyError('');

    // Validate password according to the requirements
    if (!passwordValidation(passwordFirst)) {
      const error = "Password must be at least 8 characters long, contain at least one uppercase letter, and one number.";
      setPasswordError(error);
      toastr.error(error);
      return false;
    }

    // Validation for password mismatch
    if (passwordFirst !== passwordSecond) {
      const error = "Passwords don't match.";
      setPasswordError(error);
      toastr.error(error);
      return false;
    }

    // Additional validation for empty password
    if (!passwordFirst) {
      const error = "Please, enter your password.";
      setPasswordError(error);
      toastr.error(error);
      return false;
    }

    if (gdpr && !company.name) {
      const error = 'Please, enter your company name.'
      setCompanyError(error);
      toastr.error(error);
      return false;
    }

    return true // Validation successful
  }

  const handleSaveClick = async () => {
    const isValid = validateForm();

    if (saving || !isValid) return;

    try {
      setSaving(true);

      await saveGdpr({ gdpr, company, sessionTime, engagement });
      await savePassword(passwordFirst);

      toastr.success(`Password and GDPR settings saved successfully. Session time: ${sessionTime}s, Engagement: ${engagement}%.`);

      if (redirect) {
        setTimeout(() => {
          // It might be React Router and in this case it will be useNavigate().navigate(redirect);
          window.location.href = redirect;
        }, 5000);
      }
    } catch (error) {
      console.error("Save failed", error);
      toastr.error(error || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleCompanyChange = (field: keyof Company) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompany({ ...company, [field]: e.target.value });
  };

  // Treat screen widths 768px or smaller as mobile
  const isMobileDevice = () => {
    return window.innerWidth <= 768;
  };

  // Function to reset form fields and state
  const handleResetForm = () => {
    setPasswordFirst('');
    setPasswordSecond('');
    setPasswordError('');
    setGdpr(false);
    setCompany({ name: '', email: '', location: '' });
    setCompanyError('');
    setSaving(false);
  };

  return isMobileDevice() ? (
    <div className="GdprUpdatePassword__component">This form is not available from mobile</div>
  ) : (
    <div className="GdprUpdatePassword__component">
      <PasswordForm
        passwordFirst={passwordFirst}
        passwordSecond={passwordSecond}
        handleFirstPassChange={(e) => setPasswordFirst(e.target.value)}
        handleSecondPassChange={(e) => setPasswordSecond(e.target.value)}
        passwordError={passwordError}
      />
      <GdprOptIn
        gdpr={gdpr}
        company={company}
        handleCompanyChange={handleCompanyChange}
        handleGdprChange={setGdpr}
        companyError={companyError}
      />
      <div className="GdprUpdatePassword__submit">
        <button onClick={handleSaveClick} disabled={saving}>
          {saving ? 'Saving...' : 'Update My Password & Preferences'}
        </button>
        <button
          type="button"
          className='GdprUpdatePassword__reset-btn'
          onClick={handleResetForm}
        >
          Reset Form
        </button>
      </div>
    </div>
  );
}