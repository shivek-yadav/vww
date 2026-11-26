import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../data');
const dbFile = path.resolve(dataDir, 'local_db.json');

let store = null;
let initialized = false;

const initialCategories = [
  { _id: '671500000000000000000001', name: 'Signature Curries', slug: 'signature-curries', description: 'Slow-simmered royal classics', sortOrder: 0, published: true },
  { _id: '671500000000000000000002', name: 'Tandoor & Grills', slug: 'tandoor-grills', description: 'Flame-kissed favourites from the charcoal hearth', sortOrder: 1, published: true },
  { _id: '671500000000000000000003', name: 'Biryani & Rice', slug: 'biryani-rice', description: 'Fragrant basmati layered with royal spices', sortOrder: 2, published: true },
  { _id: '671500000000000000000004', name: 'Indian Breads', slug: 'indian-breads', description: 'Freshly baked breads from our earthen tandoor', sortOrder: 3, published: true },
  { _id: '671500000000000000000005', name: 'Starters & Chaat', slug: 'starters-chaat', description: 'Crisp, tangy and flavourful beginnings', sortOrder: 4, published: true },
  { _id: '671500000000000000000006', name: 'Desserts & Drinks', slug: 'desserts-drinks', description: 'A sweet and refreshing final note', sortOrder: 5, published: true }
];

const img = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

