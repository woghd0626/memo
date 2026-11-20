"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { categories, type Block, type Category, type Memo } from "@/data/memos";
import { blocksToHtml, formatNow, htmlToBlocks, previewOf } from "@/lib/editor";
import { addMemo, clearDraft, getDraft, setDraft, useHydrated } from "@/lib/memoStore";
import { ButtonFormat } from "./ButtonFormat";
import { ButtonIcon } from "./ButtonIcon";
import { ButtonPrimary } from "./ButtonPrimary";
import { Chip } from "./Chip";
import { LabelDot } from "./LabelDot";
import type { MemoLabel } from "./MemoItem";

const colors: { color: MemoLabel; name: string }[] = [
  { color: "blue", name: "파란색" },
  { color: "green", name: "초록색" },
  { color: "orange", name: "주황색" },
  { color: "pink", name: "분홍색" },
];

const frame =
  "mx-auto flex min-h-dvh w-full max-w-[390px] flex-col gap-space-16 px-space-16 pt-space-48 pb-space-34";

/** 저장소는 브라우저에서만 읽을 수 있어서, 화면이 붙은 뒤에 폼을 보여 준다 */
export function WriteView() {
  const hydrated = useHydrated();
  if (!hydrated) return <div className={frame} />;
  return <WriteForm />;
}

function WriteForm() {
  const router = useRouter();
  const [draft] = useState(getDraft);
  const [title, setTitle] = useState(draft?.title ?? "");
  const [category, setCategory] = useState<Category>(draft?.category ?? "개인");
  const [color, setColor] = useState<MemoLabel>(draft?.color ?? "blue");
  const [blocks, setBlocks] = useState<Block[]>(draft?.blocks ?? []);
  const [initialHtml] = useState(() => blocksToHtml(draft?.blocks ?? []));
  const [fmt, setFmt] = useState({ bold: false, block: "", list: false });
  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const syncFmt = useCallback(() => {
    const sel = document.getSelection();
    const ed = editorRef.current;
    if (!ed || !sel?.anchorNode || !ed.contains(sel.anchorNode)) return;
    setFmt({
      bold: document.queryCommandState("bold"),
      block: String(document.queryCommandValue("formatBlock")).toLowerCase(),
      list: document.queryCommandState("insertUnorderedList"),
    });
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", syncFmt);
    return () => document.removeEventListener("selectionchange", syncFmt);
  }, [syncFmt]);

  function persist(next: Partial<{ title: string; category: Category; color: MemoLabel; blocks: Block[] }>) {
    setDraft({ title, category, color, blocks, ...next });
  }

  function onTitle(v: string) {
    setTitle(v);
    persist({ title: v });
  }
  function onCategory(v: Category) {
    setCategory(v);
    persist({ category: v });
  }
  function onColor(v: MemoLabel) {
    setColor(v);
    persist({ color: v });
  }
  function onEditorInput() {
    const next = htmlToBlocks(editorRef.current!);
    setBlocks(next);
    persist({ blocks: next });
  }

  function format(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    onEditorInput();
    syncFmt();
  }

  function save() {
    const t = title.trim();
    const body = htmlToBlocks(editorRef.current!);
    if (!t && body.length === 0) {
      titleRef.current?.focus();
      return;
    }
    const memo: Memo = {
      id: `u-${Date.now()}`,
      title: t || "제목 없는 메모",
      preview: previewOf(body),
      date: "오늘",
      datetime: formatNow(),
      label: color,
      category,
      pinned: false,
      body,
    };
    addMemo(memo);
    clearDraft();
    router.push("/");
  }

  const hasContent = title.trim() !== "" || blocks.length > 0;

  return (
    <div className={frame}>
      <nav className="flex h-10 items-center justify-between">
        <ButtonIcon icon="chevron-left" label="뒤로가기" href="/" />
        {hasContent && <p className="text-caption-sm whitespace-nowrap text-text-muted">자동 저장됨</p>}
      </nav>

      <main className="flex flex-1 flex-col gap-space-12">
        <label className="flex flex-col gap-space-4 rounded-lg bg-surface-card px-space-20 py-space-16 focus-within:ring-2 focus-within:ring-primary">
          <span className="text-caption-sm text-text-muted">제목</span>
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => onTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full bg-transparent text-title-md text-text-primary outline-none placeholder:text-text-muted"
          />
        </label>

        <div className="flex flex-col gap-space-12 px-space-8 py-space-4">
          <div className="flex items-center gap-space-8" role="group" aria-label="분류">
            <p className="text-caption-sm whitespace-nowrap text-text-muted">분류</p>
            {categories.map((c) => (
              <Chip key={c} label={c} selected={category === c} onClick={() => onCategory(c)} />
            ))}
          </div>
          <div className="flex items-center gap-space-8" role="group" aria-label="색">
            <p className="text-caption-sm whitespace-nowrap text-text-muted">색</p>
            {colors.map((c) => (
              <LabelDot
                key={c.color}
                color={c.color}
                name={c.name}
                selected={color === c.color}
                onClick={() => onColor(c.color)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col overflow-clip rounded-lg border-2 border-border-default bg-surface-card focus-within:border-primary">
          <div className="flex h-[52px] items-center gap-space-4 px-space-12" role="toolbar" aria-label="서식">
            <ButtonFormat label="B" active={fmt.bold} onClick={() => format("bold")} />
            <ButtonFormat
              label="제목"
              active={fmt.block === "h2"}
              onClick={() => format("formatBlock", fmt.block === "h2" ? "div" : "h2")}
            />
            <ButtonFormat
              label="소제목"
              active={fmt.block === "h3"}
              onClick={() => format("formatBlock", fmt.block === "h3" ? "div" : "h3")}
            />
            <ButtonFormat
              label="목록"
              active={fmt.list}
              onClick={() => format("insertUnorderedList")}
            />
          </div>
          <div className="h-px w-full bg-border-default" />
          <div
            ref={editorRef}
            contentEditable
            role="textbox"
            aria-multiline="true"
            aria-label="본문"
            data-placeholder="내용을 입력하세요"
            dangerouslySetInnerHTML={{ __html: initialHtml }}
            onInput={onEditorInput}
            onPaste={(e) => {
              // 서식 없이 글자만 붙여 넣는다
              e.preventDefault();
              document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
            }}
            className="min-h-40 px-space-20 py-space-16 text-body-md text-text-secondary outline-none empty:before:text-text-muted empty:before:content-[attr(data-placeholder)] [&_b]:text-body-md-bold [&_b]:text-text-primary [&>*+*]:mt-space-8 [&_h2]:text-title-lg [&_h2]:text-text-primary [&_h3]:text-title-md [&_h3]:text-text-primary [&_li+li]:mt-space-4 [&_ul]:list-disc [&_ul]:pl-space-20"
          />
        </div>
      </main>

      <div className="sticky bottom-space-34">
        <ButtonPrimary label="저장하기" onClick={save} />
      </div>
    </div>
  );
}
