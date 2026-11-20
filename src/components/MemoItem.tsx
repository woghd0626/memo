import Link from "next/link";
import { Icon } from "./Icon";

export type MemoLabel = "blue" | "green" | "orange" | "pink";

export const labelTile: Record<MemoLabel, string> = {
  blue: "bg-label-blue-soft text-label-blue",
  green: "bg-label-green-soft text-label-green",
  orange: "bg-label-orange-soft text-label-orange",
  pink: "bg-label-pink-soft text-label-pink",
};

type MemoItemProps = {
  id: string;
  title: string;
  preview: string;
  date: string;
  label: MemoLabel;
};

export function MemoItem({ id, title, preview, date, label }: MemoItemProps) {
  return (
    <li>
      <Link
        href={`/memos/${id}`}
        className="flex h-18 items-center gap-space-16 px-space-20 py-space-12"
      >
        <div className={`flex size-11 shrink-0 items-center justify-center rounded-sm ${labelTile[label]}`}>
          <Icon name="note" className="size-[22px]" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-space-4">
          <p className="text-title-md text-text-primary">{title}</p>
          <p className="truncate text-body-sm text-text-secondary">{preview}</p>
        </div>
        <p className="shrink-0 text-caption-sm whitespace-nowrap text-text-muted">{date}</p>
      </Link>
    </li>
  );
}
