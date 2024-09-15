import React from "react";

type GdprOptInProps = {
  gdpr: boolean;
  company: string;
  handleCompanyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGdprChange: (value: boolean) => void;
  companyError: string;
}

export function GdprOptIn ({ gdpr, company, handleCompanyChange, handleGdprChange, companyError }: GdprOptInProps) {
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
}