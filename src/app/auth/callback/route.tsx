import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // ส่งกลับไปหน้า Home หลังจาก Login สำเร็จ
      return NextResponse.redirect(`${origin}/`);
    } else {
      console.error("Auth exchange error:", error);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }
  }

  // ไม่มี code ให้กลับหน้า login
  return NextResponse.redirect(`${origin}/login`);
}
