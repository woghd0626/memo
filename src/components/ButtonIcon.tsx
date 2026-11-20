import Link from "next/link";
import { Icon } from "./Icon";

type ButtonIconProps = {
  icon: "chevron-left" | "pin-24" | "share" | "more";
  label: string;
  /** 있으면 링크로 동작한다 */
  href?: string;
};

const box = "flex size-10 items-center justify-center rounded-sm text-text-primary";

export function ButtonIcon({ icon, label, href }: ButtonIconProps) {
  const inner = <Icon name={icon} className="size-6" />;
  if (href) {
    return (
      <Link href={href} aria-label={label} className={box}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" aria-label={label} className={box}>
      {inner}
    </button>
  );
}
