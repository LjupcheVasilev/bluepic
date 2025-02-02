import { NextRequest, NextResponse } from 'next/server'
import { OAuthResolverError } from '@atproto/oauth-client-node'
import { getClient } from '@/lib/oauthClient'

// Helper function to validate handle
const isValidHandle = (handle: string): boolean => {
  // Basic handle validation 
  // Can be expanded with more complex validation if needed
  const handleRegex = /^[a-zA-Z0-9_\.]+$/
  return handleRegex.test(handle) && handle.length >= 3 && handle.length <= 30
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json()
    const handle = body?.handle


    // Validate handle
    if (typeof handle !== 'string' || !isValidHandle(handle)) {
      return NextResponse.json({ 
        error: 'Invalid handle' 
      }, { 
        status: 400 
      })
    }

    // Create OAuth client
    const oauthClient = await getClient()

    // Initiate the OAuth flow
    try {
      const url = await oauthClient.authorize(handle, {
        scope: 'atproto transition:generic',
      })
      
      // Redirect to the authorization URL
      return NextResponse.json({url: url.toString()})
    } catch (err) {
      // Log the error
      console.error('OAuth authorize failed', err)

      // Handle specific OAuth resolver errors
      const errorMessage = 
        err instanceof OAuthResolverError 
          ? err.message 
          : "Couldn't initiate login"

      return NextResponse.json({ 
        error: errorMessage 
      }, { 
        status: 500 
      })
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error('Login route error', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { 
      status: 500 
    })
  }
}