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

export const memos: Memo[] = [
  {
    id: "1", title: "디자인 리뷰 회의록", preview: "검수 기준과 다음 할 일 정리",
    date: "오늘", datetime: "10월 30일 오전 9:12", label: "blue", category: "업무", pinned: true,
    body: [{ type: "paragraph", text: "검수 기준과 다음 할 일 정리" }],
  },
  {
    id: "2", title: "주말 등산 준비", preview: "물 두 병, 간식, 바람막이 챙기기",
    date: "어제", datetime: "10월 29일 오후 6:40", label: "green", category: "개인", pinned: true,
    body: [
      { type: "heading", text: "준비 계획" },
      { type: "paragraph", text: "토요일 아침 7시에 출발한다.\n**날씨가 흐리면** 코스를 짧게 줄인다." },
      { type: "subheading", text: "챙길 것" },
      { type: "list", items: ["물 두 병", "간식과 초콜릿", "바람막이"] },
      { type: "subheading", text: "이동" },
      { type: "paragraph", text: "전철로 입구까지 가서 걸어 올라간다. 내려올 때는 케이블카를 탄다." },
      { type: "subheading", text: "남은 질문" },
      { type: "paragraph", text: "점심은 정상에서 먹을지, 내려와서 먹을지 정해야 한다." },
    ],
  },
  {
    id: "3", title: "장보기 목록", preview: "우유, 계란, 사과, 커피 원두",
    date: "오늘", datetime: "10월 30일 오전 8:05", label: "pink", category: "개인", pinned: false,
    body: [{ type: "list", items: ["우유", "계란", "사과", "커피 원두"] }],
  },
  {
    id: "4", title: "앱 아이콘 아이디어", preview: "메모지 모서리가 접힌 모양",
    date: "오늘", datetime: "10월 30일 오전 7:30", label: "orange", category: "아이디어", pinned: false,
    body: [{ type: "paragraph", text: "메모지 모서리가 접힌 모양" }],
  },
  {
    id: "5", title: "읽을 책", preview: "디자인 시스템 책 두 권",
    date: "어제", datetime: "10월 29일 오후 9:20", label: "green", category: "개인", pinned: false,
    body: [{ type: "paragraph", text: "디자인 시스템 책 두 권" }],
  },
];

export function getMemo(id: string) {
  return memos.find((m) => m.id === id);
}
