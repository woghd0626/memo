import type { Memo } from "@/data/memos";
import { Badge } from "./Badge";
import { ButtonIcon } from "./ButtonIcon";
import { ButtonPrimary } from "./ButtonPrimary";
import { MemoBody } from "./MemoBody";

/** 화면 틀: 위쪽 버튼 줄은 메모 내용을 기다리지 않고 바로 보인다 */
export function DetailShell({ children }: { children?: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col gap-space-16 px-space-16 pt-space-48 pb-space-34">
      <nav className="flex h-10 items-center justify-between">
        <ButtonIcon icon="chevron-left" label="뒤로가기" href="/" />
        <div className="flex">
          <ButtonIcon icon="pin-24" label="고정" />
          <ButtonIcon icon="share" label="공유" />
          <ButtonIcon icon="more" label="더보기" />
        </div>
      </nav>
      <main className="flex flex-1 flex-col">
        <article className="flex flex-1 flex-col gap-space-12 rounded-xl bg-surface-card px-space-20 py-space-24">
          {children}
        </article>
      </main>
      <div className="sticky bottom-space-34">
        <ButtonPrimary label="수정하기" />
      </div>
    </div>
  );
}

export function MemoDetailView({ memo }: { memo: Memo }) {
  return (
    <DetailShell>
      <div className="flex items-center gap-space-8">
        <Badge label={memo.category} color={memo.label} />
        <p className="text-caption-sm whitespace-nowrap text-text-muted">{memo.datetime}</p>
      </div>
      <h1 className="text-heading-lg text-text-primary">{memo.title}</h1>
      <div className="h-px w-full bg-border-default" />
      <MemoBody blocks={memo.body} />
    </DetailShell>
  );
}
