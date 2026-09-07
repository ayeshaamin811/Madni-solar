import SolarImg from "../assets/solar-products/solar-product.webp";

// Placeholder products — one per brand for now.
// Later this will come from an API; for now it's static data so every
// brand page has at least one product to display.
const solarPanelProducts = [
  {
    name: "Yingli Solar 550W Mono Panel",
    slug: "yingli-solar-550w-mono-panel",
    brandSlug: "yingli",
    price: 18500,
    image: SolarImg,
    shortDescription:
      "The Yingli Solar 550W Mono Panel is a high-efficiency monocrystalline module built for reliable, long-term performance in residential and commercial solar systems.",
    description: [
      "The Yingli Solar 550W Panel is engineered to deliver strong and consistent power output even in challenging environmental conditions.",
      "It uses high-purity monocrystalline cells to maximize energy conversion efficiency and reduce power loss over time.",
      "Its rugged frame and tempered glass ensure long-term durability in harsh weather.",
    ],
    whyChoose: [
      "High power output for residential and commercial use",
      "Monocrystalline cells for maximum efficiency",
      "Low degradation & long lifespan",
      "Strong durability with tempered glass",
    ],
    categories: ["Sun Solar", "Solar Panels", "Yingli"],
  },
  {
    name: "Astronergy Solar 555W Mono Panel",
    slug: "astronergy-solar-555w-mono-panel",
    brandSlug: "astronergy",
    price: 18900,
    image: SolarImg,
    shortDescription:
      "The Astronergy Solar 555W Mono Panel offers dependable efficiency and durability, suitable for homes, businesses, and large-scale installations.",
    description: [
      "The Astronergy 555W Panel is built with advanced cell technology to deliver strong and stable power output.",
      "It offers excellent performance in both high-temperature and low-light conditions.",
      "Constructed with durable materials to withstand years of outdoor exposure.",
    ],
    whyChoose: [
      "High power output for large-scale systems",
      "Advanced cell technology",
      "Low degradation & long lifespan",
      "Strong durability with dual-glass design",
    ],
    categories: ["Sun Solar", "Solar Panels", "Astronergy"],
  },
  {
    name: "Hanersun Solar 545W Mono Panel",
    slug: "hanersun-solar-545w-mono-panel",
    brandSlug: "hanersun",
    price: 17800,
    image: SolarImg,
    shortDescription:
      "The Hanersun Solar 545W Mono Panel provides efficient, long-lasting energy generation for a wide range of solar applications.",
    description: [
      "The Hanersun 545W Panel is engineered for consistent power output across varying weather conditions.",
      "It features high-efficiency cells that maximize energy yield per square meter.",
      "Built with a durable frame and glass for extended outdoor use.",
    ],
    whyChoose: [
      "Efficient energy generation",
      "High-efficiency solar cells",
      "Low degradation & long lifespan",
      "Durable frame and glass",
    ],
    categories: ["Sun Solar", "Solar Panels", "Hanersun"],
  },
  {
    name: "Risen Solar 560W Mono Panel",
    slug: "risen-solar-560w-mono-panel",
    brandSlug: "risen",
    price: 19200,
    image: SolarImg,
    shortDescription:
      "The Risen Solar 560W Mono Panel is designed for high power output and long-term reliability across residential and commercial systems.",
    description: [
      "The Risen 560W Panel uses advanced monocrystalline technology for higher efficiency and better performance.",
      "It maintains stable output even under high-temperature conditions.",
      "Built with a strong dual-glass structure for long-term durability.",
    ],
    whyChoose: [
      "High power output for large-scale systems",
      "Advanced monocrystalline technology",
      "Low degradation & long lifespan",
      "Strong durability with dual-glass design",
    ],
    categories: ["Sun Solar", "Solar Panels", "Risen"],
  },
  {
    name: "TCL Solar 620W Bifacial Solar Panel",
    slug: "tcl-solar-620w-bifacial-solar-panel",
    brandSlug: "tcl",
    price: 23250,
    image: SolarImg,
    shortDescription:
      "The TCL Solar 620W Bifacial Solar Panel is a high-performance N-Type TOPCon module designed for commercial and large-scale solar installations, offering enhanced efficiency, durability, and increased energy generation through bifacial technology.",
    description: [
      "The TCL Solar 620W Bifacial Panel is engineered to deliver strong and consistent power output even in challenging environmental conditions.",
      "With advanced TOPCon technology, it offers higher efficiency, lower degradation, and better temperature performance compared to conventional panels.",
      "Its bifacial design allows the panel to generate electricity from both the front and rear sides, increasing total energy yield and improving overall system performance.",
      "Built with durable dual-glass construction, it ensures long-term reliability, resistance to harsh weather, and stable performance over time.",
    ],
    whyChoose: [
      "High power output for large-scale systems",
      "Bifacial technology for extra energy generation",
      "Advanced N-Type TOPCon cells",
      "Low degradation & long lifespan",
      "Strong durability with dual-glass design",
    ],
    categories: ["Sun Solar", "Solar Panels", "TCL"],
  },
  {
    name: "Jinko Solar 585W Mono Panel",
    slug: "jinko-solar-585w-mono-panel",
    brandSlug: "jinko",
    price: 20500,
    image: SolarImg,
    shortDescription:
      "The Jinko Solar 585W Mono Panel delivers high efficiency and reliable performance, ideal for residential, commercial, and utility-scale projects.",
    description: [
      "The Jinko 585W Panel is built with N-Type technology for higher energy yield and lower degradation.",
      "It performs well in both high-temperature and low-irradiance conditions.",
      "Constructed with a rugged frame and tempered glass for long-term reliability.",
    ],
    whyChoose: [
      "High power output for large-scale systems",
      "N-Type technology for extra efficiency",
      "Low degradation & long lifespan",
      "Strong durability with tempered glass",
    ],
    categories: ["Sun Solar", "Solar Panels", "Jinko"],
  },
  {
    name: "Mesol Alpha Solar 550W Mono Panel",
    slug: "mesol-alpha-solar-550w-mono-panel",
    brandSlug: "mesol-alpha",
    price: 18200,
    image: SolarImg,
    shortDescription:
      "The Mesol Alpha Solar 550W Mono Panel offers dependable power generation with a strong balance of efficiency and durability.",
    description: [
      "The Mesol Alpha 550W Panel is designed to deliver stable performance across a wide range of climates.",
      "It uses high-quality monocrystalline cells to maximize power output.",
      "Built with a durable frame suited for long-term outdoor installation.",
    ],
    whyChoose: [
      "Reliable power generation",
      "High-quality monocrystalline cells",
      "Low degradation & long lifespan",
      "Durable outdoor-rated frame",
    ],
    categories: ["Sun Solar", "Solar Panels", "Mesol Alpha"],
  },
  {
    name: "Osda Solar 545W Mono Panel",
    slug: "osda-solar-545w-mono-panel",
    brandSlug: "osda",
    price: 17600,
    image: SolarImg,
    shortDescription:
      "The Osda Solar 545W Mono Panel provides efficient and reliable solar power generation for homes and businesses.",
    description: [
      "The Osda 545W Panel is engineered for consistent output across varying weather conditions.",
      "It offers good efficiency at a competitive price point.",
      "Built with durable materials for long-term reliability.",
    ],
    whyChoose: [
      "Efficient energy generation",
      "Competitive pricing",
      "Low degradation & long lifespan",
      "Durable construction",
    ],
    categories: ["Sun Solar", "Solar Panels", "Osda"],
  },
  {
    name: "Tongwei Solar 555W Mono Panel",
    slug: "tongwei-solar-555w-mono-panel",
    brandSlug: "tongwei",
    price: 18700,
    image: SolarImg,
    shortDescription:
      "The Tongwei Solar 555W Mono Panel combines strong efficiency and durability for residential and commercial solar systems.",
    description: [
      "The Tongwei 555W Panel is built with advanced cell technology to maximize energy conversion.",
      "It maintains stable performance across a wide temperature range.",
      "Constructed with a strong frame and tempered glass for long service life.",
    ],
    whyChoose: [
      "Strong efficiency and durability",
      "Advanced cell technology",
      "Low degradation & long lifespan",
      "Tempered glass construction",
    ],
    categories: ["Sun Solar", "Solar Panels", "Tongwei"],
  },
  {
    name: "Aiko Solar 615W Bifacial Panel",
    slug: "aiko-solar-615w-bifacial-panel",
    brandSlug: "aiko-solar",
    price: 22800,
    image: SolarImg,
    shortDescription:
      "The Aiko Solar 615W Bifacial Panel uses ABC cell technology to deliver exceptional efficiency and energy generation from both sides of the panel.",
    description: [
      "The Aiko 615W Bifacial Panel is engineered with all-back-contact (ABC) cell technology for higher efficiency.",
      "Its bifacial design captures additional energy from reflected light on the rear side.",
      "Built with a durable dual-glass structure for long-term reliability.",
    ],
    whyChoose: [
      "High power output for large-scale systems",
      "Bifacial technology for extra energy generation",
      "Advanced ABC cell technology",
      "Strong durability with dual-glass design",
    ],
    categories: ["Sun Solar", "Solar Panels", "Aiko Solar"],
  },
  {
    name: "Huasun Solar 610W Heterojunction Panel",
    slug: "huasun-solar-610w-heterojunction-panel",
    brandSlug: "huasun",
    price: 23500,
    image: SolarImg,
    shortDescription:
      "The Huasun Solar 610W Heterojunction Panel offers premium efficiency and performance using advanced HJT cell technology.",
    description: [
      "The Huasun 610W Panel uses heterojunction (HJT) technology for higher efficiency and lower temperature coefficient.",
      "It performs exceptionally well in high-temperature environments compared to conventional panels.",
      "Built with a durable dual-glass structure for long-term durability.",
    ],
    whyChoose: [
      "Premium efficiency with HJT technology",
      "Better performance in high temperatures",
      "Low degradation & long lifespan",
      "Strong durability with dual-glass design",
    ],
    categories: ["Sun Solar", "Solar Panels", "Huasun"],
  },
  {
    name: "Canadian Solar 550W Mono Panel",
    slug: "canadian-solar-550w-mono-panel",
    brandSlug: "canadian",
    price: 19000,
    image: SolarImg,
    shortDescription:
      "The Canadian Solar 550W Mono Panel is a trusted, globally recognized module offering reliable performance and durability.",
    description: [
      "The Canadian Solar 550W Panel is built with high-quality monocrystalline cells for consistent power output.",
      "It is backed by a strong global manufacturing track record for quality and reliability.",
      "Constructed with a durable frame and tempered glass for long service life.",
    ],
    whyChoose: [
      "Trusted global brand",
      "High-quality monocrystalline cells",
      "Low degradation & long lifespan",
      "Strong durability with tempered glass",
    ],
    categories: ["Sun Solar", "Solar Panels", "Canadian"],
  },
  {
    name: "JA Solar 585W Mono Panel",
    slug: "ja-solar-585w-mono-panel",
    brandSlug: "ja-solar",
    price: 20200,
    image: SolarImg,
    shortDescription:
      "The JA Solar 585W Mono Panel delivers high efficiency and reliable output, ideal for residential, commercial, and utility projects.",
    description: [
      "The JA Solar 585W Panel uses advanced cell technology for higher efficiency and lower degradation.",
      "It offers strong performance across a wide range of environmental conditions.",
      "Built with a rugged frame and tempered glass for long-term reliability.",
    ],
    whyChoose: [
      "High power output for large-scale systems",
      "Advanced cell technology",
      "Low degradation & long lifespan",
      "Strong durability with tempered glass",
    ],
    categories: ["Sun Solar", "Solar Panels", "JA Solar"],
  },
  {
    name: "Ronma Solar 550W Mono Panel",
    slug: "ronma-solar-550w-mono-panel",
    brandSlug: "ronma-solar",
    price: 17900,
    image: SolarImg,
    shortDescription:
      "The Ronma Solar 550W Mono Panel offers reliable and efficient power generation for a range of solar installations.",
    description: [
      "The Ronma Solar 550W Panel is designed for consistent output across varying weather conditions.",
      "It uses efficient monocrystalline cells to maximize energy yield.",
      "Built with a durable frame suited for long-term outdoor use.",
    ],
    whyChoose: [
      "Reliable and efficient output",
      "Monocrystalline cell technology",
      "Low degradation & long lifespan",
      "Durable outdoor-rated frame",
    ],
    categories: ["Sun Solar", "Solar Panels", "Ronma Solar"],
  },
  {
    name: "Znshine Solar 555W Mono Panel",
    slug: "znshine-solar-555w-mono-panel",
    brandSlug: "znshine",
    price: 18300,
    image: SolarImg,
    shortDescription:
      "The Znshine Solar 555W Mono Panel provides dependable performance and durability for residential and commercial systems.",
    description: [
      "The Znshine 555W Panel is engineered for stable power output in diverse climates.",
      "It offers a strong balance of efficiency and affordability.",
      "Constructed with durable materials for long-term reliability.",
    ],
    whyChoose: [
      "Dependable performance",
      "Strong balance of efficiency and price",
      "Low degradation & long lifespan",
      "Durable construction",
    ],
    categories: ["Sun Solar", "Solar Panels", "Znshine"],
  },
  {
    name: "Longi Solar 590W Mono Panel",
    slug: "longi-solar-590w-mono-panel",
    brandSlug: "longi",
    price: 21000,
    image: SolarImg,
    shortDescription:
      "The Longi Solar 590W Mono Panel is a premium high-efficiency module trusted worldwide for residential and commercial installations.",
    description: [
      "The Longi 590W Panel uses advanced monocrystalline technology for maximum energy conversion.",
      "It is backed by Longi's global reputation for quality and innovation.",
      "Built with a durable frame and tempered glass for long-term performance.",
    ],
    whyChoose: [
      "Premium high-efficiency module",
      "Trusted global manufacturer",
      "Low degradation & long lifespan",
      "Strong durability with tempered glass",
    ],
    categories: ["Sun Solar", "Solar Panels", "Longi"],
  },
  {
    name: "Trina Solar 590W Mono Panel",
    slug: "trina-solar-590w-mono-panel",
    brandSlug: "trina-solar",
    price: 20800,
    image: SolarImg,
    shortDescription:
      "The Trina Solar 590W Mono Panel offers excellent efficiency and reliability, suited for large-scale and residential solar systems.",
    description: [
      "The Trina Solar 590W Panel is engineered with advanced cell technology for higher power output.",
      "It maintains strong performance in both high-temperature and low-light conditions.",
      "Built with a durable dual-glass structure for long-term reliability.",
    ],
    whyChoose: [
      "Excellent efficiency and reliability",
      "Advanced cell technology",
      "Low degradation & long lifespan",
      "Strong durability with dual-glass design",
    ],
    categories: ["Sun Solar", "Solar Panels", "Trina Solar"],
  },
  {
    name: "Cora Dawn Solar 545W Mono Panel",
    slug: "cora-dawn-solar-545w-mono-panel",
    brandSlug: "cora-dawn",
    price: 17700,
    image: SolarImg,
    shortDescription:
      "The Cora Dawn Solar 545W Mono Panel delivers efficient and reliable power generation for a variety of solar applications.",
    description: [
      "The Cora Dawn 545W Panel is designed for consistent output across varying environmental conditions.",
      "It uses efficient monocrystalline cells to maximize energy yield.",
      "Built with a durable frame for long-term outdoor use.",
    ],
    whyChoose: [
      "Efficient and reliable output",
      "Monocrystalline cell technology",
      "Low degradation & long lifespan",
      "Durable outdoor-rated frame",
    ],
    categories: ["Sun Solar", "Solar Panels", "Cora Dawn"],
  },
];

export default solarPanelProducts;