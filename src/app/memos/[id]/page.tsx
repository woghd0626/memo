import { Suspense } from "react";
import { DetailShell, MemoDetailView } from "@/components/MemoDetailView";
import { getMemo } from "@/lib/memos";

async function MemoDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const memo = await getMemo(id);
  if (!memo) {
    return (
      <DetailShell>
        <p className="text-body-md text-text-secondary">메모를 찾을 수 없어요</p>
      </DetailShell>
    );
  }
  return <MemoDetailView memo={memo} />;
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
