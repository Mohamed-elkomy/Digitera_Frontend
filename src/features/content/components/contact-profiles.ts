import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
} from "@/components/icons";
import type { IconProps } from "@/components/icons/icon.types";

export type SocialProfile = {
  name: string;
  handle: string;
  href: string;
  Icon: (props: IconProps) => React.ReactNode;
  tag: string;
};

export const PHONE_NUMBER = "+20 127 278 2474";
export const RAW_PHONE = "201272782474";
export const EMAIL = "mohamedmagdyelkomy53@gmail.com";

export const socialLinks: SocialProfile[] = [
  {
    name: "LinkedIn",
    handle: "mohamed-magdy-elkomy",
    href: "https://www.linkedin.com/in/mohamed-magdy-elkomy/",
    Icon: LinkedInIcon,
    tag: "Professional",
  },
  {
    name: "GitHub",
    handle: "Mohamed-elkomy",
    href: "https://github.com/Mohamed-elkomy",
    Icon: GitHubIcon,
    tag: "Source Code",
  },
  {
    name: "Instagram (Creative / Video)",
    handle: "@sukoon.t_74",
    href: "https://www.instagram.com/sukoon.t_74/",
    Icon: InstagramIcon,
    tag: "Portfolio & Visuals",
  },
  {
    name: "Instagram (Personal)",
    handle: "@mo.magdy_74",
    href: "https://www.instagram.com/mo.magdy_74/",
    Icon: InstagramIcon,
    tag: "Personal Profile",
  },
  {
    name: "TikTok (Creative / Video)",
    handle: "@sukoon.t_74",
    href: "https://www.tiktok.com/@sukoon.t_74",
    Icon: TikTokIcon,
    tag: "Cinematic & Reels",
  },
  {
    name: "TikTok (Personal)",
    handle: "@mo.magdy_74",
    href: "https://www.tiktok.com/@mo.magdy_74",
    Icon: TikTokIcon,
    tag: "Daily Clips",
  },
  {
    name: "Facebook",
    handle: "Mohamed Magdy Elkomy",
    href: "https://www.facebook.com/Hacker.XCom",
    Icon: FacebookIcon,
    tag: "Social",
  },
];
