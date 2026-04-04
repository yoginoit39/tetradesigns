export const siteConfig = {
  name: 'Tetra Design & Concepts',
  tagline: '30 Years of Engineering Excellence',
  description:
    'A leading civil and structural engineering firm based in Kampala, Uganda. We deliver infrastructure that stands the test of time.',
  phone: '+256 000 000 000',
  email: 'info@tetradesignandconcepts.com',
  address: 'Kampala, Uganda',
  founded: '1994',
};

export const services = [
  {
    id: 'civil',
    title: 'Civil Engineering',
    icon: 'road',
    description:
      'Urban and rural water supply, treatment plants, dams, irrigation systems, sewerage, roads, and urban infrastructure.',
    items: [
      'Water Supply & Treatment',
      'Roads & Transport',
      'Dams & Irrigation',
      'Sewerage Systems',
      'Hydraulic Engineering',
      'Urban Infrastructure',
    ],
  },
  {
    id: 'structural',
    title: 'Structural Engineering',
    icon: 'building',
    description:
      'Foundation engineering, structural analysis, bridges, high-rise complexes, industrial buildings, and marine structures.',
    items: [
      'Foundation Engineering',
      'Bridges & Culverts',
      'Multi-Storey Complexes',
      'Industrial Buildings',
      'Retaining Structures',
      'Water Tanks & Silos',
    ],
  },
  {
    id: 'geotechnical',
    title: 'Geotechnical Investigations',
    icon: 'layers',
    description:
      'Comprehensive soil investigations, site assessments, and geotechnical reports for safe, accurate foundation design.',
    items: [
      'Soil Investigations',
      'Site Assessments',
      'Foundation Reports',
      'Slope Stability',
      'Ground Improvement',
      'Risk Assessment',
    ],
  },
  {
    id: 'project-management',
    title: 'Project Management',
    icon: 'clipboard',
    description:
      'End-to-end project delivery — on time and to budget. Drafting, planning, supervision, and quality control.',
    items: [
      'Construction Supervision',
      'Cost Estimation',
      'Schedule Management',
      'Quality Control',
      'Drafting & Drawing',
      'Feasibility Studies',
    ],
  },
];

export const projects = [
  {
    id: 'kasanje-manor',
    title: 'Kasanje Manor',
    category: 'Residential Development',
    location: 'Kasanje, Uganda',
    year: '2023',
    description:
      'Large-scale residential manor complex with full structural engineering, foundation design, and civil works. Mediterranean-inspired architecture with arched arcades and landscaped grounds.',
    image: '/projects/kasanje.jpg',
    tags: ['Structural', 'Residential', 'Foundation'],
  },
  {
    id: 'tho-commercial',
    title: 'THO Commercial Complex',
    category: 'Commercial Development',
    location: 'Kampala, Uganda',
    year: '2022',
    description:
      'Multi-storey commercial complex featuring curtain-wall glazing, cantilevered canopy, and full structural and civil engineering design.',
    image: '/projects/tho-commercial.jpg',
    tags: ['Commercial', 'Multi-Storey', 'Structural'],
  },
  {
    id: 'front2-residential',
    title: 'Lakeside Residence',
    category: 'Residential Development',
    location: 'Entebbe, Uganda',
    year: '2023',
    description:
      'Luxury residential estate with arched arcade, terracotta roof, and integrated civil works. Full structural analysis and foundation engineering on sloped terrain.',
    image: '/projects/front2-residential.jpg',
    tags: ['Residential', 'Structural', 'Civil'],
  },
  {
    id: 'project4',
    title: 'Infrastructure Works',
    category: 'Civil Engineering',
    location: 'Uganda',
    year: '2020',
    description:
      'Civil and structural engineering works including foundation design, site preparation, and construction supervision.',
    image: '/projects/project4.jpg',
    tags: ['Civil', 'Infrastructure', 'Supervision'],
  },
  {
    id: 'industrial-complex',
    title: 'Industrial Storage Complex',
    category: 'Industrial Engineering',
    location: 'Kampala, Uganda',
    year: '2022',
    description:
      'Design and supervision of a large-span industrial storage complex with structural steel and concrete foundations.',
    image: null,
    tags: ['Industrial', 'Structural', 'Steel'],
  },
  {
    id: 'bridge-rehabilitation',
    title: 'Bridge Rehabilitation',
    category: 'Infrastructure',
    location: 'Central Uganda',
    year: '2021',
    description:
      'Structural rehabilitation of a key bridge corridor — load analysis, material testing, and construction supervision.',
    image: null,
    tags: ['Bridges', 'Structural', 'Rehabilitation'],
  },
];

export const stats = [
  { value: '30+', label: 'Years Experience' },
  { value: '200+', label: 'Projects Completed' },
  { value: '50+', label: 'Active Clients' },
  { value: '100%', label: 'Delivery Rate' },
];

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
];
