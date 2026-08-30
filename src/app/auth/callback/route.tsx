import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  console.log('[Auth Callback] Received:', {
    hasCode: !!code,
    error,
    errorDescription,
    url: requestUrl.toString()
  })

  // If there's an error parameter from OAuth, redirect to login with error
  if (error) {
    console.error('[Auth Callback] OAuth error:', error, errorDescription)
    redirect(`/login?error=${encodeURIComponent(errorDescription || error)}`)
  }

  if (!code) {
    console.error('[Auth Callback] No code provided')
    redirect('/login?error=No authentication code provided')
  }

  try {
    const supabase = await createClient()

    // Exchange the code for a session
    const { data: { user }, error: authError } = await supabase.auth.exchangeCodeForSession(code)

    if (authError || !user) {
      console.error('[Auth Callback] Auth exchange error:', authError)
      redirect(`/login?error=${encodeURIComponent(authError?.message || 'Authentication failed')}`)
    }

    console.log('[Auth Callback] Success! User:', user?.id)

    // Check if profile exists, if not create one
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user!.id)
      .single()

    if (!profile) {
      // Create profile for new user
      await supabase.from('profiles').insert({
        id: user!.id,
        display_name: user!.email?.split('@')[0] || user!.email,
      })
    }

    // Redirect to home page after successful authentication
    redirect('/')
  } catch (error: any) {
    // redirect() throws NEXT_REDIRECT internally - not a real error
    if (error?.digest?.startsWith('NEXT_REDIRECT')) throw error
    console.error('[Auth Callback] Unexpected error:', error)
    redirect('/login?error=Unexpected error occurred')
  }
}
