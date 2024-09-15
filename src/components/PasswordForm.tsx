import React from "react";

type PasswordFormProps = {
  passwordFirst: string;
  passwordSecond: string;
  handleFirstPassChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSecondPassChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  passwordError: string;
}

export function PasswordForm (
  {
    passwordFirst,
    passwordSecond,
    handleFirstPassChange,
    handleSecondPassChange,
    passwordError
  }: PasswordFormProps) {
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
}
