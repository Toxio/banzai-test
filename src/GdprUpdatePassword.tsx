import { useState } from "react";
import axios from 'axios';
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

  const handleSaveClick = async () => {
    if (saving) return;

    if (passwordFirst !== passwordSecond) {
      setPasswordError("Passwords don't match.");
      return;
    }
    if (gdpr && !company) {
      setCompanyError("Please, enter your company name.");
      return;
    }

    try {
      await saveGdpr(gdpr, company);
      await savePassword(passwordFirst);

      if (redirect) {
        setTimeout(() => {
          // Use navigate instead of window.location.href if we use React Router's
          // navigate(redirect);
          window.location.href = redirect;
        }, 5000);
      }
    } catch (error) {
      console.error("Save failed", error);
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

interface SaveResponse {
  success: boolean;
  error?: string;

}

const saveGdpr = async (gdpr: boolean, company: string): Promise<SaveResponse> => {
  try {
    const response = await axios.post<SaveResponse>('/manage/settings/general/save-gdpr', {
      gdpr,
      company,
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

