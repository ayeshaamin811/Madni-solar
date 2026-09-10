import React, { useMemo, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import CalculatorBannerImg from "../../assets/hero-banner.webp";
import { sendCalculatorRequest, parseCalculatorError } from "../../api/calculator";
import "./CalculatorPage.css";
import {
  FaLightbulb,
  FaGripLines,
  FaFan,
  FaBoxArchive,
  FaSnowflake,
  FaBars,
  FaUser,
  FaCircleCheck,
} from "react-icons/fa6";

// Load Calculator ke appliances — har ek ki average wattage se
// "Load Calculated (kW)" nikalta hai (qty * watt, sab jama karke /1000).
const LOAD_ITEMS = [
  { key: "ledBulbs", label: "LED Bulbs", watt: 10, icon: FaLightbulb },
  { key: "tubeLights", label: "Tube Lights", watt: 40, icon: FaGripLines },
  { key: "fans", label: "Fans", watt: 75, icon: FaFan },
  { key: "refrigerators", label: "Refrigerators", watt: 200, icon: FaBoxArchive },
  { key: "ac1Ton", label: "AC 1 Ton (Inverter)", watt: 900, icon: FaSnowflake },
  { key: "ac1_5Ton", label: "AC 1.5 Ton (Inverter)", watt: 1300, icon: FaSnowflake },
  { key: "ac2Ton", label: "AC 2 Ton (Inverter)", watt: 1800, icon: FaSnowflake },
  { key: "ups1kw", label: "UPS (1kW)", watt: 1000, icon: FaBars },
  { key: "motor1hp", label: "Motor (1HP)", watt: 750, icon: FaUser },
];

const QTY_OPTIONS = Array.from({ length: 11 }, (_, i) => i);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const EMPTY_CONTACT = {
  fullName: "",
  phone: "",
  email: "",
  houseArea: "",
  address: "",
};
const EMPTY_LOADS = LOAD_ITEMS.reduce(
  (acc, item) => ({ ...acc, [item.key]: 0 }),
  {}
);

function CalculatorPage() {
  const [meterType, setMeterType] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [billUnits, setBillUnits] = useState("");
  const [billFile, setBillFile] = useState(null);
  const [contact, setContact] = useState(EMPTY_CONTACT);
  const [loads, setLoads] = useState(EMPTY_LOADS);

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const loadCalculated = useMemo(() => {
    const totalWatt = LOAD_ITEMS.reduce(
      (sum, item) => sum + item.watt * (loads[item.key] || 0),
      0
    );
    return totalWatt / 1000;
  }, [loads]);

  const clearFieldError = (name) => {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const handleLoadChange = (key, value) => {
    setLoads((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setBillFile(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, billFile: "File is too large (max 5 MB)." }));
      e.target.value = "";
      setBillFile(null);
      return;
    }
    clearFieldError("billFile");
    setBillFile(file);
  };

  const validate = () => {
    const found = {};
    if (!meterType) found.meterType = "Please select a meter type.";
    if (!billAmount || Number(billAmount) <= 0) {
      found.billAmount = "Enter your average monthly bill.";
    }
    if (!billUnits || Number(billUnits) <= 0) {
      found.billUnits = "Enter your average monthly units.";
    }
    if (contact.fullName.trim().length < 2) {
      found.fullName = "Please enter your full name.";
    }
    if (contact.phone.trim().length < 7) {
      found.phone = "Please enter a valid phone number.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
      found.email = "Enter a valid email address.";
    }
    if (!contact.houseArea || Number(contact.houseArea) <= 0) {
      found.houseArea = "Enter your house area in Marla.";
    }
    if (contact.address.trim().length < 5) {
      found.address = "Please enter your full address.";
    }
    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Double submit band — warna button dobara dabne par dobara request jati hai.
    if (status === "sending") return;

    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setFormError("Please fix the highlighted fields and try again.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrors({});
    setFormError("");

    const formData = new FormData();
    formData.append("meterType", meterType);
    formData.append("billAmount", billAmount);
    formData.append("billUnits", billUnits);
    if (billFile) formData.append("billFile", billFile);
    formData.append("fullName", contact.fullName);
    formData.append("phone", contact.phone);
    formData.append("email", contact.email);
    formData.append("houseArea", contact.houseArea);
    formData.append("address", contact.address);
    formData.append("loads", JSON.stringify(loads));
    formData.append("loadCalculated", loadCalculated.toFixed(2));

    try {
      await sendCalculatorRequest(formData);
      setStatus("success");
      setMeterType("");
      setBillAmount("");
      setBillUnits("");
      setBillFile(null);
      setContact(EMPTY_CONTACT);
      setLoads(EMPTY_LOADS);
    } catch (error) {
      const { fieldErrors, formError: message } = parseCalculatorError(error);
      setErrors(fieldErrors);
      setFormError(message);
      setStatus("error");
    }
  };

  return (
    <div className="calc-page">
      <Navbar />

      <PageBanner
        image={CalculatorBannerImg}
        title="Design your System"
        currentPage="Calculator"
      />

      <section className="calc-section">
        <div className="container">
          <div className="calc-card">
            <span className="calc-section-label">Solar Calculator</span>
            <h1 className="calc-title">Design your System</h1>
            <p className="calc-subtitle">
              Share your billing, contact and appliance details below — our
              team will size the right solar system for you.
            </p>

            {status === "success" ? (
              <div className="calc-success">
                <span className="calc-success-icon-wrap">
                  <FaCircleCheck className="calc-success-icon" />
                </span>
                <h3>Your submission was successful.</h3>
                <p>
                  Our team will review your details and get back to you with
                  a system recommendation shortly.
                </p>
              </div>
            ) : (
              <form className="calc-form" onSubmit={handleSubmit} noValidate>
                {formError && (
                  <p className="calc-form-error" role="alert">
                    {formError}
                  </p>
                )}

                {/* 1. Billing Information */}
                <div className="calc-block">
                  <h2 className="calc-block-title">1. Billing Information</h2>

                  <div className="calc-form-group">
                    <label>Meter Type</label>
                    <div className="calc-radio-row">
                      <label className="calc-radio">
                        <input
                          type="radio"
                          name="meterType"
                          value="single"
                          checked={meterType === "single"}
                          onChange={(e) => {
                            setMeterType(e.target.value);
                            clearFieldError("meterType");
                          }}
                        />
                        Single Phase
                      </label>
                      <label className="calc-radio">
                        <input
                          type="radio"
                          name="meterType"
                          value="three"
                          checked={meterType === "three"}
                          onChange={(e) => {
                            setMeterType(e.target.value);
                            clearFieldError("meterType");
                          }}
                        />
                        Three Phase
                      </label>
                    </div>
                    {errors.meterType && (
                      <span className="calc-field-error">{errors.meterType}</span>
                    )}
                  </div>

                  <div className="calc-form-row">
                    <div className="calc-form-group">
                      <label htmlFor="billAmount">
                        Average electricity bill (per month)
                      </label>
                      <input
                        id="billAmount"
                        type="number"
                        min="0"
                        placeholder="Rs."
                        value={billAmount}
                        onChange={(e) => {
                          setBillAmount(e.target.value);
                          clearFieldError("billAmount");
                        }}
                        aria-invalid={Boolean(errors.billAmount)}
                      />
                      {errors.billAmount && (
                        <span className="calc-field-error">{errors.billAmount}</span>
                      )}
                    </div>
                    <div className="calc-form-group">
                      <label htmlFor="billUnits">
                        Average electricity units (per month)
                      </label>
                      <input
                        id="billUnits"
                        type="number"
                        min="0"
                        value={billUnits}
                        onChange={(e) => {
                          setBillUnits(e.target.value);
                          clearFieldError("billUnits");
                        }}
                        aria-invalid={Boolean(errors.billUnits)}
                      />
                      {errors.billUnits && (
                        <span className="calc-field-error">{errors.billUnits}</span>
                      )}
                    </div>
                  </div>

                  <div className="calc-form-group">
                    <label htmlFor="billFile">
                      Upload your electricity bill (Max file size: 5 MB)
                    </label>
                    <input
                      id="billFile"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                    />
                    {billFile && (
                      <span className="calc-file-name">{billFile.name}</span>
                    )}
                    {errors.billFile && (
                      <span className="calc-field-error">{errors.billFile}</span>
                    )}
                  </div>
                </div>

                {/* 2. Contact Information */}
                <div className="calc-block">
                  <h2 className="calc-block-title">2. Contact Information</h2>

                  <div className="calc-form-row">
                    <div className="calc-form-group">
                      <label htmlFor="fullName">Full Name</label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={contact.fullName}
                        onChange={handleContactChange}
                        aria-invalid={Boolean(errors.fullName)}
                      />
                      {errors.fullName && (
                        <span className="calc-field-error">{errors.fullName}</span>
                      )}
                    </div>
                    <div className="calc-form-group">
                      <label htmlFor="phone">Phone</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={contact.phone}
                        onChange={handleContactChange}
                        aria-invalid={Boolean(errors.phone)}
                      />
                      {errors.phone && (
                        <span className="calc-field-error">{errors.phone}</span>
                      )}
                    </div>
                  </div>

                  <div className="calc-form-row">
                    <div className="calc-form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={contact.email}
                        onChange={handleContactChange}
                        aria-invalid={Boolean(errors.email)}
                      />
                      {errors.email && (
                        <span className="calc-field-error">{errors.email}</span>
                      )}
                    </div>
                    <div className="calc-form-group">
                      <label htmlFor="houseArea">House Area (Marla)</label>
                      <input
                        id="houseArea"
                        name="houseArea"
                        type="number"
                        min="0"
                        value={contact.houseArea}
                        onChange={handleContactChange}
                        aria-invalid={Boolean(errors.houseArea)}
                      />
                      {errors.houseArea && (
                        <span className="calc-field-error">{errors.houseArea}</span>
                      )}
                    </div>
                  </div>

                  <div className="calc-form-group">
                    <label htmlFor="address">Full Address</label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={contact.address}
                      onChange={handleContactChange}
                      aria-invalid={Boolean(errors.address)}
                    />
                    {errors.address && (
                      <span className="calc-field-error">{errors.address}</span>
                    )}
                  </div>
                </div>

                {/* 3. Load Calculator */}
                <div className="calc-block">
                  <div className="calc-block-header">
                    <h2 className="calc-block-title">3. Load Calculator</h2>
                    <div className="calc-load-total">
                      <span>Load Calculated (kW)</span>
                      <strong>{loadCalculated.toFixed(2)}</strong>
                    </div>
                  </div>

                  <div className="calc-load-list">
                    {LOAD_ITEMS.map(({ key, label, icon: Icon }) => (
                      <div className="calc-load-row" key={key}>
                        <span className="calc-load-label">
                          <Icon className="calc-load-icon" /> {label}
                        </span>
                        <select
                          aria-label={label}
                          value={loads[key]}
                          onChange={(e) => handleLoadChange(key, e.target.value)}
                        >
                          {QTY_OPTIONS.map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="calc-submit-btn"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending..." : "Request Quote"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default CalculatorPage;
