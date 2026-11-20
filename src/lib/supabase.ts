import { createClient } from "@supabase/supabase-js";

/** 서버에서 쓰는 Supabase 클라이언트. 접속 주소와 공개 키는 .env.local에서 읽는다 */
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      ".env.local에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY를 넣어 주세요",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
