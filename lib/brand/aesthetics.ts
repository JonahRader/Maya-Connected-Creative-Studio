// Connected Aesthetic Styles

export interface Aesthetic {
  id: string;
  label: string;
  description: string;
  icon: string;
  characteristics: string[];
  colorApplication: string;
  bestFor: string[];
}

export const aesthetics: Aesthetic[] = [
  {
    id: 'colorful',
    label: 'Colorful',
    description: 'Vibrant, bold colors, high energy, eye-catching',
    icon: '🎨',
    characteristics: [
      'Bold use of the full brand palette',
      'Multiple colors in harmony',
      'Bright backgrounds (brand blue or gradient)',
      'High contrast between elements',
      'Dynamic layouts with playful icons',
    ],
    colorApplication: 'Background: #369AC4 (blue) or gradient. White text containers with colored accents.',
    bestFor: ['Engagement posts', 'Celebrations', 'Hiring announcements', 'Young demographics'],
  },
  {
    id: 'vintage',
    label: 'Vintage',
    description: 'Textured, layered, retro-modern with grain effects',
    icon: '📷',
    characteristics: [
      'Layered elements and textures',
      'Subtle grain or paper textures',
      'Muted, slightly desaturated brand colors',
      'Retro typography treatments',
      'Ripped paper edges, stamps, collage elements',
    ],
    colorApplication: 'Softer brand colors, cream instead of white, #061835 as anchor.',
    bestFor: ['Storytelling', 'Day in the life', 'Trust/experience messaging', 'Seasoned professionals'],
  },
  {
    id: 'modern',
    label: 'Modern',
    description: 'Clean lines, geometric, contemporary and sleek',
    icon: '✨',
    characteristics: [
      'Sharp, clean lines',
      'Geometric shapes and layouts',
      'Minimal texture (flat design)',
      'Bold typography with breathing room',
      'Asymmetric but balanced compositions',
    ],
    colorApplication: 'Clean color blocking, white space as element, 2-3 colors max.',
    bestFor: ['Professional job postings', 'Company announcements', 'LinkedIn content', 'B2B messaging'],
  },
  {
    id: 'professional',
    label: 'Professional',
    description: 'Polished, corporate-friendly, trustworthy',
    icon: '💼',
    characteristics: [
      'Conservative layouts with clear hierarchy',
      'Structured grids',
      'Formal but friendly tone',
      'Icons over illustrations',
      'Consistent, predictable patterns',
    ],
    colorApplication: '#061835 (navy) for authority, white backgrounds, gray for supporting text.',
    bestFor: ['Facility-facing content', 'Compliance/policy', 'Benefits info', 'Formal announcements'],
  },
  {
    id: 'minimalistic',
    label: 'Minimalistic',
    description: 'Whitespace, focused, simple and clean',
    icon: '◻️',
    characteristics: [
      'Maximum white/negative space',
      'Single focal point',
      'Very limited elements',
      'Typography-forward design',
      'No unnecessary decoration',
    ],
    colorApplication: 'White or light gray background, one accent color, black text.',
    bestFor: ['Quote posts', 'Simple announcements', 'Instagram stories', 'Bold statements'],
  },
];

export const getAesthetic = (id: string): Aesthetic | undefined =>
  aesthetics.find(a => a.id === id);
