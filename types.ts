export interface Episode {
  id: string;
  number: number;
  season: number;
  title: string;
  duration: string;
  telegramCode: string;          // ✅ Watch/Stream এর জন্য
  downloadCode?: string;         // ✅ Download এর জন্য (optional)
  downloadLink?: string;         // ✅ Alternative download link (optional)
  
  // ✅ Professional Metadata (No "size", "length" - only clean data)
  quality?: string;              // e.g., "1080p", "4K UHD", "720p BluRay"
  audioLanguage?: string;        // e.g., "Hindi DD+ 5.1", "English Atmos"
  subtitles?: string;            // e.g., "English, Hindi, Arabic"
  
  // ✅ Premium Features (Optional)
  thumbnail?: string;            // Episode specific thumbnail URL (16:9 ratio recommended)
  isComingSoon?: boolean;        // Coming Soon lock
  releaseDate?: string;          // Release date for coming soon
  isUpcoming?: boolean;          // Backward compatibility
}

export interface Movie {
  id: string;
  title: string;
  thumbnail: string;             // 16:9 ratio recommended for home banner
  category: string;
  telegramCode: string;          // ✅ Watch/Stream এর জন্য (Required)
  downloadCode?: string;         // ✅ Download এর জন্য (optional)
  downloadLink?: string;         // ✅ Alternative download link (optional)
  rating: number;
  views: string;
  year?: string;
  quality?: string;
  description?: string;
  episodes?: Episode[];
  isPremium?: boolean;
  createdAt?: any;
  
  // ✅ Professional Metadata (Clean, no "size", "length" etc)
  duration?: string;             // e.g., "2h 15m", "1h 45m"
  audioLanguage?: string;        // e.g., "Hindi Dual Audio + English DD+5.1"
  subtitles?: string;            // e.g., "English, Hindi, Arabic"
  videoQuality?: string;         // e.g., "4K HDR10+", "1080p BluRay REMUX"
  
  // ✅ Premium Image Features
  detailBanner?: string;         // 2:3 or 16:9 ratio for detail page (vertical works best)
  screenshots?: string[];        // 16:9 ratio images (4-8 recommended)
  
  // ✅ Season-Level Lock (NEW)
  lockedSeasons?: number[];      // Array of season numbers that are locked [1, 2, 3]
  seasonReleaseInfo?: {          // Release info per season
    [season: number]: {
      releaseDate?: string;
      comingSoonMessage?: string;
    };
  };
  
  // ✅ Upcoming content
  isUpcoming?: boolean;          // Coming soon badge
  releaseDate?: string;          // Release date for upcoming
  
  // Premium Features
  isFeatured?: boolean;        // Main Banner এ দেখাবে কিনা
  featuredOrder?: number;      // Banner এ কত নাম্বার পজিশনে
  isTop10?: boolean;           // Top 10 এ আছে কিনা
  top10Position?: number;      // Top 10 এ কত নাম্বার (1-10)
  storyImage?: string;         // Story Circle এ যে ছবি দেখাবে
  storyEnabled?: boolean;      // Story তে দেখাবে কিনা
  priority?: number;           // সাজানোর জন্য priority (higher = first)
  isExclusive?: boolean;       // ✅ Exclusive badge দেখাবে - category পরিবর্তন ছাড়াই
}

export interface StoryItem {
  id: string;
  image: string;              // Story circle এ যে image
  thumbnailUrl?: string;      // ভিতরে ক্লিক করলে যে বড় image
  movieId?: string;           // যদি কোনো movie এর সাথে linked থাকে
  link?: string;              // External link (optional)
  order: number;              // কত নাম্বারে দেখাবে
  createdAt?: any;
}

export interface BannerItem {
  id: string;
  movieId?: string;           // Movie এর সাথে connect
  title: string;
  image: string;              // Banner image
  description?: string;
  link?: string;              // External link (optional)
  order: number;              // Position
  isActive: boolean;
  createdAt?: any;
}

export interface AppSettings {
  botUsername: string;
  channelLink: string;          // Header Send বাটন + MovieDetails Telegram বাটন
  noticeChannelLink?: string;   // ✅ Notice REQ বাটনের জন্য আলাদা channel link
  noticeText?: string;          // Notice bar text
  noticeEnabled?: boolean;      // Notice দেখাবে কিনা
  autoViewIncrement?: boolean;
  categories?: string[];        // Custom categories যোগ করা যাবে
  
  // Premium Settings
  enableTop10?: boolean;
  enableStories?: boolean;
  enableBanners?: boolean;
  primaryColor?: string;        // Theme color
  appName?: string;             // App এর নাম
}

export type Category = 'Exclusive' | 'Korean Drama' | 'Series' | 'All' | 'Favorites' | string;
