import React from "react";
import { Sun, Zap, BatteryCharging, Cable, Settings, ShieldCheck, LayoutGrid } from "lucide-react";
import "./Productsgrid.css";

// Simple list of product data (icon, title, description, image)
// Images are from Unsplash, matched to each product's category
const products = [
  {
    id: 1,
    icon: Sun,
    title: "Solar Panels",
    description:
      "High efficiency mono and bifacial solar panels from top brands, with maximum power output.",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    icon: Zap,
    title: "Solar Inverters",
    description:
      "Ongrid and hybrid solar inverters from top brands, with best performance and high efficiency.",
    image:
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    icon: BatteryCharging,
    title: "Solar Batteries",
    description:
      "Reliable lithium and AGM solar batteries from top brands, ensuring long backup, and efficiency.",
    image:
      "https://images.unsplash.com/photo-1605191737662-98ba90cb953e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    icon: Cable,
    title: "Cables and Wiring",
    description:
      "High quality DC, AC, and Earthing cables for safe and efficient energy transmission.",
    image:
      "https://images.unsplash.com/photo-1517373116369-9bdb8cdc9f62?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    icon: Settings,
    title: "VFDs (Variable Frequency Drives)",
    description:
      "Energy efficient VFDs to optimize motor control and reduce power consumption.",
    image:
      "https://images.unsplash.com/photo-1592318348310-f31b61a931c8?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    icon: ShieldCheck,
    title: "Breakers and Protection Devices",
    description:
      "Durable breakers and protection devices for safe, efficient, and best solar system performance.",
    image:
      "https://images.unsplash.com/photo-1660330589827-da8ab7dd3c02?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 7,
    icon: LayoutGrid,
    title: "Solar Mounting Structures",
    description:
      "Strong and reliable solar mounting structures for secure panel installation, with durability.",
    image:
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=600&q=80",
  },
];

// Simple Products Grid section component
function ProductsGrid() {
  return (
    <section className="pg-section">
      {/* Top badge */}
      <div className="pg-badge-wrapper flex justify-center">
        <span className="pg-badge-tag">Madni Solar</span>
        <span className="pg-badge-label">Products</span>
      </div>

      {/* Section heading */}
      <h1 className="pg-heading">
        Power Your Future with the Best Solar Products
      </h1>

      {/* Products grid */}
      <div className="pg-grid grid">
        {products.map((product) => {
          const Icon = product.icon;
          return (
            <div className="pg-card" key={product.id}>
              {/* Product image */}
              <div className="pg-image-wrapper">
                <img
                  src={product.image}
                  alt={product.title}
                  className="pg-image"
                />
                <span className="pg-icon">
                  <Icon size={22} strokeWidth={2} />
                </span>
              </div>

              {/* Product text content */}
              <div className="pg-content">
                <h3 className="pg-title">{product.title}</h3>
                <p className="pg-description">{product.description}</p>

                {/* Read More button */}
                <button type="button" className="pg-btn-read-more">
                  Read More <span className="pg-arrow">→</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ProductsGrid;