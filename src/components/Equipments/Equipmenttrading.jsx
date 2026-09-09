import React from "react";
import { Link } from "react-router-dom";
import "./Equipmenttrading.css";
import { FaSolarPanel, FaBolt, FaCarBattery } from "react-icons/fa";

function EquipmentTrading() {
  // Equipment data - easy to update or load from an API later.
  // `link` har category ki listing page par jata hai.
  const equipmentData = [
    {
      icon: <FaSolarPanel />,
      title: "Solar Panels",
      link: "/solar-panels",
    },
    {
      icon: <FaBolt />,
      title: "Inverters",
      link: "/inverters",
    },
    {
      icon: <FaCarBattery />,
      title: "Batteries",
      link: "/batteries",
    },
  ];

  return (
    <section className="equipment-section">
      <div className="container-equipment">
        {/* Small tag above heading */}
        <div className="equipment-tag flex justify-center">
          <span className="equipment-tag-highlight">madni solar</span>
          <span className="equipment-tag-plain">Equipment</span>
        </div>

        {/* Heading */}
        <h2 className="equipment-heading">Solar Equipment Trading</h2>
    
        {/* Cards */}
        <div className="equipment-grid grid">
          {equipmentData.map((item, index) => (
            <div className="equipment-card" key={index}>
              <div className="equipment-icon-wrapper">
                <span className="equipment-icon">{item.icon}</span>
              </div>
              <h3 className="equipment-title">{item.title}</h3>
              <Link to={item.link} className="equipment-btn">
                View All
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EquipmentTrading;