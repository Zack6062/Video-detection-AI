
export const SHOPPING_PLATFORMS = [
  {
    name: 'Amazon',
    baseUrl: 'https://www.amazon.in/s?k=',
    color: 'bg-yellow-600 hover:bg-yellow-700',
  },
  {
    name: 'Flipkart',
    baseUrl: 'https://www.flipkart.com/search?q=',
    color: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    name: 'Myntra',
    baseUrl: 'https://www.myntra.com/',
    color: 'bg-pink-600 hover:bg-pink-700',
    transform: (brand: string, name: string) => `${brand}-${name}`.toLowerCase().replace(/\s+/g, '-')
  },
  {
    name: 'Ajio',
    baseUrl: 'https://www.ajio.com/search/?text=',
    color: 'bg-gray-700 hover:bg-gray-800',
  },
  {
    name: 'Meesho',
    baseUrl: 'https://www.meesho.com/search?q=',
    color: 'bg-purple-600 hover:bg-purple-700',
  }
];

export const CATEGORIES_TO_DETECT = [
  'electronics', 'clothes', 'shoes', 'furniture', 'accessories', 'gadgets', 'vehicles', 'watches', 'handbags'
];

export const SYSTEM_PROMPT = `You are an expert AI product scout. Analyze the provided image frame and detect non-living commercial objects.
EXCLUDE: humans, faces, animals, birds.
DETECT: ${CATEGORIES_TO_DETECT.join(', ')}.
For each object, provide:
- name: Specific product name
- brand: Detect logos or text to identify the brand
- confidence: 0-1
- boundingBox: [ymin, xmin, ymax, xmax] normalized 0-1000

Return ONLY a valid JSON array of objects.`;
