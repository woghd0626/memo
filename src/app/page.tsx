import { Suspense } from "react";
import { HomeView } from "@/components/HomeView";
import { getMemos } from "@/lib/memos";

async function HomeMemos() {
  const memos = await getMemos();
  return <HomeView memos={memos} />;
}

export default function Home() {
  return (
    <Suspense fallback={<HomeView memos={[]} loading />}>
      <HomeMemos />
    </Suspense>
  );
}
