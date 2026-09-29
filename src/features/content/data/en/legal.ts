import type { ContentPage } from "@/features/content/types/content.types";

/**
 * The two pages the registration checkbox refers to. This is a portfolio
 * build, and the copy says so rather than pretending to be enforceable.
 */
export const legalPages: ContentPage[] = [
  {
    slug: "terms",
    eyebrow: "Legal",
    title: "Terms of Sale",
    intro:
      "This storefront is a front-end demonstration built for a bootcamp. No goods are sold and no money changes hands.",
    sections: [
      {
        heading: "What this site is",
        body: [
          "Odoratus is a fictional house. The products, prices and descriptions were written for this project and do not correspond to anything you can buy.",
          "Placing an order here creates a record in your own browser and nothing more. No order is transmitted, fulfilled or charged for.",
        ],
      },
      {
        heading: "Accounts",
        body: [
          "Signing in does not verify anything. Any email and password are accepted, and the session is stored in your browser until you sign out.",
          "Because of that, never enter a password you use anywhere else.",
        ],
      },
      {
        heading: "If this were a real store",
        body: [
          "Orders would be confirmed by email, prices would include applicable tax, and the returns window described in Shipping & Returns would apply from the day of delivery.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    eyebrow: "Legal",
    title: "Privacy Policy",
    intro:
      "What we keep, where, who can see it, and how to have it removed. No payment details are ever collected on this site.",
    sections: [
      {
        heading: "In your browser",
        body: [
          "Your bag, your wishlist and a copy of your recent orders are kept in this browser's local storage. Your language and theme are kept in a cookie so pages render correctly.",
          "If you have an account, a signed, httpOnly session cookie keeps you signed in. Scripts on the page cannot read it.",
        ],
      },
      {
        heading: "On our side",
        body: [
          "When you place an order we keep what the order needs: the items, your name, phone, delivery address, optional email and note. Messages from the contact form and reviews you write are kept too.",
          "If you create an account we keep your name and email. Your password is stored only as a salted, one-way hash — nobody, including us, can read it back.",
          "This data is held in a private database (Sanity) and the site is served over HTTPS. There is no analytics, no advertising and no third-party tracking script.",
        ],
      },
      {
        heading: "Who can see it",
        body: [
          "Only the house's team, to confirm and deliver your order and answer your messages. Reviews appear on the site only after we approve them, with the name you chose.",
        ],
      },
      {
        heading: "Removing it",
        body: [
          "Signing out ends the session. Clearing site data in your browser removes everything kept there. To have your account, orders or messages deleted from our side, message us on WhatsApp or email from the contact page.",
          "On the demo version of this site, with no database connected, nothing leaves your browser at all.",
        ],
      },
    ],
  },
];
