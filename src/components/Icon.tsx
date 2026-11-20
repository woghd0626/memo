type IconName =
  | "plus"
  | "note"
  | "pin"
  | "pin-24"
  | "chevron-right"
  | "chevron-left"
  | "share"
  | "more";

type IconProps = {
  name: IconName;
  /** 크기와 글자색(text-*) 클래스. 색은 글자색을 따른다 */
  className?: string;
};

export function Icon({ name, className = "" }: IconProps) {
  const url = `url(/icons/${name}.svg)`;
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        maskImage: url,
        WebkitMaskImage: url,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  );
}