const initialMenu = [
  {
    _id: '671600000000000000000001',
    name: 'Royal Paneer Lababdar',
    slug: 'royal-paneer-lababdar',
    category: '671500000000000000000001',
    price: 349,
    description: 'Soft cottage cheese simmered in a velvety tomato-cashew gravy, finished with fresh churned cream.',
    image: img('photo-1631452180519-c014fe946bc7'),
    vegetarian: true,
    featured: true,
    popular: true,
    spicy: false,
    available: true,
    published: true,
    prepMinutes: 25
  },
  {
    _id: '671600000000000000000002',
    name: 'Dakshayani Butter Chicken',
    slug: 'dakshayani-butter-chicken',
    category: '671500000000000000000001',
    price: 429,
    description: 'Tender tandoori chicken folded into our famous smoky makhani sauce with aromatic fenugreek.',
    image: img('photo-1603894584373-5ac82b2ae398'),
    vegetarian: false,
    featured: true,
    popular: true,
    spicy: false,
    available: true,
    published: true,
    prepMinutes: 30
  },
  {
    _id: '671600000000000000000003',
    name: 'Dal Makhani Heritage',
    slug: 'dal-makhani-heritage',
    category: '671500000000000000000001',
    price: 299,
    description: 'Black lentils slow-cooked overnight with fresh white butter, mild spices and cream.',
    image: img('photo-1546833999-b9f581a1996d'),
    vegetarian: true,
    featured: true,
    popular: true,
    spicy: false,
    available: true,
    published: true,
    prepMinutes: 20
  },
  {
    _id: '671600000000000000000004',
    name: 'Kadhai Paneer Masala',
    slug: 'kadhai-paneer-masala',
    category: '671500000000000000000001',
    price: 329,
    description: 'Paneer, bell peppers and freshly crushed coriander seeds tossed in a fiery kadhai gravy.',
    image: img('photo-1631452180519-c014fe946bc7'),
    vegetarian: true,
    featured: false,
    popular: false,
    spicy: true,
    available: true,
    published: true,
    prepMinutes: 25
  },
  {
    _id: '671600000000000000000005',
    name: 'Tandoori Chicken Tikka',
    slug: 'tandoori-chicken-tikka',
    category: '671500000000000000000002',
    price: 389,
    description: 'Hung-curd marinated chicken charred over live coals, served with mint coriander chutney.',
    image: img('photo-1599487488170-d11ec9c172f0'),
    vegetarian: false,
    featured: true,
    popular: true,
    spicy: true,
    available: true,
    published: true,
    prepMinutes: 25
  },
  {
    _id: '671600000000000000000006',
    name: 'Malai Soya Chaap',
    slug: 'malai-soya-chaap',
    category: '671500000000000000000002',
    price: 319,
    description: 'Creamy, cardamom-infused soya morsels roasted with cheese and butter.',
    image: img('photo-1626777552726-4a6b54e52b27'),
    vegetarian: true,
    featured: false,
    popular: false,
    spicy: false,
    available: true,
    published: true,
    prepMinutes: 20
  },
  {
    _id: '671600000000000000000007',
    name: 'Hyderabadi Dum Biryani',
    slug: 'hyderabadi-dum-biryani',
    category: '671500000000000000000003',
    price: 399,
    description: 'Slow-sealed basmati rice layered with spiced marinated chicken, saffron milk and caramelised onions.',
    image: img('photo-1563379091339-03246963d96c'),
    vegetarian: false,
    featured: true,
    popular: true,
    spicy: true,
    available: true,
    published: true,
    prepMinutes: 35
  },
  {
    _id: '671600000000000000000008',
    name: 'Awadhi Vegetable Dum Biryani',
    slug: 'awadhi-vegetable-dum-biryani',
    category: '671500000000000000000003',
    price: 329,
    description: 'Fragrant basmati rice cooked on slow steam with royal vegetables, mint, kewra and saffron.',
    image: img('photo-1563379091339-03246963d96c'),
    vegetarian: true,
    featured: false,
    popular: true,
    spicy: false,
    available: true,
    published: true,
    prepMinutes: 30
  },
  {
    _id: '671600000000000000000009',
    name: 'Garlic Butter Naan',
    slug: 'garlic-butter-naan',
    category: '671500000000000000000004',
    price: 89,
    description: 'Fresh leavened tandoor bread infused with garlic, chopped cilantro and melted butter.',
    image: img('photo-1610057099431-d73a1c9d2f2f'),
    vegetarian: true,
    featured: false,
    popular: true,
    spicy: false,
    available: true,
    published: true,
    prepMinutes: 10
  },
  {
    _id: '671600000000000000000010',
    name: 'Amritsari Stuffed Kulcha',
    slug: 'amritsari-stuffed-kulcha',
    category: '671500000000000000000004',
    price: 119,
    description: 'Crisp layered tandoori bread stuffed with spiced potatoes, onions and pomegranate seeds.',
    image: img('photo-1626777552726-4a6b54e52b27'),
    vegetarian: true,
    featured: false,
    popular: false,
    spicy: false,
    available: true,
    published: true,
    prepMinutes: 15
  },
  {
    _id: '671600000000000000000011',
    name: 'Dahi Ke Kebab',
    slug: 'dahi-ke-kebab',
    category: '671500000000000000000005',
    price: 279,
    description: 'Velvety hung curd patties spiced with green chillies and roasted cumin, fried crisp and golden.',
    image: img('photo-1546833999-b9f581a1996d'),
    vegetarian: true,
    featured: false,
    popular: true,
    spicy: false,
    available: true,
    published: true,
    prepMinutes: 20
  },
  {
    _id: '671600000000000000000012',
    name: 'Palak Patta Chaat',
    slug: 'palak-patta-chaat',
    category: '671500000000000000000005',
    price: 249,
    description: 'Crispy gram-flour battered spinach leaves drizzled with sweet tamarind, cool yogurt and pomegranate.',
    image: img('photo-1601050690597-df0568f70950'),
    vegetarian: true,
    featured: false,
    popular: true,
    spicy: false,
    available: true,
    published: true,
    prepMinutes: 15
  },
  {
    _id: '671600000000000000000013',
    name: 'Gulab Jamun Shahi',
    slug: 'gulab-jamun-shahi',
    category: '671500000000000000000006',
    price: 149,
    description: 'Warm khoya dumplings steeped in rose cardamom syrup, garnished with toasted pistachios.',
    image: img('photo-1601303516534-bf0b8650a0bc'),
    vegetarian: true,
    featured: false,
    popular: true,
    spicy: false,
    available: true,
    published: true,
    prepMinutes: 10
  },
  {
    _id: '671600000000000000000014',
    name: 'Kesariya Phirni',
    slug: 'kesariya-phirni',
    category: '671500000000000000000006',
    price: 169,
    description: 'Slow-ground Kashmiri rice pudding scented with saffron, cardamom and silver leaf.',
    image: img('photo-1666190094768-9ca57d82a59b'),
    vegetarian: true,
    featured: false,
    popular: false,
    spicy: false,
    available: true,
    published: true,
    prepMinutes: 10
  },
  {
    _id: '671600000000000000000015',
    name: 'Royal Mango Lassi',
    slug: 'royal-mango-lassi',
    category: '671500000000000000000006',
    price: 139,
    description: 'Thick churned sweet yogurt blended with Alphonso mango pulp and crushed green cardamom.',
    image: img('photo-1571006685759-4e238aac18c3'),
    vegetarian: true,
    featured: false,
    popular: true,
    spicy: false,
    available: true,
    published: true,
    prepMinutes: 5
  }
];

