import { NextRequest, NextResponse } from 'next/server'
import { renderMapSVG } from '../../../../server/map-render-svg.mjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const u = request.nextUrl
    const themeId = u.searchParams.get('theme') || body.theme || body.themeId || 'ansi-16'
    const padding = parseInt(u.searchParams.get('padding') || body.padding || '1', 10)
    const scale = u.searchParams.get('scale') ? parseFloat(u.searchParams.get('scale')!) : (body.scale ? parseFloat(body.scale) : undefined)

    const svg = renderMapSVG(body, { themeId, padding, scale })
    return new NextResponse(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' } })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return new NextResponse(`Error: ${msg}`, { status: 400 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const u = request.nextUrl
    const dataB64 = u.searchParams.get('data')
    if (!dataB64) return new NextResponse('Missing "data" parameter', { status: 400 })
    const json = Buffer.from(dataB64, 'base64').toString('utf-8')
    const data = JSON.parse(json)
    const themeId = u.searchParams.get('theme') || 'ansi-16'
    const padding = parseInt(u.searchParams.get('padding') || '1', 10)
    const scale = u.searchParams.get('scale') ? parseFloat(u.searchParams.get('scale')!) : undefined

    const svg = renderMapSVG(data, { themeId, padding, scale })
    return new NextResponse(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' } })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return new NextResponse(`Error: ${msg}`, { status: 400 })
  }
}
