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
      "Our Director leads the company with a clear vision of making solar energy accessible, reliable, and affordable for both domestic and industrial customers. With a focus on quality, innovation, and long-term sustainability, they oversee the delivery of solar installation projects that meet the unique energy needs of every client. Their commitment to high standards and customer satisfaction drives the company forward.",
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
      "Dedicated to delivering effective renewable energy solutions, our Director plays a key role in business development, project planning, and operational excellence. From residential solar systems to large-scale industrial installations, they help ensure every project is approached with care, professionalism, and attention to detail. Their goal is to help customers make smarter energy choices while contributing to a more sustainable future.",

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
      "Our Account Manager is the main point of contact for clients, ensuring clear communication and a smooth experience throughout every stage of their solar installation journey. From understanding individual requirements to coordinating with the technical team and providing project updates, they focus on building strong client relationships. Whether supporting homeowners or industrial businesses, they are committed to providing responsive service and tailored solar energy solutions.",
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