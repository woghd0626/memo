import Link from "next/link";
import { Icon } from "./Icon";

type ButtonPrimaryProps = {
  label: string;
  icon?: boolean;
  onClick?: () => void;
  /** 있으면 링크로 동작한다 */
  href?: string;
};

const box =
  "flex h-14 w-full items-center justify-center gap-space-8 rounded-md bg-primary px-space-24 text-button-md text-text-on-primary";

export function ButtonPrimary({ label, icon = false, onClick, href }: ButtonPrimaryProps) {
  const content = (
    <>
      {icon && <Icon name="plus" className="size-5" />}
      {label}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={box}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={box}>
      {content}
    </button>
  );
}