const initialGallery = [
  { _id: '671700000000000000000001', title: 'The Royal Dining Room', category: 'Ambience', url: img('photo-1517248135467-4c7edcad34c4', 1200), sortOrder: 0, published: true },
  { _id: '671700000000000000000002', title: 'An Evening at Dakshayani', category: 'Ambience', url: img('photo-1552566626-52f8b828add9', 1200), sortOrder: 1, published: true },
  { _id: '671700000000000000000003', title: 'A Feast Worth Sharing', category: 'Food', url: img('photo-1504674900247-0877df9cc836', 1200), sortOrder: 2, published: true },
  { _id: '671700000000000000000004', title: 'Straight from the Kitchen', category: 'Food', url: img('photo-1546833999-b9f581a1996d', 1200), sortOrder: 3, published: true },
  { _id: '671700000000000000000005', title: 'Heritage Recipes', category: 'Food', url: img('photo-1631452180519-c014fe946bc7', 1200), sortOrder: 4, published: true },
  { _id: '671700000000000000000006', title: 'Intimate Candlelit Tables', category: 'Ambience', url: img('photo-1414235077428-338989a2e8c0', 1200), sortOrder: 5, published: true }
];

const initialFaqs = [
  { _id: '671800000000000000000001', question: 'Do I need a reservation to dine in?', answer: 'Walk-ins are warmly welcome, but we recommend reserving a table for weekends, festivals, and special celebrations.', sortOrder: 0, published: true },
  { _id: '671800000000000000000002', question: 'Do you offer pure vegetarian and Jain options?', answer: 'Yes! Over 60% of our menu is vegetarian, prepared in dedicated cookware, with several Jain and vegan options available upon request.', sortOrder: 1, published: true },
  { _id: '671800000000000000000003', question: 'Can I order food for home delivery?', answer: 'Yes! You can browse our full menu online, add dishes to your cart, and enjoy doorstep delivery with live status tracking.', sortOrder: 2, published: true },
  { _id: '671800000000000000000004', question: 'How do I apply a discount coupon code?', answer: 'Enter your promo code (such as ROYAL10) at checkout to receive instant savings on your order.', sortOrder: 3, published: true },
  { _id: '671800000000000000000005', question: 'How are table reservations confirmed?', answer: 'Once you submit a reservation request, our hospitality team reviews and confirms it. You will see the live confirmation status in your customer account.', sortOrder: 4, published: true }
];

const initialTestimonials = [
  { _id: '671900000000000000000001', name: 'Aarav Sharma', quote: 'The food was absolutely extraordinary. Every dish tasted like a celebration, and the Dal Makhani is the finest in the city.', rating: 5, published: true },
  { _id: '671900000000000000000002', name: 'Meera Kapoor', quote: 'Such a majestic space for family dinners. The butter chicken and tandoori kulchas are legendary! Exceptional hospitality.', rating: 5, published: true },
  { _id: '671900000000000000000003', name: 'Riya Malhotra', quote: 'A flawless balance of royal heritage recipes and modern gourmet elegance. Online ordering and prompt delivery made our weekend feast unforgettable.', rating: 5, published: true }
];

