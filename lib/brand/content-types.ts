// Connected Content Types

export interface ContentType {
  id: string;
  label: string;
  purpose: string;
  format: string;
  frequency: string;
  platforms: string[];
  visualNotes: string;
}

export const contentTypes: ContentType[] = [
  {
    id: 'educational-carousel',
    label: 'Educational Carousel',
    purpose: 'Inform/Teach',
    format: 'Multi-slide',
    frequency: '2-3x/week',
    platforms: ['Instagram', 'LinkedIn', 'Facebook'],
    visualNotes: 'Bold headline cover, one point per slide, swipe CTA, logo prominent on final slide.',
  },
  {
    id: 'benefits-value-props',
    label: 'Benefits/Value Props',
    purpose: 'Persuade',
    format: 'Grid/List',
    frequency: '1-2x/week',
    platforms: ['Instagram', 'LinkedIn', 'Facebook', 'Job boards'],
    visualNotes: 'Icon grids (2x3 or 3x2), checkmark bullets, illustrated icons, blue background.',
  },
  {
    id: 'job-spotlight',
    label: 'Job Opportunity Spotlight',
    purpose: 'Convert',
    format: 'Single/Video',
    frequency: 'As needed',
    platforms: ['Instagram', 'LinkedIn', 'Indeed', 'Facebook Jobs'],
    visualNotes: 'Phone mockup or bold statement, job title prominent, 3-4 key benefits, Apply CTA.',
  },
  {
    id: 'weekly-hot-jobs',
    label: 'Weekly Hot Jobs',
    purpose: 'Convert',
    format: 'Single/Carousel',
    frequency: 'Weekly',
    platforms: ['Instagram', 'LinkedIn', 'Facebook'],
    visualNotes: 'Ranked list format, fire/heat elements, blue or gradient background, warm accents.',
  },
  {
    id: 'motivational',
    label: 'Motivational/Mindset',
    purpose: 'Engage',
    format: 'Single image',
    frequency: '2-3x/week',
    platforms: ['Instagram', 'LinkedIn', 'Facebook'],
    visualNotes: 'Comparison layouts, chart illustrations, bold central message, pastel or blue backgrounds.',
  },
  {
    id: 'engagement',
    label: 'Engagement/Interactive',
    purpose: 'Interact',
    format: 'Poll-style',
    frequency: '1-2x/week',
    platforms: ['Instagram Stories', 'LinkedIn polls', 'Facebook'],
    visualNotes: 'Toggle switches, this-or-that layouts, blue with flowing shapes, UI elements.',
  },
  {
    id: 'quiz-game',
    label: 'Quiz/Game Content',
    purpose: 'Entertain',
    format: 'Video',
    frequency: '1x/week',
    platforms: ['Instagram Reels', 'TikTok', 'Facebook Reels', 'YouTube Shorts'],
    visualNotes: 'Animated text, timers, countdown elements, celebration animations.',
  },
  {
    id: 'recruitment-cta',
    label: 'Recruitment CTA',
    purpose: 'Convert',
    format: 'Single/Closer',
    frequency: 'Ongoing',
    platforms: ['All platforms'],
    visualNotes: 'Bold action headline, clear next step, contact info, urgent but professional.',
  },
  {
    id: 'current-events',
    label: 'Current Events/Holidays',
    purpose: 'Relevance',
    format: 'Single/Carousel',
    frequency: 'Calendar-based',
    platforms: ['Instagram', 'LinkedIn', 'Facebook'],
    visualNotes: 'Theme-appropriate colors, role photos, appreciation messaging, tie to Connected opportunities.',
  },
];

export const getContentType = (id: string): ContentType | undefined =>
  contentTypes.find(ct => ct.id === id);

// Keywords that help detect content types from user descriptions
export const contentTypeKeywords: Record<string, string[]> = {
  'educational-carousel': ['teach', 'explain', 'how to', 'steps', 'guide', 'learn', 'tips', 'carousel', 'swipe'],
  'benefits-value-props': ['benefits', 'perks', 'why', 'value', 'offer', 'what we provide'],
  'job-spotlight': ['job', 'position', 'role', 'hiring', 'opportunity', 'contract', 'opening'],
  'weekly-hot-jobs': ['hot jobs', 'this week', 'top jobs', 'featured positions', 'weekly'],
  'motivational': ['motivation', 'inspire', 'quote', 'mindset', 'growth', 'monday motivation'],
  'engagement': ['poll', 'question', 'interactive', 'vote', 'this or that', 'what do you'],
  'quiz-game': ['quiz', 'game', 'trivia', 'guess', 'challenge', 'test your'],
  'recruitment-cta': ['apply', 'connect', 'reach out', 'call to action', 'join us'],
  'current-events': ['holiday', 'awareness', 'celebration', 'day', 'week', 'month', 'thank you'],
};
