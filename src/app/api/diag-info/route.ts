import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'MISSING',
    active_env_keys: Object.keys(process.env).filter(key => key.includes('FIREBASE')).sort(),
    node_env: process.env.NODE_ENV,
  })
}
