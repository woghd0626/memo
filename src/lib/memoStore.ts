"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { Block, Category, Memo } from "@/data/memos";
import type { MemoLabel } from "@/components/MemoItem";

const MEMOS_KEY = "memo-app:memos";
const DRAFT_KEY = "memo-app:draft";
const EMPTY = "[]";

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function read(key: string, fallback: string) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // 저장 공간이 막혀 있으면(사생활 보호 모드 등) 저장하지 않는다
  }
}

/** 이 브라우저에 저장한 메모들 (새로 쓴 것이 앞) */
export function useSavedMemos(): Memo[] {
  const raw = useSyncExternalStore(
    subscribe,
    () => read(MEMOS_KEY, EMPTY),
    () => EMPTY,
  );
  return useMemo(() => {
    try {
      const list = JSON.parse(raw);
      return Array.isArray(list) ? (list as Memo[]) : [];
    } catch {
      return [];
    }
  }, [raw]);
}

/** 브라우저에서 화면이 붙은 뒤에만 true. 저장소를 읽는 화면이 서버 화면과 어긋나지 않게 한다 */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function addMemo(memo: Memo) {
  let list: Memo[] = [];
  try {
    const parsed = JSON.parse(read(MEMOS_KEY, EMPTY));
    if (Array.isArray(parsed)) list = parsed;
  } catch {}
  write(MEMOS_KEY, JSON.stringify([memo, ...list]));
  notify();
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
