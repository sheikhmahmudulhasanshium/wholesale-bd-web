import {
  Facebook,
  Twitter,
  Instagram,
  Globe,
  LayoutGrid,
  Filter,
  MapPin,
  BadgePercent,
  Megaphone,
  Laptop,
  Shirt,
  Sofa,
  Carrot,
  HeartPulse,
  Bike,
  Baby,
  Car,
  AppWindow,
  // --- Icons for the improved zones ---
  Briefcase,
  Gift,
  Plane,
  type LucideIcon,
} from "lucide-react";

// --- INTERFACES & TYPES ---

export type Language = "en" | "bn";

// For Category Dropdown
export interface SubMenuItem {
  name: { en: string; bn: string };
  href: string;
  icon: LucideIcon;
}

// For the Main Navigation Bar
export interface MainNavLink {
  name: { en: string; bn: string };
  href?: string; // Optional for non-link items like the zone selector
  icon: LucideIcon;
  subMenu?: SubMenuItem[];
  type?: "link" | "zoneSelector"; // Differentiates item functionality
}

// For the Zone Selector Dropdown
export interface ZoneOption {
  id: string;
  name: { en: string; bn: string };
  icon?: LucideIcon; // Added optional icon for better UI
}

export interface ZoneGroup {
  title: { en: string; bn: string };
  options: ZoneOption[];
}

// For the Footer Description
export interface DescriptionDetails {
  tagline: string;
  short: string;
  medium: string;
  long: string;
  keywords: string[];
}

// --- NAVIGATION & ZONE DATA ---

export const mainNavLinks: MainNavLink[] = [
  {
    name: { en: "Categories", bn: "ক্যাটাগরি" },
    icon: LayoutGrid,
    type: "link",
    subMenu: [
      {
        name: { en: "Electronics", bn: "ইলেকট্রনিক্স" },
        href: "/products/category/electronics",
        icon: Laptop,
      },
      {
        name: { en: "Fashion & Apparel", bn: "ফ্যাশন ও পোশাক" },
        href: "/products/category/fashion",
        icon: Shirt,
      },
      {
        name: { en: "Home & Living", bn: "হোম ও লিভিং" },
        href: "/products/category/home-living",
        icon: Sofa,
      },
      {
        name: { en: "Groceries & Essentials", bn: "মুদি ও নিত্যপ্রয়োজনীয়" },
        href: "/products/category/groceries",
        icon: Carrot,
      },
      {
        name: { en: "Health & Beauty", bn: "স্বাস্থ্য ও সৌন্দর্য" },
        href: "/products/category/health-beauty",
        icon: HeartPulse,
      },
      {
        name: { en: "Sports & Outdoors", bn: "খেলাধুলা ও আউটডোর" },
        href: "/products/category/sports-outdoors",
        icon: Bike,
      },
      {
        name: { en: "Toys, Kids & Babies", bn: "খেলনা ও শিশু সামগ্রী" },
        href: "/products/category/toys-kids-babies",
        icon: Baby,
      },
      {
        name: { en: "Automotive", bn: "অটোমোটিভ" },
        href: "/products/category/automotive",
        icon: Car,
      },
      {
        name: { en: "See All Categories", bn: "সব ক্যাটাগরি দেখুন" },
        href: "/categories",
        icon: AppWindow,
      },
    ],
  },
  {
    name: { en: "Select Zone", bn: "জোন নির্বাচন" },
    icon: MapPin,
    type: "zoneSelector",
  },
  {
    name: { en: "All Products", bn: "সকল পণ্য" },
    href: "/products",
    icon: Filter,
    type: "link",
  },
  {
    name: { en: "Flash Sale", bn: "ফ্ল্যাশ সেল" },
    href: "/offers",
    icon: BadgePercent,
    type: "link",
  },
  {
    name: { en: "Campaigns", bn: "ক্যাম্পেইন" },
    href: "/announcements",
    icon: Megaphone,
    type: "link",
  },
];

