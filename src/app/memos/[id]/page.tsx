import { Suspense } from "react";
import { DetailShell, MemoDetailView } from "@/components/MemoDetailView";
import { SavedMemoDetail } from "@/components/SavedMemoDetail";
import { getMemo, memos } from "@/data/memos";

export function generateStaticParams() {
  return memos.map((m) => ({ id: m.id }));
}

async function MemoDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const memo = getMemo(id);
  // 기본 메모가 아니면 이 브라우저에 저장한 메모에서 찾는다
  return memo ? <MemoDetailView memo={memo} /> : <SavedMemoDetail id={id} />;
}

export default function MemoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<DetailShell />}>
      <MemoDetail params={params} />
    </Suspense>
  );
}
