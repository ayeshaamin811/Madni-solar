import React from "react";
import "./TeamPages.css";
import team1 from "../../assets/teams/team.jpg";
import team2 from "../../assets/teams/rafay.jpg";
import team3 from "../../assets/teams/waleed.png";

const teamMembers = [
  {
    id: 1,
    tag: "About",
    role: "CEO",
    heading: "CEO Message",
    name: "Safdar Hussain",
    paragraphs: [
      "At Madni Solar, our vision is to create a sustainable future by making solar energy affordable, reliable, and accessible across Pakistan. We work tirelessly to provide high quality solar solutions for homes, businesses, industries, and agriculture, helping people reduce electricity costs and achieve energy independence. Looking ahead, we aim to expand our reach and make solar system installation seamless for every customer. We are committed to innovative solar technologies, hybrid energy solutions, and eco friendly power alternatives that contribute to a greener Pakistan.",
    ],
    image: team1,
    imageLabel: "CEO Message",
  },
  {
    id: 2,
    tag: "About",
    role: "Director",
    heading: "Director Message",
    name: "Abdul Raffay",
    paragraphs: [
      "Our team is dedicated to delivering Tier-1 solar panels, inverters, batteries, and accessories backed by honest advice and dependable after-sales support. Every project we take on is designed around the customer's real energy needs and budget. From system design and installation to net billing and maintenance, we make sure each customer gets maximum efficiency and long term savings. Together, let's move towards a clean, cost effective, and energy secure future",
    ],
    image: team2,
    imageLabel: "Director Message",
  },
  {
    id: 3,
    tag: "About",
    role: "Director",
    heading: "Director Message",
    name: "Waleed Hussain",
    paragraphs: [
      "We firmly believe in putting the customer first at every stage of their solar journey. Our committed professionals guide clients from the very first consultation to installation, ensuring transparency, quality workmanship, and complete satisfaction. By combining the latest technology with practical expertise, we are building long lasting relationships and helping communities across Pakistan embrace clean, affordable, and sustainable energy solutions.",
    ],
    image: team3,
    imageLabel: "Director Message",
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