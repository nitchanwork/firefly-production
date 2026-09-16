export const categories = [
  { id: 'photo', label: 'PHOTO', title: 'PHOTO PRODUCTION' },
  { id: 'video', label: 'VIDEO', title: 'VIDEO PRODUCTION' },
  { id: 'art-direction', label: 'ART DIRECTION', title: 'ART DIRECTION' },
  { id: 'content', label: 'CONTENT', title: 'CONTENT PLANNING' },
  { id: 'consulting', label: 'CONSULTING', title: 'CONSULTING' },
] as const;

export interface PricingOption {
  label: string;
  duration?: string;
  price: number;
}

export interface AddOn {
  label: string;
  price: number;
  unit: string;
  from?: boolean;
}

// Public customer information only. Never add internal business allocations here.
export interface Service {
  id: string;
  category: (typeof categories)[number]['id'];
  number: string;
  title: string;
  shortDescription: string;
  startingPrice: number;
  priceType: 'from' | 'project' | 'session';
  pricingOptions: PricingOption[];
  duration: string;
  vatExcluded?: true;
  team: string[];
  topics?: string[];
  deliverables: string[];
  turnaround?: string;
  revisions?: string;
  addOns: AddOn[];
  notes: string[];
}

export const formatPrice = (price: number) => `฿${price.toLocaleString('en-US')}`;

const photoTeam = ['Photographer', 'Art Director', 'Food Stylist', 'Camera + Lens Equipment', 'Laptop for operation', 'Nanlite Studio Lighting Set', 'Props based on client brief'];
const photoDeliverables = ['5–8 fully retouched images', 'Edited and synced JPEG files from the shoot', 'Delivered through Google Drive', 'Files backed up for 60 days after delivery'];
const photoAddOns: AddOn[] = [
  { label: 'Overtime', price: 5000, unit: 'hour' },
  { label: 'Additional revision', price: 500, unit: 'image' },
];
const photoNotes = ['Pricing may vary depending on project type, production requirements and scale.'];
const videoEquipment = ['Sony A7S III', 'Sony 70–200mm F2.8 GM II', 'Sony 16–35mm F4 G', 'Rode Wireless Pro', 'Sachtler Tripod', 'DJI RS5'];
const videoAddOns: AddOn[] = [
  { label: 'Additional revision', price: 2000, unit: 'revision' },
  { label: 'Color Graded Footage', price: 500, unit: 'video' },
  { label: 'Motion Graphic', price: 3500, unit: 'piece', from: true },
];
const consultingTopics = ['Photo & Video Shooting', 'Video Editing', 'Color Grading', 'Lighting', 'Graphic Design', 'Motion Graphic'];

