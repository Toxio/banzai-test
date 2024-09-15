import React from "react";

type Company = {
  name: string;
  email: string;
  location: string;
};

type GdprOptInProps = {
  gdpr: boolean;
  company: Company;
  handleCompanyChange: (field: keyof Company) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGdprChange: (value: boolean) => void;
  companyError: string;
};

export function GdprOptIn(
  {
    gdpr,
    company,
    handleCompanyChange,
    handleGdprChange,
    companyError,
  }: GdprOptInProps) {
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
            <div className={`item ${gdpr ? "active" : ""}`} onClick={() => handleGdprChange(true)}>
              Active
            </div>
            <div className={`item ${!gdpr ? "active" : ""}`} onClick={() => handleGdprChange(false)}>
              Disabled
            </div>
          </div>
        </div>
        <div className="line pretty-controls">
          <div className="form-group">
            <label>Company Name:</label>
            <input
              className="input"
              placeholder="Enter your company name"
              value={company.name}
              onChange={handleCompanyChange("name")} // Call handleCompanyChange with "name" key
            />
          </div>
          <div className="form-group">
            <label>Your email:</label>
            <input
              className="input"
              type="text"
              placeholder="Enter your email"
              value={company.email}
              onChange={handleCompanyChange("email")} // Call handleCompanyChange with "email" key
            />
          </div>
          <div className="form-group">
            <label>Company location:</label>
            <input
              className="input"
              placeholder="Enter your company location"
              value={company.location}
              onChange={handleCompanyChange("location")} // Call handleCompanyChange with "location" key
            />
          </div>
        </div>
        {companyError && (
          <div className="footer">
            <div className="error">{companyError}</div>
          </div>
        )}
      </div>
    </div>
  );
}
