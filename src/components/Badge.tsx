import { labelTile, type MemoLabel } from "./MemoItem";

type BadgeProps = { label: string; color: MemoLabel };

export function Badge({ label, color }: BadgeProps) {
  return (
    <span
      className={`flex h-[26px] items-center rounded-full px-space-8 text-caption-sm whitespace-nowrap ${labelTile[color]}`}
    >
      {label}
    </span>
  );
}