export const services: Service[] = [
  {
    id: 'photo-onsite', category: 'photo', number: '01',
    title: 'Photography Production Team / Clients On-site',
    shortDescription: 'On-location photography production',
    startingPrice: 15000, priceType: 'from', duration: 'Half Day / Full Day', vatExcluded: true,
    pricingOptions: [{ label: 'Half Day', duration: '6 Hours', price: 15000 }, { label: 'Full Day', duration: '10 Hours', price: 25000 }],
    team: [...photoTeam, 'Team transportation and meals'], deliverables: photoDeliverables,
    turnaround: '7–14 days after production day', revisions: '2 revisions per retouched image',
    addOns: photoAddOns, notes: photoNotes,
  },
  {
    id: 'photo-studio', category: 'photo', number: '02',
    title: 'Photography Production Team / Full Service with Studio',
    shortDescription: 'Full-service studio photography production',
    startingPrice: 35000, priceType: 'from', duration: 'Full Day · 10 Hours', vatExcluded: true,
    pricingOptions: [], team: [...photoTeam, 'Studio'], deliverables: photoDeliverables,
    turnaround: '7–14 days after production day', revisions: '2 revisions per retouched image',
    addOns: photoAddOns, notes: photoNotes,
  },
  {
    id: 'video-social', category: 'video', number: '01', title: 'Video Content for Social Media',
    shortDescription: 'Social-first video production for brands',
    startingPrice: 15000, priceType: 'from', duration: '1 production day · 8 Hours', vatExcluded: true,
    pricingOptions: [], team: ['Creative', 'Videographer', ...videoEquipment, 'Nanlite Studio Lighting Set', 'Video Editor'],
    deliverables: ['10 color graded social videos', '1080p', '50fps'],
    turnaround: '7–14 days after production', revisions: '2 revisions per video',
    addOns: [
      { label: 'Overtime', price: 5000, unit: 'hour' },
      { label: 'Additional revision', price: 500, unit: 'video' },
      { label: '4K 50fps', price: 500, unit: 'video' },
      { label: 'Color Graded Footage', price: 300, unit: 'video' },
      { label: 'Motion Graphic', price: 3500, unit: 'piece', from: true },
    ], notes: [],
  },
  {
    id: 'video-company', category: 'video', number: '02', title: 'Company Presentation Video',
    shortDescription: 'Company, corporate and brand presentation production',
    startingPrice: 25000, priceType: 'from', duration: '1 production day · 10 Hours', vatExcluded: true,
    pricingOptions: [], team: ['Creative Producer', 'Art Director', 'Videographer', ...videoEquipment, 'Nanlite Studio Lighting Set', 'Video Editor', 'Colorist'],
    deliverables: ['1 color graded video', '4K', '50fps'],
    turnaround: '7–14 days after production', revisions: '2 revisions', addOns: videoAddOns, notes: [],
  },
  {
    id: 'video-commercial', category: 'video', number: '03', title: 'Commercial / Music Video / Advertising',
    shortDescription: 'Full-scale commercial production',
    startingPrice: 80000, priceType: 'from', duration: 'Full Day · 10 Hours', vatExcluded: true,
    pricingOptions: [], team: ['Creative Producer', 'Art Director', 'Videographer', ...videoEquipment, 'Lighting Team', 'Video Editor', 'Colorist'],
    deliverables: ['1 color graded video', '4K', '50fps'],
    turnaround: '7–14 days after production', revisions: '2 revisions', addOns: videoAddOns, notes: [],
  },
  {
    id: 'art-product', category: 'art-direction', number: '01', title: 'Product Campaign Art Direction',
    shortDescription: 'Visual direction and production guideline for product campaigns',
    startingPrice: 30000, priceType: 'project', duration: 'Project', vatExcluded: true,
    pricingOptions: [], team: ['Art Director', 'Graphic Designer', 'Photographer'],
    deliverables: ['1 Art Direction Guideline PDF containing Art Direction, Font direction, Camera direction and Lighting direction'],
    turnaround: '14–28 days after brief', revisions: '2 revisions that differ from the original brief',
    addOns: [{ label: 'Additional revision', price: 2000, unit: 'revision' }],
    notes: ['Provide 2–4 initial options before developing the selected final direction.'],
  },
  {
    id: 'art-identity', category: 'art-direction', number: '02', title: 'Corporate Identity & Logo',
    shortDescription: 'Corporate identity and visual identity development',
    startingPrice: 50000, priceType: 'project', duration: 'Project', vatExcluded: true,
    pricingOptions: [], team: ['Art Director', 'Graphic Designer'], deliverables: ['CI Guideline', 'PDF format'],
    turnaround: '14–28 days after brief', revisions: '2 revisions that differ from the original brief',
    addOns: [{ label: 'Additional revision', price: 2000, unit: 'revision' }],
    notes: ['Provide 2–4 initial options before developing the selected final option.'],
  },
  {
    id: 'content-week', category: 'content', number: '01', title: '1 Week Content Plan',
    shortDescription: 'Short-term content planning for social media',
    startingPrice: 1500, priceType: 'project', duration: '1 Week Plan', pricingOptions: [], team: ['Content Creator'],
    deliverables: ['3–5 Content Ideas', 'Script and/or Caption', '1 Week Content Plan', 'Delivered as Google Sheet ready for further use'],
    turnaround: '1–3 days after brief', revisions: '2 revisions that differ from the original brief',
    addOns: [{ label: 'Additional revision', price: 1000, unit: 'revision' }], notes: [],
  },
  {
    id: 'content-month', category: 'content', number: '02', title: '1 Month Content Plan',
    shortDescription: 'Monthly content planning for brands',
    startingPrice: 5000, priceType: 'project', duration: '1 Month Plan', pricingOptions: [], team: ['Content Creator'],
    deliverables: ['12–16 Content Ideas', 'Script and/or Caption', '1 Month Content Plan', 'Delivered as Google Sheet ready for further use'],
    turnaround: '3–7 days after brief', revisions: '2 revisions that differ from the original brief',
    addOns: [{ label: 'Additional revision', price: 1000, unit: 'revision' }], notes: [],
  },
  {
    id: 'consulting-private', category: 'consulting', number: '01', title: 'Private Production Consulting',
    shortDescription: 'Private production consultation for in-house brand teams',
    startingPrice: 3900, priceType: 'session', duration: '2–3 Hours', pricingOptions: [], team: [], topics: consultingTopics,
    deliverables: ['Starting plan for product photography and video', 'Advanced editing workflow and techniques', 'Product-specific color grading techniques', 'Lighting setup based on visual references', 'Professional graphic production and file-management workflow', 'Basic motion graphic workflow for offline moving media'],
    addOns: [], notes: ['Location: Firefly Office', 'Participants: 1–3 people', 'Questions can be continued through a Group LINE after the consulting session.'],
  },
  {
    id: 'consulting-onsite', category: 'consulting', number: '02', title: 'Office Visit & On-site Consulting',
    shortDescription: 'On-site production consultation for in-house teams',
    startingPrice: 12000, priceType: 'from', duration: '5 Hours',
    pricingOptions: [{ label: 'Bangkok', price: 12000 }, { label: 'Outside Bangkok', price: 15000 }],
    team: [], topics: consultingTopics,
    deliverables: ['Review actual photo and video shooting location', 'Recommend location setup', 'Workflow shortcuts and production techniques', 'Hands-on Vector Scope workflow for Color Grading', 'Lighting techniques using limited equipment', 'In-house graphic workflow and editable file management', 'Motion Loop techniques using expressions for menu boards'],
    addOns: [], notes: [],
  },
];
