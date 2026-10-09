import React from "react";
import "./TeamPages.css";
import ceo from "../../assets/teams/ceo.png";
import rafay from "../../assets/teams/rafay.jpg";
import waleed from "../../assets/teams/waleed.png";
import accountManager from "../../assets/teams/account-manager.png";

const teamMembers = [
  {
    id: 1,
    // Only the CEO has a message section.
    section: "Message",
    role: "CEO",
    heading: "CEO Message",
    name: "Safdar Hussain",
    paragraphs: [
      "At Madni Solar, our vision is to create a sustainable future by making solar energy affordable, reliable, and accessible across Pakistan. We work tirelessly to provide high quality solar solutions for homes, businesses, industries, and agriculture, helping people reduce electricity costs and achieve energy independence. Looking ahead, we aim to expand our reach and make solar system installation seamless for every customer. We are committed to innovative solar technologies, hybrid energy solutions, and eco friendly power alternatives that contribute to a greener Pakistan.",
    ],
    image: ceo,
    imageLabel: "CEO Message",
  },
  {
    id: 2,
    // Every other member shows an About section instead of a message.
    section: "About",
    role: "Director",
    // heading: "About",
    name: "Abdul Raffay",
    paragraphs: [
      "We supply Tier-1 solar panels, inverters, batteries, and accessories, always paired with honest guidance and reliable after-sales support. Each project starts with the customer's actual energy needs and budget, and we shape the solution around them. From design and installation to net metering and ongoing maintenance, our focus is maximum efficiency and long-term savings for every client.",
    ],
    image: rafay,
    imageLabel: "About",
  },
  {
    id: 3,
    section: "About",
    role: "Director",
    // heading: "About",
    name: "Waleed Hussain",
      paragraphs: [
      "Our customers come first at every step of their solar journey. From the initial consultation through to installation, our team provides clear advice, quality workmanship, and support you can count on. By pairing modern technology with hands-on expertise, we build lasting relationships and help communities across Pakistan switch to clean, affordable energy.",
    ],
    image: waleed,
    imageLabel: "About",
  },
  {
    id: 4,
    section: "About",
    role: "Account Manager",
    // heading: "About",
    // TODO: replace with the account manager's full name.
    name: "Account Manager",
    paragraphs: [
      "Our accounts team keeps your project running smoothly from the first quotation to final handover. We handle quotations, net metering paperwork, and payment coordination, and keep every account organised and current. With clear communication and prompt responses, you always know where your project stands, making the whole process simple and stress-free.",
    ],
    image: accountManager,
    imageLabel: "About",
  },
];

function TeamPage() {
  return (
    <section className="team-page">
      <div className="container team-container">
        {teamMembers.map((member) => (
          <div className="team-row" key={member.id}>
            {/* Left: content */}
            <div className="team-content">
              <div className="team-tag-wrap">
                <span className="team-tag">{member.section}</span>
                <span className="team-role">{member.role}</span>
              </div>
              <h4 className="team-name">{member.name}</h4>
              <h2 className="team-heading single">{member.heading}</h2>

              {member.paragraphs.map((text, index) => (
                <p className="team-text" key={index}>
                  {text}
                </p>
              ))}
            </div>

            {/* Right: image */}
            <div className="team-image-wrap">
              <div className="team-image-box">
                <img src={member.image} alt={member.name} />
              </div>
              <span className="team-circle"></span>
            </div>
          </div>
        ))}
      </div>
    </section>

    
  );
}

export default TeamPage;