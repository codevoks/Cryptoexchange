import Link from "next/link";
import { topNavButtonStyle } from "../styles/buttonStyles/topNavButtonStyle";

type TopHeaderButtonProp = {
  text: string;
  href?: string;
};

export default function TopHeaderButton({ text, href }: TopHeaderButtonProp) {
  if (href) {
    return (
      <Link href={href} className={topNavButtonStyle}>
        {text}
      </Link>
    );
  }
  return (
    <button className={topNavButtonStyle}>
      {text}
    </button>
  );
}