export const zoneGroups: ZoneGroup[] = [
  {
    title: { en: "Local Divisions", bn: "স্থানীয় বিভাগ" },
    options: [
      { id: "dha", name: { en: "Dhaka", bn: "ঢাকা" } },
      { id: "ctg", name: { en: "Chattogram", bn: "চট্টগ্রাম" } },
      { id: "khu", name: { en: "Khulna", bn: "খুলনা" } },
      { id: "syl", name: { en: "Sylhet", bn: "সিলেট" } },
      { id: "raj", name: { en: "Rajshahi", bn: "রাজশাহী" } },
      { id: "bar", name: { en: "Barishal", bn: "বরিশাল" } },
      { id: "ran", name: { en: "Rangpur", bn: "রংপুর" } },
      { id: "mym", name: { en: "Mymensingh", bn: "ময়মনসিংহ" } },
    ],
  },
  {
    title: { en: "Corporate & Global", bn: "কর্পোরেট ও গ্লোবাল" },
    options: [
      {
        id: "corp",
        name: { en: "Corporate Purchasing", bn: "কর্পোরেট কেনাকাটা" },
        icon: Briefcase,
      },
      {
        id: "intl",
        name: { en: "International Shipping", bn: "আন্তর্জাতিক শিপিং" },
        icon: Plane,
      },
      {
        id: "gift",
        name: { en: "Send a Gift (BD)", bn: "উপহার পাঠান (বিডি)" },
        icon: Gift,
      },
    ],
  },
];

// --- FOOTER & SOCIALS DATA ---

export const sociallinks = [
  {
    name: "Facebook",
    link: "https://www.facebook.com/wholesalebd",
    icon: Facebook,
  },
  {
    name: "Twitter (X)",
    link: "https://twitter.com/wholesalebd",
    icon: Twitter,
  },
  {
    name: "Instagram",
    link: "https://www.instagram.com/wholesalebd",
    icon: Instagram,
  },
  {
    name: "Official Website",
    link: "https://wholesale-bd-web.vercel.app/",
    icon: Globe,
  },
];

export const footerlinks = [
  {
    bangla: [
      { name: "আমাদের সম্পর্কে", shortname: "পরিচিতি", link: "/about" },
      { name: "যোগাযোগ", shortname: "যোগাযোগ", link: "/contact" },
      { name: "গোপনীয়তা নীতি", shortname: "গোপনীয়তা", link: "/privacy" },
      { name: "শর্তাবলি ও বিধিনিষেধ", shortname: "শর্তাবলি", link: "/terms" },
      { name: "প্রশ্নোত্তর", shortname: "জিজ্ঞাসা", link: "/faq" },
      { name: "সহায়তা কেন্দ্র", shortname: "সহায়তা", link: "/help" },
    ],
  },
  {
    english: [
      { name: "About Us", shortname: "About", link: "/about" },
      { name: "Contact", shortname: "Contact", link: "/contact" },
      { name: "Privacy Policy", shortname: "Privacy", link: "/privacy" },
      { name: "Terms & Conditions", shortname: "Terms", link: "/terms" },
      { name: "FAQs", shortname: "FAQ", link: "/faq" },
      { name: "Help Center", shortname: "Help", link: "/help" },
    ],
  },
];

