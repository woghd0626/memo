import type { Block, Category, Memo } from "@/data/memos";
import type { MemoLabel } from "@/components/MemoItem";
import { getSupabase } from "./supabase";

type MemoRow = {
  id: string;
  title: string;
  preview: string;
  category: Category;
  label: MemoLabel;
  pinned: boolean;
  body: Block[];
  created_at: string;
};

const COLUMNS = "id, title, preview, category, label, pinned, body, created_at";
const TZ = "Asia/Seoul";

function parts(d: Date) {
  const get = (opt: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("ko-KR", { timeZone: TZ, ...opt }).format(d);
  return {
    ymd: new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d),
    monthDay: get({ month: "long", day: "numeric" }),
    time: get({ hour: "numeric", minute: "2-digit", hour12: true }),
  };
}

/** 목록에 보일 날짜: 오늘 / 어제 / 10월 30일 */
function relativeDate(created: Date, now: Date) {
  const c = parts(created);
  if (c.ymd === parts(now).ymd) return "오늘";
  if (c.ymd === parts(new Date(now.getTime() - 24 * 60 * 60 * 1000)).ymd) return "어제";
  return c.monthDay;
}

function toMemo(row: MemoRow, now: Date): Memo {
  const created = new Date(row.created_at);
  return {
    id: row.id,
    title: row.title,
    preview: row.preview,
    date: relativeDate(created, now),
    datetime: `${parts(created).monthDay} ${parts(created).time}`,
    label: row.label,
    category: row.category,
    pinned: row.pinned,
    body: row.body,
  };
}

/** 모든 메모, 새로 쓴 것이 앞 */
export async function getMemos(): Promise<Memo[]> {
  const { data, error } = await getSupabase()
    .from("memos")
    .select(COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`메모를 불러오지 못했어요: ${error.message}`);
  const now = new Date();
  return (data as MemoRow[]).map((row) => toMemo(row, now));
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** 메모 하나. 없으면 null */
export async function getMemo(id: string): Promise<Memo | null> {
  if (!UUID.test(id)) return null;
  const { data, error } = await getSupabase()
    .from("memos")
    .select(COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`메모를 불러오지 못했어요: ${error.message}`);
  return data ? toMemo(data as MemoRow, new Date()) : null;
}
