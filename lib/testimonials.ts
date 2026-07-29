// Single source of truth for homepage testimonials — consumed by the
// TestimonialsSection UI and by the Organization review/aggregateRating JSON-LD.
export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Bluebird Provisions",
    role: "Store Owner",
    company: "Canada",
    content:
      "Amazing app for a store locator. Works perfectly for us and the support is fantastic and helped me fix all my issues.",
    rating: 5,
    avatar: "BP",
  },
  {
    name: "Robert Piguet",
    role: "Business Owner",
    company: "United States",
    content:
      "Easy to use app for store locator page. You get various options for customizing the map look to fit your page aesthetic. The support team was great and very fast responding to emails.",
    rating: 5,
    avatar: "RP",
  },
  {
    name: "Byron Bay Olive Co.",
    role: "Store Manager",
    company: "Australia",
    content:
      "Easy to use and great looking page. Now that they figured out the google maps issue this app works perfectly!",
    rating: 5,
    avatar: "BO",
  },
  {
    name: "gabrielcosmetics",
    role: "E-commerce Manager",
    company: "United States",
    content:
      "We have been using this app for 6 months seamlessly. Setup was easy and the team is helpful. We had a minor glitch and they fixed it the day we reached out.",
    rating: 5,
    avatar: "GC",
  },
  {
    name: "Intoleran",
    role: "Business Owner",
    company: "Australia",
    content:
      "Works well, easy to use upload template to upload bulk list of locations and received quick support from customer service, thanks",
    rating: 5,
    avatar: "IN",
  },
];