export const footerDescriptions: Record<Language, DescriptionDetails> = {
  en: {
    tagline: "By Your Side, with Honesty.",
    short:
      "Transparent, affordable, and easy e-commerce for startups and retailers.",
    medium:
      "Wholesale BD offers a fair, user-friendly platform to buy, sell, order, and deliver with no hidden charges, ideal for startups and retailers.",
    long: `Welcome to Wholesale BD — your transparent, affordable, and easy-to-use e-commerce platform designed to simplify buying, selling, ordering, and delivery. Unlike larger marketplaces such as Amazon or Daraz, Wholesale BD focuses on providing organic results without hidden charges, making it a trusted place for startups, small businesses, and retailers to grow.

We believe that e-commerce should be fair and straightforward. That’s why our platform guarantees no hidden fees — what you see is what you pay. Whether you are buying in bulk or selling your products, Wholesale BD offers an accessible, user-friendly experience that allows you to manage your orders seamlessly from start to finish.

Our platform empowers sellers and buyers alike. Retailers find an ideal dreamland here where they can showcase their products directly to their target audience without expensive advertising costs. For startups and small businesses, Wholesale BD acts as a launching pad to grow their presence in the digital marketplace with ease.

From placing an order to fast, reliable delivery, we prioritize your convenience. Our logistics system ensures your products reach you on time, every time. Plus, we focus on organic, relevant search results so you can discover the best products tailored to your needs, without getting lost in overwhelming options.

Join Wholesale BD today and experience the difference — a transparent, affordable, and hassle-free e-commerce journey where buyers and sellers thrive together.`,
    keywords: [
      "transparency",
      "affordable",
      "easy",
      "ecommerce",
      "buy",
      "sell",
      "order",
      "delivery",
      "no hidden charge",
      "organic result",
      "startups",
      "retailers",
      "dreamland",
    ],
  },

  bn: {
    tagline: "সততার সাথে আপনার পাশে।",
    short:
      "স্বচ্ছ, সাশ্রয়ী এবং সহজ ই-কমার্স স্টার্টআপ ও খুচরা বিক্রেতাদের জন্য।",
    medium:
      "হোলসেল বিডি একটি নিরপেক্ষ, ব্যবহারবান্ধব প্ল্যাটফর্ম যা কেনাকাটা, বিক্রয়, অর্ডার এবং ডেলিভারি সহজ করে তোলে, স্টার্টআপ ও খুচরা বিক্রেতাদের জন্য আদর্শ।",
    long: `হোলসেল বিডি-তে আপনাকে স্বাগতম — এটি একটি স্বচ্ছ, সাশ্রয়ী এবং সহজ ব্যবহারযোগ্য ই-কমার্স প্ল্যাটফর্ম যা কেনাকাটা, বিক্রয়, অর্ডার এবং ডেলিভারি প্রক্রিয়াকে সহজ করে তোলে। অ্যামাজন বা দারাজের মতো বড় বাজারের তুলনায় হোলসেল বিডি জৈবিক ফলাফল প্রদান করে এবং কোনো লুকানো খরচ নেই, যা স্টার্টআপ, ক্ষুদ্র ব্যবসায়ী ও খুচরা বিক্রেতাদের জন্য একটি বিশ্বাসযোগ্য স্থান।

আমাদের বিশ্বাস ই-কমার্স হওয়া উচিত নিরপেক্ষ ও সহজবোধ্য। তাই আমরা কোনো গোপন ফি নেই — যা দেখছেন তা আপনি দিবেন। আপনি হয়তো পাইকারি ক্রেতা বা বিক্রেতা হোন, হোলসেল বিডি-এ একটি ব্যবহারবান্ধব প্ল্যাটফর্ম পাবেন যেখানে অর্ডার পরিচালনা করা সহজ।

এই প্ল্যাটফর্ম বিক্রেতা ও ক্রেতা উভয়ের জন্য সুযোগ সৃষ্টি করে। খুচরা বিক্রেতারা এখানে তাদের পণ্য প্রদর্শনের মাধ্যমে লক্ষ্যমাত্রা গ্রাহকের কাছে পৌঁছাতে পারেন, বড় বিজ্ঞাপনের খরচ ছাড়াই। স্টার্টআপ ও ক্ষুদ্র ব্যবসায়ীদের জন্য এটি একটি সুরক্ষিত প্ল্যাটফর্ম যেখানে ডিজিটাল মার্কেটপ্লেসে সহজেই প্রবেশ করা যায়।

অর্ডার দেওয়া থেকে দ্রুত ও নির্ভরযোগ্য ডেলিভারি পর্যন্ত, আমরা আপনার সুবিধাকে সর্বোচ্চ গুরুত্ব দেই। আমাদের লজিস্টিক সিস্টেম নিশ্চিত করে পণ্য নির্ধারিত সময়ে পৌঁছাবে। এছাড়া, আমরা জৈবিক এবং প্রাসঙ্গিক সার্চ ফলাফল প্রদানে মনোযোগী, যাতে আপনি আপনার প্রয়োজনীয় পণ্য সহজে খুঁজে পান।

আজই হোলসেল বিডি-তে যোগ দিন এবং স্বচ্ছ, সাশ্রয়ী এবং ঝামেলা মুক্ত ই-কমার্স যাত্রার অভিজ্ঞতা নিন, যেখানে ক্রেতা ও বিক্রেতা একসাথে বিকশিত হয়।`,
    keywords: [
      "স্বচ্ছতা",
      "সাশ্রয়ী",
      "সহজ",
      "ই-কমার্স",
      "কেনাকাটা",
      "বিক্রি",
      "অর্ডার",
      "ডেলিভারি",
      "লুকানো খরচ নেই",
      "জৈব ফলাফল",
      "স্টার্টআপ",
      "খুচরা বিক্রেতা",
      "স্বপ্নের জায়গা",
    ],
  },
};