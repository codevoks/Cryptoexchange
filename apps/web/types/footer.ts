import { IconType } from "react-icons/lib";

export type FooterContent = {
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  content: FooterContent[];
};

export interface SocialMediaHandle {
  icon: IconType;
  link: string;
  label: string;
}

export interface Handles {
  Handles: SocialMediaHandle[];
}
