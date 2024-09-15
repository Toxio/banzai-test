import React, { useState } from "react";
import axios from 'axios';

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


type PasswordFormProps = {
  passwordFirst: string;
  passwordSecond: string;
  handleFirstPassChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSecondPassChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  passwordError: string;
}

const PasswordForm = (
  {
    passwordFirst,
    passwordSecond,
    handleFirstPassChange,
    handleSecondPassChange,
    passwordError
  }: PasswordFormProps) => {
  return (
    <div className="GdprUpdatePassword__pass pretty-form preferences-section">
      <div className="header">
        <div className="title">Step 1: Update your password</div>
      </div>
      <div className="body pretty-controls">
        <div className="line">
          <div className="form-group first">
            <label className="nm">New Password:</label>
            <small>Password length must be at least 8 characters containing at least 1 uppercase letter and 1
              number.</small>
            <input
              className="input"
              placeholder="Set your new password"
              type="text"
              value={passwordFirst}
              onChange={handleFirstPassChange}
            />
          </div>
          <div className="form-group second">
            <label>Repeat New Password:</label>
            <input
              className="input"
              placeholder="Repeat your new password"
              type="text"
              value={passwordSecond}
              onChange={handleSecondPassChange}
            />
          </div>
        </div>
      </div>
      {passwordError && <div className="footer">
        <div className="error">{passwordError}</div>
      </div>}
    </div>
  );
};

type GdprOptInProps = {
  gdpr: boolean;
  company: string;
  handleCompanyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGdprChange: (value: boolean) => void;
  companyError: string;
}

const GdprOptIn = ({ gdpr, company, handleCompanyChange, handleGdprChange, companyError }: GdprOptInProps) => {
  return (
    <div className="GdprUpdatePassword__opt-in pretty-form preferences-section">
      <div className="header">
        <div className="title">Step 2: Confirm your GDPR compliance settings.</div>
      </div>
      <div className="body">
        <div className="text">
          Enabling your GDPR compliance settings will disable certain features and require registrants to confirm their
          request for more information.
        </div>
        <div className="line">
          <div className="caption">Enable GDPR compliance settings</div>
          <div className="switcher">
            <div className={`item ${gdpr ? 'active' : ''}`} onClick={() => handleGdprChange(true)}>Active</div>
            <div className={`item ${!gdpr ? 'active' : ''}`} onClick={() => handleGdprChange(false)}>Disabled</div>
          </div>
        </div>
        <div className="line pretty-controls">
          <div className="form-group">
            <label>Company Name:</label>
            <input className="input" placeholder="Enter your company name" value={company}
                   onChange={handleCompanyChange} />
          </div>
        </div>
        {companyError && <div className="footer">
          <div className="error">{companyError}</div>
        </div>}
      </div>
    </div>
  );
};

