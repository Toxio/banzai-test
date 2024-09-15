import { useState, useEffect, useRef  } from "react";
import axios from 'axios';
// @ts-ignore
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { GdprOptIn, PasswordForm } from './components';

type GdprUpdatePasswordProps = {
  redirect: string;
  company: string;
}

export function GdprUpdatePassword({ redirect, company: initialCompany }: GdprUpdatePasswordProps) {
  const [passwordFirst, setPasswordFirst] = useState('');
  const [passwordSecond, setPasswordSecond] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [gdpr, setGdpr] = useState(false);
  const [company, setCompany] = useState(initialCompany || '');
  const [companyError, setCompanyError] = useState('');
  const [saving, setSaving] = useState(false);

  // For engagement tracking
  const [sessionTime, setSessionTime] = useState(0);  // Total session time in seconds
  const [engagementTime, setEngagementTime] = useState(0);  // Total time the user was engaged (focused)
  const engagedRef = useRef(false);  // Tracks whether the user is currently engaged
  const startTimeRef = useRef(Date.now());  // Time when the user opened the page or became engaged

  // Initialize session and engagement tracking
  useEffect(() => {
    // Update session time every second
    const sessionInterval = setInterval(() => {
      setSessionTime((prev) => prev + 1);
      if (engagedRef.current) {
        setEngagementTime((prev) => prev + 1);
      }
    }, 1000);

    // Add event listeners for focus and blur
    const handleFocus = () => {
      engagedRef.current = true;
      startTimeRef.current = Date.now();
    };

    const handleBlur = () => {
      engagedRef.current = false;
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Cleanup on unmount
    return () => {
      clearInterval(sessionInterval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const validateForm = () => {
    setPasswordError('');
    setCompanyError('');

    // Validate password according to the requirements
    if (!validatePassword(passwordFirst)) {
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

    if (gdpr && !company) {
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
      const engagement = Math.round((engagementTime / sessionTime) * 100);

      await saveGdpr({gdpr, company, sessionTime, engagement});
      await savePassword(passwordFirst);

      toastr.success(`Password and GDPR settings saved successfully. Session time: ${sessionTime}s, Engagement: ${engagement}%.`);

      if (redirect) {
        setTimeout(() => {
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
    setCompany(initialCompany || '');
    setCompanyError('');
    setSaving(false);
    setSessionTime(0);
    setEngagementTime(0);
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
        handleCompanyChange={(e) => setCompany(e.target.value)}
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

type SaveResponse = {
  success: boolean;
  error?: string;
}

type SaveGdprParams = {
  gdpr: boolean;
  company: string;
  sessionTime: number;
  engagement: number;
}

const saveGdpr = async ({gdpr, company, sessionTime, engagement}: SaveGdprParams): Promise<SaveResponse> => {
  try {
    const response = await axios.post<SaveResponse>('/manage/settings/general/save-gdpr', {
      gdpr,
      company,
      sessionTime,
      engagement
    });

    return response.data; // Return the server response data
  } catch (error: any) {
    if (error.response) {
      // Server responded with a status other than 2xx
      throw new Error(error.response.data.error || 'Error saving GDPR settings');
    } else if (error.request) {
      // No response received
      throw new Error('No response from server');
    } else {
      // Some other error occurred
      throw new Error(error.message);
    }
  }
};

const savePassword = async (password: string): Promise<SaveResponse> => {
  try {
    const response = await axios.post<SaveResponse>('/manage/settings/general/save-strong-password', {
      password,
    });

    return response.data; // Return the server response data
  } catch (error: any) {
    if (error.response) {
      // Server responded with a status other than 2xx
      throw new Error(error.response.data.error || 'Error saving password');
    } else if (error.request) {
      // No response received
      throw new Error('No response from server');
    } else {
      // Some other error occurred
      throw new Error(error.message);
    }
  }
};

const validatePassword = (password: string) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

