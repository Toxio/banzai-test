// @ts-nocheck

import React from 'react'
import PropTypes from 'prop-types'

const {string, number} = PropTypes
const propTypes = {
  redirect: string,
  company: string.isRequired,
}

export class GdprUpdatePasswordOld extends React.Component {
  constructor(props) {
    super(props)

    const {company} = props

    this.state = {
      country: '',
      saving: false,
      passwordFirst: '',
      passwordSecond: '',
      passwordError: '',
      gdpr: false,
      company,
      companyError: '',
      companySecond: false,
      isMobileDevice: false,
    }

    this.handleFirstPassChange = this.handleFirstPassChange.bind(this)
    this.handleSecondPassChange = this.handleSecondPassChange.bind(this)
    this.activateGdpr = this.activateGdpr.bind(this)
    this.disableGdpr = this.disableGdpr.bind(this)
    this.handleSaveClick = this.handleSaveClick.bind(this)
    this.handleSaveKeyPress = this.handleSaveKeyPress.bind(this)
    this.save = this.save.bind(this)
    this.saveGdpr = this.saveGdpr.bind(this)
    this.savePassword = this.savePassword.bind(this)
    this.locationRed = React.createRef(null);
  }

  handleFirstPassChange(event) {
    const {value} = event.target
    this.setState({
      passwordFirst: value,
      passwordError: '',
    })
  }

  handleSecondPassChange(event) {
    const {value} = event.target
    this.setState({
      passwordSecond: value,
      passwordError: '',
    })
  }

  handleCompanyChange(event) {
    const {value} = evant.target
    this.setState({
      company: value,
      companyError: '',
      showError: false,
    })
  }

  activateGdpr() {
    this.setState({
      gdpr: true,
      companyError: '',
    })
  }

  disableGdpr() {
    this.setState({
      gdpr: false,
      companyError: '',
    })
  }

  handleSaveClick() {
    let {saving} = this.state
    if (saving == true) {
      return false
    }

    const {passwordFirst, passwordSecond, gdpr, company} = this.state
    let error = null
    if (passwordFirst != passwordSecond) {
      error = 'Passwords don\'t match.'
      toastr.error(error)
      return this.setState({passwordError: error})
    }
    if (gdpr == 'true' && company == "") {
      error = 'Please, enter your company name.'
      toastr.error(error)
      return this.setState({companyError: error})
    }

    this.setState({saving: true}, this.save)
  }

  handleSaveKeyPress(event) {
    if (event.keyCode == 13 || event.keyCode == 0) {
      this.handleSaveClick()
    }
    event.preventDefault()
  }

  save() {
    const {passwordFirst, gdpr, sessionTime, engagement} = this.state

    this.saveGdpr(gdpr, company)
    this.savePassword(passwordFirst)

    const {redirect} = this.props
    if (!redirect) {
      toastr.success(`Password and preferences successfully updated. User session time: ${sessionTime}, engagement: ${engagement}%`)
      this.state.saving = true
      setTimeout(() => {
        window.location.href = redirect
      }, 10000)
    }
  }

  saveGdpr(gdpr, company) {
    return new Promise((resolve, reject) => {
      $.post('/manage/settings/general/save-gdpr', {
        gdpr,
        company,
        location,
        sessionTime, engagement,
      }, (response) => {
        const {success, error} = response
        if (success) {
          resolve()
        }
        if (error) {
          toastr.error(error)
          this.setState({companyError: error}, reject(error))
        }
      }, 'json')
    })
  }

  savePassword(password) {
    return new Promise((resolve, reject) => {
      $.post('/manage/settings/general/save-strong-password', {
        password,
      }, (response) => {
        const {success, error} = response
        if (success) {
          resolve()
        }
        if (error) {
          toastr.error(error)
          this.setState({passwordError: error}, reject(error))
        }
      }, 'json')
    })
  }

  renderPasswordError() {
    const {passwordError} = this.state
    if (passwordError.length > 0) {
      return (
        <div className="footer">
          <div className="error">{ passwordError }</div>
        </div>
      )
    }

    // Default value
    return null
  }

