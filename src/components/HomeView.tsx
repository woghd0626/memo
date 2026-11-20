"use client";

import { useState } from "react";
import { categories, type Category, type Memo } from "@/data/memos";
import { ButtonPrimary } from "./ButtonPrimary";
import { CardHeader } from "./CardHeader";
import { Chip } from "./Chip";
import { MemoItem } from "./MemoItem";

type Filter = "전체" | Category;

export function HomeView({ memos, loading = false }: { memos: Memo[]; loading?: boolean }) {
  const [filter, setFilter] = useState<Filter>("전체");
  const shown = memos.filter((m) => filter === "전체" || m.category === filter);
  const pinned = shown.filter((m) => m.pinned);
  const recent = shown.filter((m) => !m.pinned);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col gap-space-16 px-space-16 pt-space-64 pb-space-34">
      <main className="flex flex-1 flex-col gap-space-16">
        <header className="flex flex-col gap-space-8 px-space-8">
          <p className="text-caption-md text-text-muted">10월 30일 금요일</p>
          <h1 className="text-heading-xl text-text-primary">
            오늘까지 메모를
            <br />
            <span className="text-primary">{loading ? "···" : `${memos.length}개`}</span> 남겼어요
          </h1>
        </header>

        <div className="flex gap-space-8 overflow-x-auto px-space-4" role="group" aria-label="분류">
          {(["전체", ...categories] as Filter[]).map((c) => (
            <Chip key={c} label={c} selected={filter === c} onClick={() => setFilter(c)} />
          ))}
        </div>

        {pinned.length > 0 && (
          <section className="flex flex-col rounded-xl bg-surface-card py-space-8">
            <CardHeader title="고정한 메모" pin />
            <ul>
              {pinned.map((m) => (
                <MemoItem key={m.id} {...m} />
              ))}
            </ul>
          </section>
        )}

        {recent.length > 0 && (
          <section className="flex flex-col rounded-xl bg-surface-card py-space-8">
            <CardHeader title="최근 메모" action />
            <ul>
              {recent.map((m) => (
                <MemoItem key={m.id} {...m} />
              ))}
            </ul>
          </section>
        )}
      </main>

      <div className="sticky bottom-space-34">
        <ButtonPrimary label="새 메모 쓰기" icon href="/write" />
      </div>
    </div>
  );
}
