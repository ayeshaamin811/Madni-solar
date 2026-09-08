import React from "react";
import { Trophy, Rocket, Award } from "lucide-react";
import "./CareerContent.css";
import privacyBannerImg from "../../assets/hero-banner.webp";


// Data for the "Why Choose" cards
const whyChooseCards = [
  {
    id: 1,
    icon: Trophy,
    title: "Expertise and Experience",
    description:
      "With years of experience in the renewable energy sector, our team brings unparalleled expertise and innovative solutions to every project.",
  },
  {
    id: 2,
    icon: Rocket,
    title: "Customer-Centric Approach",
    description:
      "We focus on customer satisfaction by providing tailored solar solutions, professional guidance, reliable installation, and dedicated after-sales support.",
  },
  {
    id: 3,
    icon: Award,
    title: "Innovative Technologies",
    description:
      "Using the latest advancements in solar panels, inverters, and batteries, we ensure maximum efficiency and long-term performance.",
  },
];

// Data for the "Work Process" cards
const workProcessCards = [
  {
    id: 1,
    number: "01",
    image:
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=600&q=80",
    title: "Solar Energy Solutions",
    description:
      "From system design to installation and net metering, we provide end-to-end solar services for homes, businesses, and industries.",
  },
  {
    id: 2,
    number: "02",
    image:
      "https://images.unsplash.com/photo-1605191737662-98ba90cb953e?auto=format&fit=crop&w=600&q=80",
    title: "Top Tier Products",
    description:
      "We offer high quality solar panels, inverters, batteries, and accessories, ensuring durability, efficiency, and long term performance.",
  },
  {
    id: 3,
    number: "03",
    image:
      "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?auto=format&fit=crop&w=600&q=80",
    title: "Consulting and Support",
    description:
      "Our team provides professional guidance, seamless installation, and after-sales support to keep your solar system running at peak efficiency.",
  },
];

// Simple Career page content: hero, why-choose, and work-process sections
function CareerContent() {
  return (
    <>
      {/* ===== Hero / Career banner section ===== */}
      <section className="career-hero">
        <div className="career-hero-inner flex items-center">
          {/* Left image collage */}
          <div className="hero-image-grid grid">
            <img
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80"
              alt="Solar panel field"
              className="hero-grid-image"
            />
            <img
              src="https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?auto=format&fit=crop&w=400&q=80"
              alt="Solar panel mounting structure"
              className="hero-grid-image"
            />
            <img
              src="https://images.unsplash.com/photo-1592318348310-f31b61a931c8?auto=format&fit=crop&w=400&q=80"
              alt="Technician holding a tool"
              className="hero-grid-image"
            />
            <img
              src="https://images.unsplash.com/photo-1729701594031-b5824b15f899?auto=format&fit=crop&w=400&q=80"
              alt="Solar equipment circuit board"
              className="hero-grid-image"
            />
          </div>

          {/* Right text content */}
          <div className="hero-text">
            <span className="hero-watermark">Madni Solar</span>

            <div className="badge-wrapper flex items-center">
              <span className="badge-tag">Career</span>
              <span className="badge-label">Opportunities</span>
            </div>

            <h1 className="hero-title">Madni Solar</h1>
            <h2 className="hero-subtitle">
              Join Our Growing Team and Power the Future of Energy
            </h2>

            <p className="hero-descriptions">
              At madni solar, we&apos;re not just providing solar solutions —
              we&apos;re shaping a brighter, more sustainable future for
              Pakistan. We are constantly looking for passionate, driven, and
              talented individuals to join our team. Whether you&apos;re an
              experienced professional or just starting your career, madni solar
              offers exciting opportunities for growth and development in the
              renewable energy industry.
            </p>

            <button type="button" className="btn-primary">
              Click Here
            </button>
          </div>
        </div>
      </section>

      {/* ===== Why Choose section ===== */}
      <section className="why-choose">
        <div className="why-choose-header">
          <div className="badge-wrapper flex items-center justify-center">
            <span className="badge-tag">Why Choose</span>
            <span className="badge-label">Madni Solar?</span>
          </div>

          <p className="why-choose-text">
            At madni solar, we believe in transforming Pakistan&apos;s energy
            future with clean, reliable, and affordable solar solutions. Join
            us in building a greener, more sustainable tomorrow for future
            generations.
          </p>
        </div>

        <div className="why-choose-grid grid">
          {whyChooseCards.map((card) => {
            const Icon = card.icon;
            return (
              <div className="why-choose-card" key={card.id}>
                <div className="why-choose-icon flex items-center justify-center">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <h3 className="why-choose-title">{card.title}</h3>
                <p className="why-choose-description">{card.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== Work Process section ===== */}
      <section className="work-process">
        <div className="work-process-header flex items-start justify-between">
          <div>
            <span className="work-process-label">— WORK PROCESS</span>
            <h2 className="work-process-title">What we do at madni solar</h2>
          </div>

          <p className="work-process-text">
            madni solar specializes in high quality solar solutions, offering
            system design, installation, net metering, maintenance, and top
            tier products for homes, businesses, industries, and agriculture.
          </p>
        </div>

        <div className="work-process-grid grid">
          {workProcessCards.map((card) => (
            <div className="work-process-card" key={card.id}>
              <div className="work-process-image-wrapper">
                <img
                  src={card.image}
                  alt={card.title}
                  className="work-process-image"
                />
                <span className="work-process-number">{card.number}</span>
              </div>
              <h3 className="work-process-card-title">{card.title}</h3>
              <p className="work-process-card-description">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default CareerContent;