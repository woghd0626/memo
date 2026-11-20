import type { MemoLabel } from "@/components/MemoItem";

export type Category = "업무" | "개인" | "아이디어";

/** 본문 한 덩어리. 문단은 **굵게** 표시를 쓸 수 있다 */
export type Block =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export type Memo = {
  id: string;
  title: string;
  preview: string;
  date: string;
  datetime: string;
  label: MemoLabel;
  category: Category;
  pinned: boolean;
  body: Block[];
};

export const categories: Category[] = ["업무", "개인", "아이디어"];
