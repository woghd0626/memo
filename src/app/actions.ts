"use server";

import { revalidatePath } from "next/cache";
import { categories, type Block, type Category } from "@/data/memos";
import { previewOf } from "@/lib/editor";
import { getSupabase } from "@/lib/supabase";

const labels = ["blue", "green", "orange", "pink"] as const;

type NewMemo = {
  title: string;
  category: Category;
  label: (typeof labels)[number];
  body: Block[];
};

/** 작성 화면에서 저장한 메모를 Supabase에 넣는다 */
export async function createMemo(input: NewMemo): Promise<{ ok: true } | { ok: false; error: string }> {
  const title = String(input.title ?? "").trim();
  if (!categories.includes(input.category) || !labels.includes(input.label) || !Array.isArray(input.body)) {
    return { ok: false, error: "메모 내용이 올바르지 않아요" };
  }
  if (!title && input.body.length === 0) {
    return { ok: false, error: "제목이나 내용을 입력해 주세요" };
  }

  const { error } = await getSupabase()
    .from("memos")
    .insert({
      title: title || "제목 없는 메모",
      preview: previewOf(input.body),
      category: input.category,
      label: input.label,
      pinned: false,
      body: input.body,
    });
  if (error) return { ok: false, error: "저장하지 못했어요. 잠시 뒤 다시 해 주세요" };

  revalidatePath("/");
  return { ok: true };
}