const initialPages = [
  {
    _id: '671a00000000000000000001',
    slug: 'home',
    title: 'A little tradition.',
    subtitle: 'A lot of love.',
    description: 'Gather around for soulful Indian flavours, unforgettable evenings and hospitality that feels like home.',
    heroImage: img('photo-1517248135467-4c7edcad34c4', 1800),
    published: true
  },
  {
    _id: '671a00000000000000000002',
    slug: 'about',
    title: 'Our story, served with love',
    subtitle: 'THE HEART BEHIND DAKSHAYANI',
    description: 'We bring people together through soulful Indian cuisine, treasured recipes, and genuine warmth across generations.',
    heroImage: img('photo-1414235077428-338989a2e8c0', 1600),
    published: true
  },
  {
    _id: '671a00000000000000000003',
    slug: 'menu',
    title: 'Our Menu',
    subtitle: 'EXPLORE OUR CULINARY CREATIONS',
    description: 'From comforting family classics to handcrafted royal surprises. Discover your next favourite dish.',
    heroImage: img('photo-1504674900247-0877df9cc836', 1600),
    published: true
  }
];

const initialOpeningHours = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
].map(day => ({ day, open: '11:00', close: '23:00', closed: false }));

const initialSettings = {
  _id: '671b00000000000000000001',
  key: 'primary',
  restaurantName: 'Dakshayani',
  tagline: 'The Art of Indian Dining',
  phone: '+91 98765 43210',
  email: 'hello@dakshayani.example',
  address: 'Grand Heritage Avenue, Connaught Place, New Delhi, India',
  city: 'New Delhi',
  mapUrl: 'https://maps.google.com',
  instagram: 'https://instagram.com/dakshayani',
  facebook: 'https://facebook.com/dakshayani',
  openingHours: initialOpeningHours,
  bookingEnabled: true,
  orderingEnabled: true,
  deliveryEnabled: true,
  deliveryFee: 50,
  freeDeliveryThreshold: 799,
  taxPercentage: 5,
  currencySymbol: '₹',
  announcement: '✦ Grand Festive Offer: Get 10% off with coupon ROYAL10 ✦ Free delivery on orders above ₹799 ✦',
  announcementEnabled: true,
  promoCode: 'ROYAL10',
  promoDiscount: 10,
  heroTitle: 'Where Heritage Meets Royal Flavours',
  heroSubtitle: 'An authentic fine dining and gourmet delivery experience crafted with timeless passion',
  heroBadge: 'ESTD. 1998 · AWARD-WINNING ROYAL INDIAN CUISINE',
  heroImage: img('photo-1517248135467-4c7edcad34c4', 1800),
  reservationMaxGuests: 12,
  minReservationLeadHours: 2
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function saveLocalDb() {
  try {
    ensureDir(dataDir);
    fs.writeFileSync(dbFile, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save local db:', err.message);
  }
}

export async function initFallbackStore() {
  if (initialized && store) return store;

  ensureDir(dataDir);
  if (fs.existsSync(dbFile)) {
    try {
      const content = fs.readFileSync(dbFile, 'utf-8');
      store = JSON.parse(content);
      initialized = true;
      return store;
    } catch {
      // Corrupt or empty file, will reseed
    }
  }

  // Generate initial password hashes
  const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Shibek@18312716!', 12);
  const custHash = await bcrypt.hash('Customer@123$test', 12);

  store = {
    User: [
      {
        _id: '671400000000000000000001',
        name: 'Shivek Yadav',
        email: (process.env.ADMIN_EMAIL || 'shivekyadav82@gmail.com').toLowerCase(),
        passwordHash: adminHash,
        role: 'admin',
        status: 'active',
        sessionVersion: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '671400000000000000000002',
        name: 'Priya Sharma',
        email: 'customer@dakshayani.com',
        phone: '+91 98765 43210',
        passwordHash: custHash,
        role: 'customer',
        status: 'active',
        sessionVersion: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    Category: initialCategories.map(c => ({ ...c, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })),
    MenuItem: initialMenu.map(m => ({ ...m, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })),
    GalleryImage: initialGallery.map(g => ({ ...g, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })),
    FAQ: initialFaqs.map(f => ({ ...f, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })),
    Testimonial: initialTestimonials.map(t => ({ ...t, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })),
    PageContent: initialPages.map(p => ({ ...p, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })),
    SiteSettings: [{ ...initialSettings, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
    Order: [],
    Booking: [],
    Inquiry: [],
    ActivityLog: []
  };

  saveLocalDb();
  initialized = true;
  return store;
}

function matches(item, query) {
  if (!query || Object.keys(query).length === 0) return true;
  for (const [key, value] of Object.entries(query)) {
    if (key === '$or' && Array.isArray(value)) {
      if (!value.some(sub => matches(item, sub))) return false;
      continue;
    }
    const itemVal = item[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if ('$in' in value) {
        const arr = value.$in.map(String);
        if (!arr.includes(String(itemVal))) return false;
      }
      if ('$nin' in value) {
        const arr = value.$nin.map(String);
        if (arr.includes(String(itemVal))) return false;
      }
      if ('$gt' in value || '$gte' in value || '$lt' in value || '$lte' in value) {
        const compare = (a, b) => {
          if (a instanceof Date || b instanceof Date || (typeof a === 'string' && a.includes('T')) || (typeof b === 'string' && b.includes('T'))) {
            const tA = new Date(a).getTime();
            const tB = new Date(b).getTime();
            if (!isNaN(tA) && !isNaN(tB)) return tA - tB;
          }
          if (typeof a === 'number' && typeof b === 'number') return a - b;
          return a > b ? 1 : a < b ? -1 : 0;
        };
        if ('$gt' in value && !(compare(itemVal, value.$gt) > 0)) return false;
        if ('$gte' in value && !(compare(itemVal, value.$gte) >= 0)) return false;
        if ('$lt' in value && !(compare(itemVal, value.$lt) < 0)) return false;
        if ('$lte' in value && !(compare(itemVal, value.$lte) <= 0)) return false;
      }
      if ('$ne' in value) {
        if (String(itemVal) === String(value.$ne)) return false;
      }
      if ('$regex' in value) {
        const regex = new RegExp(value.$regex, value.$options || '');
        if (!regex.test(String(itemVal || ''))) return false;
      }
      continue;
    }
    if (String(itemVal) !== String(value)) {
      return false;
    }
  }
  return true;
}

function clone(obj) {
  if (!obj) return obj;
  return JSON.parse(JSON.stringify(obj));
}

function wrapDoc(modelName, raw) {
  if (!raw) return null;
  const doc = clone(raw);
  doc._id = String(doc._id);

  Object.defineProperty(doc, 'save', {
    enumerable: false,
    value: async function () {
      if (!store) await initFallbackStore();
      const col = store[modelName] || [];
      const idx = col.findIndex(x => String(x._id) === String(this._id));
      this.updatedAt = new Date().toISOString();
      const plain = { ...this };
      if (idx >= 0) {
        col[idx] = plain;
      } else {
        col.push(plain);
      }
      saveLocalDb();
      return this;
    }
  });

  Object.defineProperty(doc, 'toObject', {
    enumerable: false,
    value: function () {
      return clone(this);
    }
  });

  return doc;
}

class QueryChain {
  constructor(modelName, query = {}, isSingle = false) {
    this.modelName = modelName;
    this.query = query;
    this.isSingle = isSingle;
    this._sort = null;
    this._limit = null;
    this._populate = [];
    this._select = null;
    this._lean = false;
  }

  sort(s) {
    this._sort = s;
    return this;
  }

  limit(n) {
    this._limit = n;
    return this;
  }

  populate(field, select) {
    this._populate.push({ field, select });
    return this;
  }

  select(fields) {
    this._select = fields;
    return this;
  }

  lean() {
    this._lean = true;
    return this;
  }

  async exec() {
    if (!store) await initFallbackStore();
    const col = store[this.modelName] || [];
    let items = col.filter(item => matches(item, this.query));

    if (this._sort) {
      const keys = Object.entries(this._sort);
      items.sort((a, b) => {
        for (const [k, dir] of keys) {
          const va = a[k] ?? '';
          const vb = b[k] ?? '';
          if (va < vb) return dir === -1 ? 1 : -1;
          if (va > vb) return dir === -1 ? -1 : 1;
        }
        return 0;
      });
    }

    if (this._limit && this._limit > 0) {
      items = items.slice(0, this._limit);
    }

    // Populate relations
    for (const pop of this._populate) {
      if (pop.field === 'category') {
        const catMap = new Map((store.Category || []).map(c => [String(c._id), c]));
        items = items.map(item => {
          const cat = catMap.get(String(item.category));
          return { ...item, category: cat ? { _id: cat._id, name: cat.name, slug: cat.slug } : null };
        });
      } else if (pop.field === 'customer') {
        const userMap = new Map((store.User || []).map(u => [String(u._id), u]));
        items = items.map(item => {
          const cust = userMap.get(String(item.customer));
          return { ...item, customer: cust ? { _id: cust._id, name: cust.name, email: cust.email, phone: cust.phone } : null };
        });
      }
    }

    if (this.isSingle) {
      const first = items[0] || null;
      if (!first) return null;
      return this._lean ? clone(first) : wrapDoc(this.modelName, first);
    }

    return items.map(item => this._lean ? clone(item) : wrapDoc(this.modelName, item));
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }
}

export function getFallbackModel(modelName) {
  return {
    find(query = {}) {
      return new QueryChain(modelName, query, false);
    },

    findOne(query = {}) {
      return new QueryChain(modelName, query, true);
    },

    findById(id) {
      return new QueryChain(modelName, { _id: String(id) }, true);
    },

    async create(docOrDocs) {
      if (!store) await initFallbackStore();
      const col = store[modelName] || (store[modelName] = []);
      const isArray = Array.isArray(docOrDocs);
      const docs = isArray ? docOrDocs : [docOrDocs];
      const created = [];

      for (const d of docs) {
        const id = d._id ? String(d._id) : new mongoose.Types.ObjectId().toString();
        const doc = {
          ...d,
          _id: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        if (modelName === 'User') {
          doc.status = doc.status || 'active';
          doc.sessionVersion = doc.sessionVersion || 0;
        }
        if (modelName === 'Order') {
          doc.status = doc.status || 'placed';
          doc.paymentStatus = doc.paymentStatus || 'unpaid';
          doc.statusHistory = doc.statusHistory || [{ status: 'placed', at: new Date().toISOString(), by: 'customer' }];
        }
        if (modelName === 'MenuItem') {
          doc.available = doc.available !== false;
          doc.published = doc.published !== false;
        }
        col.push(doc);
        created.push(wrapDoc(modelName, doc));
      }

      saveLocalDb();
      return isArray ? created : created[0];
    },

    async findOneAndUpdate(query, update, options = {}) {
      if (!store) await initFallbackStore();
      const col = store[modelName] || (store[modelName] = []);
      let idx = col.findIndex(item => matches(item, query));
      let doc;

      if (idx >= 0) {
        doc = col[idx];
        const changes = update.$set || update;
        Object.assign(doc, changes, { updatedAt: new Date().toISOString() });
      } else if (options.upsert) {
        const initFields = update.$setOnInsert || {};
        const setFields = update.$set || {};
        doc = {
          _id: new mongoose.Types.ObjectId().toString(),
          ...query,
          ...initFields,
          ...setFields,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        col.push(doc);
      } else {
        return null;
      }

      saveLocalDb();
      return wrapDoc(modelName, doc);
    },

    async findByIdAndUpdate(id, update, options = {}) {
      return this.findOneAndUpdate({ _id: String(id) }, update, options);
    },

    async updateOne(query, update, options = {}) {
      const res = await this.findOneAndUpdate(query, update, options);
      return { modifiedCount: res ? 1 : 0, upsertedCount: res && options.upsert ? 1 : 0 };
    },

    async deleteOne(query) {
      if (!store) await initFallbackStore();
      const col = store[modelName] || [];
      const idx = col.findIndex(item => matches(item, query));
      if (idx >= 0) {
        col.splice(idx, 1);
        saveLocalDb();
        return { deletedCount: 1 };
      }
      return { deletedCount: 0 };
    },

    async findByIdAndDelete(id) {
      return this.deleteOne({ _id: String(id) });
    },

    async deleteMany(query) {
      if (!store) await initFallbackStore();
      const col = store[modelName] || [];
      const before = col.length;
      store[modelName] = col.filter(item => !matches(item, query));
      saveLocalDb();
      return { deletedCount: before - store[modelName].length };
    },

    async countDocuments(query = {}) {
      if (!store) await initFallbackStore();
      const col = store[modelName] || [];
      return col.filter(item => matches(item, query)).length;
    },

    async exists(query = {}) {
      if (!store) await initFallbackStore();
      const col = store[modelName] || [];
      const found = col.find(item => matches(item, query));
      return found ? { _id: found._id } : null;
    }
  };
}
