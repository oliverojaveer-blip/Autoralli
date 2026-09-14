import { NextResponse, type NextRequest } from 'next/server'

/**
 * Keele-URL-id: eesti keel on vaikimisi ja ILMA prefiksita (`/kalender`),
 * inglise keel `/en` prefiksiga (`/en/kalender`). Kõik lehed elavad
 * `app/[locale]/` all, seega eestikeelsed teed kirjutatakse sisemiselt
 * `/et/...` peale ümber (aadressiribal jääb `/kalender`). Otse küsitud
 * `/et/...` suunatakse kanoonilisele prefiksita teele.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return NextResponse.next()
  }

  if (pathname === '/et' || pathname.startsWith('/et/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(3) || '/'
    return NextResponse.redirect(url, 308)
  }

  const url = request.nextUrl.clone()
  url.pathname = `/et${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Ei puuduta API-t, Sanity Studiot, Next'i sisemisi teid ega staatilisi faile (laiendiga).
  matcher: ['/((?!api|studio|_next|.*\\..*).*)'],
}
