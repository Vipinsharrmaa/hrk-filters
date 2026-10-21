export const siteConfig = {
  name: "HRK Filters",
  description: "High Performance Two-Wheeler Automotive Filtration",
  // Primary WhatsApp number for quotes and enquiries
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919311226050",
  // Primary phone
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+91 9311226050",
  // All verified contact numbers
  contactPhones: [
    "+91 9311226050",
    "+91 9312506050",
    "+91 9718996050",
    "+91 9255738938",
  ],
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "sales@hrkfilters.com",
  address: "Karol Bagh, New Delhi, India",
  factoryLocation: "Karol Bagh, New Delhi, India",
  plantLocation: "Karol Bagh, New Delhi, India",
  instagramUrl: "https://www.instagram.com/hrkfilters/",
  youtubeUrl: "https://www.youtube.com/@hrkfilters",
};
