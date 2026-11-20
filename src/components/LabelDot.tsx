import type { MemoLabel } from "./MemoItem";

const dot: Record<MemoLabel, string> = {
  blue: "bg-label-blue",
  green: "bg-label-green",
  orange: "bg-label-orange",
  pink: "bg-label-pink",
};

type LabelDotProps = {
  color: MemoLabel;
  name: string;
  selected?: boolean;
  onClick?: () => void;
};

export function LabelDot({ color, name, selected = false, onClick }: LabelDotProps) {
  return (
    <button
      type="button"
      aria-label={name}
      aria-pressed={selected}
      onClick={onClick}
      className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 ${
        selected ? "border-primary" : "border-transparent"
      }`}
    >
      <span className={`size-[22px] rounded-full ${dot[color]}`} />
    </button>
  );
}
