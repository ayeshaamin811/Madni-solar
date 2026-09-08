import React from "react";
import "./PolicyTrading.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import ContactInfoBar from "../../components/Contactinfobar/Contactinfobar";
import PolicyBanner from "../../assets/hero-banner.webp";

import {
  FaFileSignature,
  FaFileAlt,
  FaClipboardCheck,
  FaWrench,
  FaHeadset,
  FaHandshake,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

function PolicyTrading() {
  // Services offered under Policy Trading
  const servicesData = [
    {
      icon: <FaFileSignature />,
      title: "Policy Document Handling",
      description:
        "Preparation, review, and submission of all solar policy documentation with WAPDA, LESCO, and relevant authorities on your behalf.",
    },
    {
      icon: <FaClipboardCheck />,
      title: "Net Metering Registration",
      description:
        "Complete end-to-end assistance for your net metering application, from initial submission to inspection and final approval.",
    },
    {
      icon: <FaFileAlt />,
      title: "Load & Case Processing",
      description:
        "We manage utility load change requests, case processing, and the documentation required to keep your connection compliant.",
    },
    {
      icon: <FaWrench />,
      title: "Policy Compliance Guidance",
      description:
        "Clear, up-to-date guidance on the latest solar and net billing regulations so your installation always remains compliant.",
    },
    {
      icon: <FaHandshake />,
      title: "Vendor & Authority Coordination",
      description:
        "We coordinate directly with utility departments and vendors, saving you time and ensuring every step moves forward smoothly.",
    },
    {
      icon: <FaHeadset />,
      title: "Dedicated Support",
      description:
        "A dedicated team walks you through the entire policy trading process and answers any questions along the way.",
    },
  ];

  // Step by step process shown on the page
  const processData = [
    {
      step: "01",
      title: "Free Consultation",
      description:
        "Share your requirements with us. We assess your case and explain exactly what documentation and approvals your policy needs.",
    },
    {
      step: "02",
      title: "Documentation",
      description:
        "We prepare and compile every required document, ensuring everything is accurate and ready for submission.",
    },
    {
      step: "03",
      title: "Submission & Follow-up",
      description:
        "Your application is submitted to the relevant authority and we actively follow up on your case until it is processed.",
    },
    {
      step: "04",
      title: "Approval & Activation",
      description:
        "Once approved, we confirm your policy is active so you can start enjoying the benefits of net metering and reduced bills.",
    },
  ];

  // Key benefits checklist
  const benefitsData = [
    "Save time with complete document handling",
    "Hassle-free processing with utility departments",
    "Transparent updates at every stage",
    "Expert knowledge of current solar policies",
  ];

  // Detailed 21-point Business Dealing & Stock Delivery Policy
  const detailedPolicy = [
    // @@POLICY_DETAIL_LINES@@
    {
      num: "16",
      title: "Verified Stock Information",
      lines: [
        "Only Madni Solar's daily updated stock list or the stock available on www.sunsolar.pk is valid.",
        "Do not inquire about out-of-stock items.",
      ],
    },
    {
      num: "17",
      title: "Considerations before Purchase",
      lines: [
        "No return or exchange after purchase.",
        "Reasons may include:",
        "Market price fluctuations",
        "Stock purchased specifically as per customer requirement",
        "Reduced demand for specific items",
        "Technical or weather-related factors",
        "Solar panels, once dispatched from the warehouse, may show signs of handling such as loading/unloading marks or minor scratches. Therefore, return or exchange of solar panels is strictly not allowed.",
      ],
    },
    {
      num: "18",
      title: "Stock Delivery from Karachi Warehouse",
      lines: [
        "For all Karachi city deliveries, advance payment must be made via online bank transfer only.",
        "Delivery will be made directly to the customer's location through our own local transportation.",
      ],
    },
    {
      num: "19",
      title: "Prayer & Lunch Break",
      lines: [
        "Lunch Break: 1:00 PM to 2:00 PM",
        "Business activities will also be paused during other prayer times.",
      ],
    },
    {
      num: "20",
      title: "Datasheet / Technical Information",
      lines: [
        "Datasheets of all our available stock can be found in the Shop section of our website www.sunsolar.pk",
      ],
    },
    {
      num: "21",
      title: "Refund Policy",
      lines: [
        "No return or exchange after purchase and delivery of equipment. This policy applies due to the following reasons:",
        "Market price fluctuations",
        "Stock procurement specifically against customer requirements",
        "Reduced demand for certain items",
        "Technical issues or weather-related factors",
        "Solar panels, once dispatched from the warehouse, may show signs of handling such as loading/unloading marks or minor scratches. Therefore, return or exchange of solar panels is strictly not allowed.",
        "However, if payment has been made before purchase and the customer requests a refund prior to order delivery, the refund may be processed at the company's discretion, subject to applicable terms and deductions (if any).",
      ],
    },
    {
      num: "11",
      title: "Warranty & Service Claims",
      lines: [
        "All claims will be handled by the manufacturer as per their policy.",
        "Madni Solar only guarantees genuine import and genuine products.",
      ],
    },
    {
      num: "12",
      title: "Stock Delivery Sequence from Warehouse",
      lines: [
        "Stock will be provided only after prior approval and according to the arrival sequence of vehicles.",
        "Drivers are instructed to patiently wait for their turn.",
      ],
    },
    {
      num: "13",
      title: "No Liability for Shortage or Delay in Booked Stock",
      lines: [
        "Other than ready stock, the company will not be responsible for any import delays or logistics shortages.",
      ],
    },
    {
      num: "14",
      title: "Forklift Charges",
      lines: [
        "Per pallet forklift charges: PKR 500",
        "Forklift charges do not apply to open panels (less than a pallet).",
      ],
    },
    {
      num: "15",
      title: "Forklift Loading Hours",
      lines: [
        "Forklift loading hours: 11:00 AM to 8:00 PM",
      ],
    },
    {
      num: "06",
      title: "Payment Verification & DO Issuance",
      lines: [
        "Delivery challan will be issued within 45 minutes after bank payment verification.",
        "No delivery is possible without payment verification.",
      ],
    },
    {
      num: "07",
      title: "Stock Clearance after Payment",
      lines: [
        "Collect the stock immediately after payment.",
        "The company will not be responsible for any wattage or brand unavailability afterwards.",
      ],
    },
    {
      num: "08",
      title: "Required Information for Delivery",
      lines: [
        "Please provide the following details in a single message:",
        "Complete stock details",
        "Vehicle number",
        "Driver's name",
        "Driver's phone number",
        "Driver's CNIC number",
        "Your own name",
      ],
    },
    {
      num: "09",
      title: "Delivery Responsibility on Client",
      lines: [
        "We do not provide any delivery service.",
        "Please check the goods and documents at the time of receiving.",
        "No claims will be accepted after receipt.",
      ],
    },
    {
      num: "10",
      title: "Online Orders",
      lines: [
        "Orders can be sent through Asia Cargo, Daewoo, or any reliable courier service.",
        "Delivery charges will be paid by the customer.",
        "Once dispatched, full responsibility lies with the cargo service.",
      ],
    },
    {
      num: "01",
      title: "Business Hours",
      lines: [
        "Working Days: Monday to Saturday, 9:00 AM to 6:00 PM",
        "Last Payment Time: 5:30 PM",
        "No Delivery Order (DO) or challan will be issued after 6:00 PM.",
      ],
    },
    {
      num: "02",
      title: "Warehouse Hours & Overtime",
      lines: [
        "Warehouse gates will be closed at 8:00 PM.",
        "Vehicles arriving between 6:00 PM and 8:00 PM will be charged PKR 2,000 as overtime charges.",
      ],
    },
    {
      num: "03",
      title: "Mode of Communication",
      lines: [
        "All communication will be through WhatsApp messages only, on the following number: 03-111-666-677",
        "Verbal communication or through other channels will not be considered valid.",
      ],
    },
    {
      num: "04",
      title: "Token & Advance Policy",
      lines: [
        "We do not reserve stock against any type of token.",
        "Stock will only be confirmed after full payment.",
      ],
    },
    {
      num: "05",
      title: "Bank Account Payment",
      lines: [
        "Always confirm our bank account details with us before making any payment.",
      ],
    },
  ];

  // Shorter / summary version of the same policy (18 points)
  const summaryPolicy = [
    // @@POLICY_SUMMARY_LINES@@
    {
      num: "13",
      title: "Stock Availability Delays",
      lines: [
        "Madni Solar is not responsible for delays or shortages in stock availability (e.g., due to import delays or logistics issues) other than for ready stock.",
      ],
    },
    {
      num: "14",
      title: "Lifter Charges",
      lines: [
        "Lifter charges will be PKR 500 per pallet.",
        "These charges do not apply to loose panels (less than a full pallet).",
      ],
    },
    {
      num: "15",
      title: "Lifter Loading Timings",
      lines: [
        "Lifter-assisted loading will be available from 11:00 AM to 8:00 PM.",
        "Please adhere to these timings.",
      ],
    },
    {
      num: "16",
      title: "Stock Information",
      lines: [
        "Only Madni Solar's official stock updates are authentic.",
        "We provide daily updates of available stock.",
        "Please avoid inquiries about unavailable items.",
      ],
    },
    {
      num: "17",
      title: "Consider Before Purchase",
      lines: [
        "Please make sure of your decision before making a purchase.",
        "No returns or exchanges will be accepted after the sale due to:",
        "Market price fluctuations",
        "Stock ordered specifically for customer needs",
        "Drop in demand of specific items",
        "Technical or environmental factors",
      ],
    },
    {
      num: "18",
      title: "Prayer and Lunch Breaks",
      lines: [
        "There is a lunch and prayer break from 1:00 PM to 2:00 PM.",
        "Business operations also pause during other prayer times.",
      ],
    },
    {
      num: "07",
      title: "Information Required for Delivery",
      lines: [
        "Kindly provide the following details in a single message:",
        "Complete stock details",
        "Vehicle number",
        "Driver's name",
        "Driver's contact number",
        "Driver's CNIC number",
      ],
    },
    {
      num: "08",
      title: "Delivery Responsibility",
      lines: [
        "The client holds full responsibility for the delivery.",
        "We do not offer any delivery services.",
        "Please check the condition and documents of the goods at the time of receiving.",
        "We will not be liable for any claims after delivery.",
      ],
    },
    {
      num: "09",
      title: "Online Order Deliveries",
      lines: [
        "Online orders can be dispatched via Asia Cargo, Daewoo, or any reliable cargo service.",
        "Delivery charges will be paid by the customer.",
        "Delivery time may vary depending on the cargo service.",
        "After dispatch, the responsibility lies with the cargo service.",
      ],
    },
    {
      num: "10",
      title: "Warranty and Service Claims",
      lines: [
        "Warranty and service claims will be handled according to the manufacturer's policy and remain their responsibility.",
        "Madni Solar only guarantees genuine imports.",
      ],
    },
    {
      num: "11",
      title: "Warehouse Stock Delivery",
      lines: [
        "Stock will only be handed over from the warehouse upon prior approval and according to the vehicle arrival sequence.",
        "Please advise your driver to wait patiently for their turn.",
      ],
    },
    {
      num: "12",
      title: "Overtime Charges",
      lines: [
        "A charge of PKR 1,000 per vehicle will apply if the warehouse is accessed after 6:00 PM.",
      ],
    },
    {
      num: "01",
      title: "Business Hours",
      lines: [
        "Our business hours are Monday to Saturday, from 9:00 AM to 5:00 PM.",
        "All payments and vehicle details must be submitted before 5:00 PM.",
        "No Delivery Orders (DO) or challans will be issued after the specified time.",
      ],
    },
    {
      num: "02",
      title: "Written Communication Policy",
      lines: [
        "All communication will be conducted only via WhatsApp messages on our official business number 03-111-666-677.",
        "Verbal communication or messages through other channels will not be considered valid.",
      ],
    },
    {
      num: "03",
      title: "Token Policy",
      lines: [
        "We do not deal on token payments.",
        "Stock confirmation will only be provided upon full payment.",
      ],
    },
    {
      num: "04",
      title: "Account Verification Before Payment",
      lines: [
        "Please verify our designated bank account before making any payment to avoid fraud or misunderstandings.",
      ],
    },
    {
      num: "05",
      title: "Payment Confirmation",
      lines: [
        "After bank confirmation, the delivery challan will be issued within 45 minutes.",
        "No stock will be released without payment confirmation.",
      ],
    },
    {
      num: "06",
      title: "Stock Clearance After Payment",
      lines: [
        "Please collect the stock immediately after payment.",
        "We will not be responsible for any brand or wattage unavailability at a later time.",
      ],
    },
  ];

  // Company contact information
  const contactData = [
    // @@POLICY_CONTACT_LINES@@
    {
      label: "Phone Number",
      value: "+923 111 666 677",
      href: "tel:+923111666677",
    },
    {
      label: "Email Us Here",
      value: "info@sunsolar.pk",
      href: "mailto:info@sunsolar.pk",
    },
    {
      label: "Office Address",
      value: "502-C Jubilee Town, Canal Bank Lahore Pakistan.",
      href: "https://www.google.com/maps/search/?api=1&query=502-C+Jubilee+Town+Canal+Bank+Lahore+Pakistan",
    },
    {
      label: "Warehouse Address",
      value: "Defence Road, adjacent to US Apparel, Lahore",
      href: "https://www.google.com/maps/search/?api=1&query=Defence+Road+adjacent+to+US+Apparel+Lahore",
    },
  ];

  return (
    <div>
      <Navbar />

      {/* Page banner with breadcrumb */}
      <PageBanner
        image={PolicyBanner}
        title="Policy Trading"
        currentPage="Policy Trading"
      />
{/* ===== Intro section ===== */}
      <section className="policy-intro">
        <div className="container">
          <div className="policy-tag flex justify-center">
            <span className="policy-tag-highlight">Madni Solar</span>
            <span className="policy-tag-plain">Policy Trading Services</span>
          </div>

          <h2 className="policy-intro-heading">
            Complete handling of your solar policy applications — from
            documentation to final approval.
          </h2>

          <p className="policy-intro-text">
            Madni Solar takes the stress out of solar policy and net metering
            paperwork. Our experienced team manages your entire application
            process with utility companies, so you can focus on running your
            home or business while we take care of the rest. From net metering
            registration to net billing and compliance, we make sure your
            installation is set up quickly and correctly.
          </p>
        </div>
      </section>

 

      {/* ===== Benefits checklist ===== */}
      <section className="policy-benefits">
        <div className="container">
          <div className="policy-benefits-inner">
            <div className="policy-benefits-left">
              <h3 className="policy-benefits-heading">
                Why Choose Madni Solar For Your Policy Trading?
              </h3>
              <ul className="policy-benefits-list">
                {benefitsData.map((benefit, index) => (
                  <li key={index} className="policy-benefit-item">
                    <FaCheckCircle className="policy-benefit-icon" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <a href="/contact" className="policy-cta-btn">
                Get Started <FaArrowRight />
              </a>
            </div>

            <div className="policy-benefits-right">
              <div className="policy-benefit-card">
                <span className="policy-benefit-big">100%</span>
                <p>Of documentation handled by our expert team</p>
              </div>
              <div className="policy-benefit-card">
                <span className="policy-benefit-big">24/7</span>
                <p>Support throughout your application process</p>
              </div>
              <div className="policy-benefit-card">
                <span className="policy-benefit-big">1-to-1</span>
                <p>Dedicated guidance from start to approval</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Process steps ===== */}
      <section className="policy-process">
        <div className="container">
          <h3 className="policy-process-title">How It Works</h3>
          <div className="policy-process-grid grid">
            {processData.map((item, index) => (
              <div className="policy-process-card" key={index}>
                <span className="policy-process-step">{item.step}</span>
                <h4 className="policy-process-name">{item.title}</h4>
                <p className="policy-process-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* @@POLICY_SECTIONS@@ */}

      {/* ===== Contact & About Company ===== */}
      

      {/* ===== Policy Summary (Shorter Version) ===== */}
      <section className="policy-doc policy-summary">
        <div className="container">
          <div className="policy-tag flex justify-center">
            <span className="policy-tag-highlight">Madni Solar</span>
            <span className="policy-tag-plain">Policy at a Glance</span>
          </div>

          <h2 className="policy-doc-heading">
            Madni Solar – Business Dealing and Stock Delivery Policy
          </h2>

          <p className="policy-doc-bismillah">بِسمِ اللہِ الرَّحمٰنِ الرَّحِيم</p>

          <div className="policy-doc-list policy-summary-grid">
            {summaryPolicy.map((item, index) => (
              <div className="policy-doc-card" key={index}>
                <div className="policy-doc-head">
                  <span className="policy-doc-num">{item.num}</span>
                  <h3 className="policy-doc-title">{item.title}</h3>
                </div>
                <ul className="policy-doc-lines">
                  {item.lines.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="policy-doc-closing">Jazak Allah Khair</p>
          <p className="policy-doc-closing-text">
            Your cooperation is an honor for us. We are committed to transparent, well-managed, and
            trustworthy business relationships.
          </p>
        </div>
      </section>

      <ContactInfoBar />
      <Footer />
    </div>
  );
}

export default PolicyTrading;
