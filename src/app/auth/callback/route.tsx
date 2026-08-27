import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')

  // If there's an error parameter from OAuth, redirect to login with error
  if (error) {
    console.error('OAuth error:', error)
    redirect(`/login?error=${encodeURIComponent('Authentication failed: ' + error)}`)
  }

  if (!code) {
    redirect('/login?error=No authentication code provided')
  }

  try {
    const supabase = await createClient()

    // Exchange the code for a session
    const { data: { user }, error: authError } = await supabase.auth.exchangeCodeForSession(code)

    if (authError || !user) {
      console.error('Auth exchange error:', authError)
      redirect('/login?error=Authentication failed')
    }

    // Check if profile exists, if not create one
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      // Create profile for new user
      await supabase.from('profiles').insert({
        id: user.id,
        display_name: user.email?.split('@')[0] || user.email,
      })
    }

    // Redirect to home page after successful authentication
    redirect('/')
  } catch (error) {
    console.error('Auth callback error:', error)
    redirect('/login?error=Unexpected error occurred')
  }
﻿import { createClient } from "@/utils/supabase/server";
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