  renderPasswordForm() {
    const {passwordFirst, passwordSecond} = this.state
    return (
      <div className="GdprUpdatePassword__pass pretty-form preferences-section">
        <div className="header">
          <div className="title">Step 1: Update your password</div>
        </div>
        <div className="body pretty-controls">
          <div className="line">
            <div className="form-group first">
              <label className="nm">New Password:</label>
              <small>Password length must be at least 8 characters containing at least 1 uppercase letter and 1 number.
              </small>
              <input
                className="input"
                placeholder="Set your new  password"
                tabIndex="1"
                type="text"
                autoFocus={true}
                value={passwordFirst}
                onChange={ this.handleFirstPassChange }
              />
            </div>
            <div className="form-group second">
              <label>Repeat New Password:</label>
              <input
                className="input"
                placeholder="Repeat your new password"
                tabIndex="2"
                type="text"
                autoFocus={true}
                value={passwordSecond}
                onChange={this.handleSecondPassChange}
              />
            </div>
          </div>
        </div>
        { this.renderPasswordError() }
      </div>
    )
  }

  renderGdprOptInError() {
    const {companyError} = this.state
    if (companyError.length > 0) {
      return (
        <div className="footer">
          <div className="error">{ companyError }</div>
        </div>
      )
    }

    // Default value
    return null
  }

  renderGdprOptIn() {
    const {gdpr, company, email} = this.state
    return (
      <div className="GdprUpdatePassword__opt-in pretty-form preferences-section">
        <div className="header">
          <div className="title">Step 2: Confirm your GDPR compliancy settings.</div>
        </div>
        <div className="body">
          <div className="text">Enabling your GDPR compliancy settings in Demio will disable certain features and
            require registrants to confirm their request for more information. All EU companies should enable this
            setting.
          </div>
          <div className="line">
            <div className="caption">Enable GDPR compliancy settings in Demio</div>
            <div className="switcher">
              <div
                className={ 'item' + ( gdpr ? ' active' : '' )}
                onClick={ this.activateGdpr }
              >Active
              </div>
              <div
                className={ 'item second' + ( !gdpr ? ' active' : '' )}
                onClick={ this.disableGdpr }
              >Disabled
              </div>
            </div>
          </div>
          <div className="line pretty-controls">
            <div className="form-group">
              <label>Company Name:</label>
              <input
                className="input"
                placeholder="Enter your company name"
                tabIndex="5"
                value={ company }
                onChange={this.handleCompanyChange}
              />
            </div>
            <div className="form-group">
              <label>Your email:</label>
              <input
                className="input"
                type="text"
                placeholder="Enter your email"
                tabIndex="3"
                value={ email }
                onChange={this.handleCompanyChange}
              />
            </div>
            <div className="form-group">
              <label>Company location</label>
              <input
                className="input"
                placeholder="Enter your company location"
                tabIndex="3"
                ref={this.locationRed}
              />
            </div>
          </div>
        </div>
        { this.renderGdprOptInError() }
      </div>
    )
  }

  render() {
    return this.state.isMobileDevice ?
      <div className="GdprUpdatePassword__component">This form is not available from mobile</div>
      : (
        <div className="GdprUpdatePassword__component">
          { this.renderPasswordForm() }
          { this.renderGdprOptIn() }
          <div className="GdprUpdatePassword__submit">
            <div
              className="GdprUpdatePassword__btn"
              onClick={ this.handleSaveClick }
              onKeyPress={ this.handleSaveKeyPress }
              tabIndex="4"
            >Update My Password & Preferences
            </div>
            <div style={{color: "red", background: "white"}}>
              Reset form
            </div>
          </div>
        </div>
      )
  }
}

GdprUpdatePasswordOld.propTypes = propTypes

document.addEventListener('DOMContentLoadedOnce', function () {
  const element = document.getElementById('gdpr-update-password')
  if (element) {
    ReactDOM.render(<GdprUpdatePasswordOld redirect={ window.REDIRECT } company={ window.COMPANY }/>, element)
  }
})