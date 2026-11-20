"use client";

import { useHydrated, useSavedMemos } from "@/lib/memoStore";
import { DetailShell, MemoDetailView } from "./MemoDetailView";

/** 이 브라우저에 저장한 메모의 상세 화면 */
export function SavedMemoDetail({ id }: { id: string }) {
  const hydrated = useHydrated();
  const saved = useSavedMemos();
  if (!hydrated) return <DetailShell />;
  const memo = saved.find((m) => m.id === id);
  if (!memo) {
    return (
      <DetailShell>
        <p className="text-body-md text-text-secondary">메모를 찾을 수 없어요</p>
      </DetailShell>
    );
  }
  return <MemoDetailView memo={memo} />;
}
