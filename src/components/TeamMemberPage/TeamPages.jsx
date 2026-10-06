import React from "react";
import "./TeamPages.css";

const teamMembers = [
  {
    id: 1,
    tag: "About",
    role: "CEO",
    heading: "CEO Message",
    name: "CEO Ahmed Raza",
    paragraphs: [
      "At Madni Solar, our vision is to create a sustainable future by making solar energy affordable, reliable, and accessible across Pakistan. We work tirelessly to provide high quality solar solutions for homes, businesses, industries, and agriculture, helping people reduce electricity costs and achieve energy independence.",
      "Looking ahead, we aim to expand our reach and make solar system installation seamless for every customer. We are committed to innovative solar technologies, hybrid energy solutions, and eco friendly power alternatives that contribute to a greener Pakistan.",
    ],
    image: "https://picsum.photos/seed/madni-team-1/600/400",
    imageLabel: "CEO Message",
  },
  {
    id: 2,
    tag: "About",
    role: "Managing Director",
    heading: "Managing Director Message",
    name: "Managing Director Bilal Hussain",
    paragraphs: [
      "Our team is dedicated to delivering Tier-1 solar panels, inverters, batteries, and accessories backed by honest advice and dependable after-sales support. Every project we take on is designed around the customer's real energy needs and budget.",
      "From system design and installation to net billing and maintenance, we make sure each customer gets maximum efficiency and long term savings. Together, let's move towards a clean, cost effective, and energy secure future.",
    ],
    image: "https://picsum.photos/seed/madni-team-2/600/400",
    imageLabel: "MD Message",
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
                <span className="team-tag">{member.tag}</span>
                <span className="team-role">{member.role}</span>
              </div>

              <h2 className="team-heading single">{member.heading}</h2>
              <h4 className="team-name">{member.name}</h4>

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