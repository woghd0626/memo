"use client";

import { useSyncExternalStore } from "react";
import type { Block, Category } from "@/data/memos";
import type { MemoLabel } from "@/components/MemoItem";

const DRAFT_KEY = "memo-app:draft";

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // 저장 공간이 막혀 있으면(사생활 보호 모드 등) 저장하지 않는다
  }
}

/** 브라우저에서 화면이 붙은 뒤에만 true. 저장소를 읽는 화면이 서버 화면과 어긋나지 않게 한다 */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export type Draft = {
  title: string;
  category: Category;
  color: MemoLabel;
  blocks: Block[];
};

export function getDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}

export function setDraft(draft: Draft) {
  write(DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
}
