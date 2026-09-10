import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import "./AuthModal.css";

// Login / Register popup — pehle ye /orders par ek poora page tha, ab navbar ke
// user icon se khulne wala modal hai. Page nahi banta, is liye modal ko portal
// ke zariye <body> par render karte hain — warna navbar ke stacking context
// (sticky header + mega menu z-index) ke andar phans jata hai.
function AuthModal({ isOpen, onClose }) {
  // Kaun sa tab active hai: "login" ya "register"
  const [activeTab, setActiveTab] = useState("login");

  // Login form ki fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Register form ki fields
  const [email, setEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Escape dabane par modal band, aur jab tak khula hai page scroll lock —
  // warna peeche wala page modal ke neeche scroll hota rehta hai.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  // Har baar khulne par login tab se shuru — pichhli dafa register khula chhod
  // diya ho tou default state confuse na kare.
  useEffect(() => {
    if (isOpen) setActiveTab("login");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", { username, password, rememberMe });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log("Register submitted:", { email, registerPassword });
  };

  return ReactDOM.createPortal(
    <div
      className="auth-modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      {/* Andar click karne par modal band na ho — sirf backdrop par band ho */}
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Login or register"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="auth-modal-close"
          aria-label="Close"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <div className="auth-modal-head">
          <h2 className="auth-modal-heading">My Account</h2>
          <p className="auth-modal-sub">
            Login to your account or create a new one
          </p>
        </div>

        {/* Tabs */}
        <div className="auth-modal-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "login"}
            className={`auth-modal-tab ${activeTab === "login" ? "auth-modal-tab-active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "register"}
            className={`auth-modal-tab ${activeTab === "register" ? "auth-modal-tab-active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        <div className="auth-modal-body">
          {activeTab === "login" ? (
            <form className="auth-modal-form" onSubmit={handleLoginSubmit}>
              <div className="auth-modal-field">
                <label htmlFor="auth-username">
                  Username or email address <span className="auth-modal-required">*</span>
                </label>
                <input
                  type="text"
                  id="auth-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className="auth-modal-field">
                <label htmlFor="auth-password">
                  Password <span className="auth-modal-required">*</span>
                </label>
                <div className="auth-modal-password">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="auth-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="auth-modal-eye"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="auth-modal-row">
                <label className="auth-modal-checkbox" htmlFor="auth-remember">
                  <input
                    type="checkbox"
                    id="auth-remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>

                <button type="button" className="auth-modal-link">
                  Forget password?
                </button>
              </div>

              <button type="submit" className="auth-modal-submit">
                LOG IN
              </button>

              <p className="auth-modal-switch">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="auth-modal-link"
                  onClick={() => setActiveTab("register")}
                >
                  Register
                </button>
              </p>
            </form>
          ) : (
            <form className="auth-modal-form" onSubmit={handleRegisterSubmit}>
              <div className="auth-modal-field">
                <label htmlFor="auth-email">
                  Email address <span className="auth-modal-required">*</span>
                </label>
                <input
                  type="email"
                  id="auth-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="auth-modal-field">
                <label htmlFor="auth-register-password">
                  Password <span className="auth-modal-required">*</span>
                </label>
                <div className="auth-modal-password">
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    id="auth-register-password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-modal-eye"
                    aria-label={showRegisterPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  >
                    {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <p className="auth-modal-helper">
                Your personal data will be used to manage your account and to
                support your experience across this website.
              </p>

              <button type="submit" className="auth-modal-submit">
                REGISTER
              </button>

              <p className="auth-modal-switch">
                Already have an account?{" "}
                <button
                  type="button"
                  className="auth-modal-link"
                  onClick={() => setActiveTab("login")}
                >
                  Login
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AuthModal;
